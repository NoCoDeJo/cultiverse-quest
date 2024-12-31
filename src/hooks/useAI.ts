import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAI = () => {
  const { toast } = useToast();

  const generateWithAI = async (prompt: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-with-ai', {
        body: { prompt },
      });

      if (error) throw error;

      return data.generatedText;
    } catch (error) {
      console.error('AI generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  return { generateWithAI };
};