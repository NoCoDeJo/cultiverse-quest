import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Twitter, Link } from "lucide-react";

const CultLanding = () => {
  const { customUrl } = useParams();

  const { data: cult, isLoading, error } = useQuery({
    queryKey: ['cult', customUrl],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cults')
        .select('*')
        .eq('custom_url', customUrl)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cultDark flex items-center justify-center">
        <div className="text-cultWhite text-xl animate-pulse">
          Loading cult page...
        </div>
      </div>
    );
  }

  if (error || !cult) {
    return (
      <div className="min-h-screen bg-cultDark p-4">
        <Alert variant="destructive">
          <AlertDescription>This cult page doesn't exist.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const landingContent = cult.landing_page_content?.sections || [];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-cultDark to-cultPurple"
      style={{ '--tw-gradient-to': cult.theme_color } as any}
    >
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          {cult.logo_url && (
            <img 
              src={cult.logo_url} 
              alt={cult.name}
              className="w-24 h-24 mx-auto rounded-full border-4"
              style={{ borderColor: cult.theme_color }}
            />
          )}
          <h1 className="text-4xl font-bold text-cultWhite">{cult.name}</h1>
          <p className="text-cultWhite/80">{cult.description}</p>
          
          {cult.twitter_handle && (
            <a
              href={`https://twitter.com/${cult.twitter_handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cultPurple/20 text-cultWhite hover:bg-cultPurple/40 transition-colors"
            >
              <Twitter className="w-4 h-4" />
              @{cult.twitter_handle}
            </a>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4">
          {landingContent.map((section: any, index: number) => (
            <a
              key={index}
              href={section.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full p-4 rounded-lg bg-cultDark/50 border border-cultGlow hover:bg-cultPurple/20 transition-all text-cultWhite text-center"
              style={{ borderColor: cult.theme_color }}
            >
              <span className="flex items-center justify-center gap-2">
                <Link className="w-4 h-4" />
                {section.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CultLanding;