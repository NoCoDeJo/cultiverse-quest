import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const galadrielApiKey = Deno.env.get('GALADRIEL_API_KEY');
const gaianetModel = Deno.env.get('GAIANET_MODEL') || 'gpt-4o-mini';
const gaianetServerUrl = Deno.env.get('GAIANET_SERVER_URL') || 'https://qwen7b.gaia.domains/v1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!galadrielApiKey) {
    return new Response(
      JSON.stringify({ error: 'Galadriel API key not configured' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      throw new Error('No prompt provided');
    }

    console.log(`Sending request to Gaia Net (${gaianetModel}) with prompt: ${prompt}`);

    const response = await fetch(gaianetServerUrl + '/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${galadrielApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: gaianetModel,
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant for the cult dashboard, providing insights and suggestions. Always return data in the exact format requested by the user.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Gaia Net API error:', error);
      throw new Error(error.error?.message || 'Failed to generate response');
    }

    const data = await response.json();
    console.log('Gaia Net response:', data);
    
    const generatedText = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ generatedText }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-with-ai function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate AI response',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});