import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import GenerateWithAIButton from "../cult-form/GenerateWithAIButton";
import { useAIAssistant } from "@/hooks/useAIAssistant";

interface CultAboutEditorProps {
  cultId: string;
  initialDescription: string | null;
}

const CultAboutEditor = ({ cultId, initialDescription }: CultAboutEditorProps) => {
  const [description, setDescription] = useState(initialDescription || '');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { generateDescription } = useAIAssistant();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('cults')
        .update({ description })
        .eq('id', cultId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Cult description updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating cult description:', error);
      toast({
        title: "Error",
        description: "Failed to update cult description",
        variant: "destructive",
      });
    }
  };

  const handleGenerateDescription = async () => {
    const generatedDescription = await generateDescription('cult');
    if (generatedDescription) {
      setDescription(generatedDescription);
    }
  };

  return (
    <Card className="bg-cultDark/50 border-cultGlow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-cultWhite">About</CardTitle>
        {!isEditing && (
          <Button 
            variant="outline" 
            className="border-cultGlow text-cultWhite hover:bg-cultPurple/20"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex justify-end">
              <GenerateWithAIButton onClick={handleGenerateDescription} />
            </div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] bg-cultDark/30 border-cultGlow text-cultWhite"
              placeholder="Describe your cult..."
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                className="border-cultGlow text-cultWhite hover:bg-cultPurple/20"
                onClick={() => {
                  setIsEditing(false);
                  setDescription(initialDescription || '');
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-cultGlow hover:bg-cultGlow/80"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-cultWhite/80">
            {description || 'No description provided.'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CultAboutEditor;