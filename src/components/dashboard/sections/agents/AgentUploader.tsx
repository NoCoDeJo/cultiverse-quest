import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

interface AgentUploaderProps {
  cultId: string;
  onSuccess?: () => void;
}

export const AgentUploader = ({ cultId, onSuccess }: AgentUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileContent = await file.text();
      const agentConfig = JSON.parse(fileContent);

      // Validate required fields
      if (!agentConfig.name) {
        throw new Error("Agent configuration must include a name");
      }

      const { error } = await supabase.from("cult_agents").insert({
        cult_id: cultId,
        name: agentConfig.name,
        description: agentConfig.description,
        personality: agentConfig.personality,
        knowledge: agentConfig.knowledge || [],
        capabilities: agentConfig.capabilities || [],
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "AI Agent has been linked to your cult",
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to link AI Agent",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="agent-config" className="text-cultWhite">
        Upload Agent Configuration
      </Label>
      <Input
        id="agent-config"
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        disabled={isUploading}
        className="text-cultWhite"
      />
      <p className="text-sm text-cultWhite/60">
        Upload a JSON file containing your agent's configuration
      </p>
    </div>
  );
};