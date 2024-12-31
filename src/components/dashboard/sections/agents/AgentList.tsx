import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AgentListProps {
  cultId: string;
}

export const AgentList = ({ cultId }: AgentListProps) => {
  const { toast } = useToast();

  const { data: agents, refetch } = useQuery({
    queryKey: ["cult-agents", cultId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cult_agents")
        .select("*")
        .eq("cult_id", cultId)
        .eq("is_active", true);

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from("cult_agents")
        .update({ is_active: false })
        .eq("id", agentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "AI Agent has been removed",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove AI Agent",
        variant: "destructive",
      });
    }
  };

  if (!agents?.length) {
    return (
      <div className="text-cultWhite/60 text-center py-4">
        No AI agents linked yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {agents.map((agent) => (
        <Card key={agent.id} className="bg-cultDark/50 border-cultGlow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-cultWhite/60" />
                <div>
                  <h3 className="text-cultWhite font-medium">{agent.name}</h3>
                  {agent.description && (
                    <p className="text-sm text-cultWhite/60">
                      {agent.description}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(agent.id)}
                className="text-cultWhite/60 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};