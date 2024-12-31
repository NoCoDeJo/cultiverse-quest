import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SacredNameEditorProps {
  profileId: string;
  currentName: string;
}

export const SacredNameEditor = ({ profileId, currentName }: SacredNameEditorProps) => {
  const [sacredName, setSacredName] = useState(currentName);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ sacred_name: sacredName })
        .eq('id', profileId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Success",
        description: "Sacred name updated successfully",
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update sacred name",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-cultDark/80 border-cultGlow">
      <CardHeader>
        <CardTitle className="text-cultWhite">Sacred Identity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sacred-name" className="text-cultWhite">Sacred Name</Label>
          <Input
            id="sacred-name"
            value={sacredName}
            onChange={(e) => setSacredName(e.target.value)}
            className="bg-cultDark/50 border-cultGlow text-cultWhite"
          />
        </div>
        <Button
          onClick={handleUpdateProfile}
          className="w-full bg-cultPurple hover:bg-cultPurple/80 text-cultWhite"
        >
          Update Sacred Name
        </Button>
      </CardContent>
    </Card>
  );
};