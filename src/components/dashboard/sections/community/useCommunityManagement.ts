import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCommunityManagement = (cultId: string) => {
  const { toast } = useToast();

  const { data: members, isLoading } = useQuery({
    queryKey: ['cult-members', cultId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cult_members')
        .select(`
          profile_id,
          role,
          profiles:profile_id (
            sacred_name,
            profile_image_url
          )
        `)
        .eq('cult_id', cultId);

      if (error) throw error;
      return data;
    },
  });

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('cult_members')
        .update({ role: newRole })
        .eq('cult_id', cultId)
        .eq('profile_id', memberId);

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: "Member role has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update member role",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('cult_members')
        .delete()
        .eq('cult_id', cultId)
        .eq('profile_id', memberId);

      if (error) throw error;

      toast({
        title: "Member Removed",
        description: "Member has been removed from the cult",
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  return {
    members,
    isLoading,
    handleRoleChange,
    handleRemoveMember,
  };
};