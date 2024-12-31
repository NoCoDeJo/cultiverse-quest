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

interface AgentConfig {
  name: string;
  username?: string;
  modelProvider: string;
  imageModelProvider?: string;
  bio: string[];
  lore: string[];
  knowledge: string[];
  messageExamples: Array<Array<{
    user: string;
    content: {
      text: string;
    };
  }>>;
  postExamples: string[];
  topics: string[];
  style: {
    all: string[];
    chat: string[];
    post: string[];
  };
  adjectives: string[];
  settings?: {
    voice?: {
      model?: string;
    };
    secrets?: Record<string, unknown>;
  };
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

      const { error } = await supabase.from("cult_agents").insert({
        cult_id: cultId,
        name: agentConfig.name,
        description: description,
        personality: personality,
        knowledge: agentConfig.knowledge,
        capabilities: {
          topics: agentConfig.topics,
          modelProvider: agentConfig.modelProvider,
          imageModelProvider: agentConfig.imageModelProvider,
          messageExamples: agentConfig.messageExamples,
          postExamples: agentConfig.postExamples,
          style: agentConfig.style,
          settings: agentConfig.settings
        },
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