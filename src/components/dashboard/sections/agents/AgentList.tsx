import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Agent } from "@/types/agent";
import { AgentCard } from "./AgentCard";

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
      return data as Agent[];
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
        <AgentCard 
          key={agent.id} 
          agent={agent} 
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};