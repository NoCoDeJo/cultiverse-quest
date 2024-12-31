import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import GenerateWithAIButton from "../../cult-form/GenerateWithAIButton";
import { useAIAssistant } from "@/hooks/useAIAssistant";

interface AboutMeEditorProps {
  profileId: string;
  currentDescription?: string;
}

export const AboutMeEditor = ({ profileId, currentDescription = '' }: AboutMeEditorProps) => {
  const [description, setDescription] = useState(currentDescription);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { generateDescription } = useAIAssistant();

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ description: description })
        .eq('id', profileId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Success",
        description: "Profile description updated successfully",
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile description",
        variant: "destructive",
      });
    }
  };

  const handleGenerateDescription = async () => {
    const generatedText = await generateDescription("cultist profile");
    if (generatedText) {
      setDescription(generatedText);
    }
  };

  return (
    <Card className="bg-cultDark/80 border-cultGlow">
      <CardHeader>
        <CardTitle className="text-cultWhite">About Me</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-cultDark/50 border-cultGlow text-cultWhite min-h-[120px]"
            placeholder="Share your mystical journey..."
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleUpdateProfile}
            className="flex-1 bg-cultPurple hover:bg-cultPurple/80 text-cultWhite"
          >
            Update Description
          </Button>
          <GenerateWithAIButton onClick={handleGenerateDescription} />
        </div>
      </CardContent>
    </Card>
  );
};