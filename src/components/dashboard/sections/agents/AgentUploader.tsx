import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AgentConfig, AgentCapabilities } from "@/types/agent";

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
      const agentConfig: AgentConfig = JSON.parse(fileContent);

      // Validate required fields
      if (!agentConfig.name || !agentConfig.modelProvider || !agentConfig.bio) {
        throw new Error("Agent configuration must include name, modelProvider, and bio");
      }

      // Create a description from the bio
      const description = agentConfig.bio.join(' ');

      // Create a personality from adjectives and style
      const personality = [
        ...agentConfig.adjectives,
        ...(agentConfig.style.all || [])
      ].join(', ');

      // Convert the capabilities object to a JSON-compatible format
      const capabilities: AgentCapabilities = {
        topics: agentConfig.topics,
        modelProvider: agentConfig.modelProvider,
        imageModelProvider: agentConfig.imageModelProvider,
        messageExamples: agentConfig.messageExamples,
        postExamples: agentConfig.postExamples,
        style: agentConfig.style,
        settings: {
          voice: agentConfig.settings?.voice,
          secrets: Object.fromEntries(
            Object.entries(agentConfig.settings?.secrets || {})
              .map(([key, value]) => [key, JSON.stringify(value)])
          )
        }
      };

      const { error } = await supabase.from("cult_agents").insert({
        cult_id: cultId,
        name: agentConfig.name,
        description,
        personality,
        knowledge: agentConfig.knowledge as any,
        capabilities: capabilities as any,
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
        Upload a JSON file containing your agent's configuration. The file should include the agent's name, 
        personality traits, knowledge base, and interaction examples.
      </p>
    </div>
  );
};