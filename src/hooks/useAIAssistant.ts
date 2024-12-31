import { useAI } from "./useAI";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAIAssistant = () => {
  const { generateWithAI } = useAI();
  const { toast } = useToast();

  const generateCultInfo = async () => {
    try {
      const prompt = `Generate a creative cult concept including:
      - A unique and memorable cult name
      - A compelling description (2-3 sentences)
      - A theme color (hex code)
      - A Twitter handle (without @ symbol)
      Format as JSON with keys: name, description, theme_color, twitter_handle`;

      const response = await generateWithAI(prompt);
      if (!response) throw new Error("No response from AI");

      const data = JSON.parse(response);
      return data;
    } catch (error) {
      console.error("Error generating cult info:", error);
      toast({
        title: "Error",
        description: "Failed to generate cult information",
        variant: "destructive",
      });
      return null;
    }
  };

  const generateFromTwitter = async (username: string) => {
    try {
      const { data: twitterData, error } = await supabase.functions.invoke('twitter-auth', {
        body: { username },
      });

      if (error) throw error;
      if (!twitterData?.data?.data) throw new Error("No Twitter data found");

      const userData = twitterData.data.data;
      
      // Generate a cult name based on the Twitter profile
      const namePrompt = `Generate a mystical cult name based on this Twitter bio: "${userData.description}". Return just the name, no explanation.`;
      const cultName = await generateWithAI(namePrompt);

      return {
        name: cultName || `Cult of ${userData.name}`,
        description: userData.description || "A mysterious cult born from the digital realm",
        theme_color: "#2D1B69", // Default theme color
        twitter_handle: username,
      };
    } catch (error) {
      console.error("Error generating from Twitter:", error);
      toast({
        title: "Error",
        description: "Failed to fetch Twitter information",
        variant: "destructive",
      });
      return null;
    }
  };

  const generateDescription = async (topic: string) => {
    try {
      const prompt = `Write a compelling 2-3 sentence description for ${topic}. Make it mystical and engaging.`;
      const response = await generateWithAI(prompt);
      if (!response) throw new Error("No response from AI");
      return response;
    } catch (error) {
      console.error("Error generating description:", error);
      toast({
        title: "Error",
        description: "Failed to generate description",
        variant: "destructive",
      });
      return null;
    }
  };

  const generateLandingContent = async (cultName: string, cultType: string) => {
    try {
      const prompt = `Generate 3-4 important links for a cult named "${cultName}" of type "${cultType}". 
      Format as JSON array with objects containing: title, url`;

      const response = await generateWithAI(prompt);
      if (!response) throw new Error("No response from AI");

      const data = JSON.parse(response);
      return data;
    } catch (error) {
      console.error("Error generating landing content:", error);
      toast({
        title: "Error",
        description: "Failed to generate landing content",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    generateCultInfo,
    generateDescription,
    generateLandingContent,
    generateFromTwitter,
  };
};