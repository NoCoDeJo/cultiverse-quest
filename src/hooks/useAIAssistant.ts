import { useAI } from "./useAI";
import { useToast } from "./use-toast";

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

  const generateDescription = async (topic: string) => {
    try {
      const prompt = `Write a compelling 2-3 sentence description for a cult focused on: ${topic}`;
      const response = await generateWithAI(prompt);
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
  };
};