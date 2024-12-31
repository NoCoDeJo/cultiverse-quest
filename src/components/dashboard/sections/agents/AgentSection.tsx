import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentUploader } from "./AgentUploader";
import { AgentList } from "./AgentList";
import { useState } from "react";

interface AgentSectionProps {
  cultId: string;
}

export const AgentSection = ({ cultId }: AgentSectionProps) => {
  const [key, setKey] = useState(0);

  const handleAgentAdded = () => {
    setKey(prev => prev + 1);
  };

  return (
    <Card className="bg-cultDark/50 border-cultGlow">
      <CardHeader>
        <CardTitle className="text-cultWhite">AI Agents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AgentUploader cultId={cultId} onSuccess={handleAgentAdded} />
        <AgentList key={key} cultId={cultId} />
      </CardContent>
    </Card>
  );
};