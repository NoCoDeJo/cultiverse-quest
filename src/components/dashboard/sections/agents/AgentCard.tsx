import { Brain, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Agent, AgentCapabilities } from "@/types/agent";

interface AgentCardProps {
  agent: Agent;
  onDelete: (agentId: string) => void;
}

export const AgentCard = ({ agent, onDelete }: AgentCardProps) => {
  const capabilities = agent.capabilities as AgentCapabilities;
  
  return (
    <Card className="bg-cultDark/50 border-cultGlow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-cultWhite/60" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-cultWhite font-medium">{agent.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {capabilities?.modelProvider || 'AI Agent'}
                </Badge>
              </div>
              {agent.description && (
                <p className="text-sm text-cultWhite/60">
                  {agent.description}
                </p>
              )}
              {agent.personality && (
                <p className="text-xs text-cultWhite/40">
                  Personality: {agent.personality}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(agent.id)}
            className="text-cultWhite/60 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};