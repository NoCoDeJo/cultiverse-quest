import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, UserX, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface CommunityManagementProps {
  cultId: string;
}

export const CommunityManagement = ({ cultId }: CommunityManagementProps) => {
  const { toast } = useToast();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

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

  if (isLoading) {
    return <div className="text-cultWhite animate-pulse">Loading members...</div>;
  }

  return (
    <Card className="bg-cultDark/50 border-cultGlow">
      <CardHeader>
        <CardTitle className="text-cultWhite">Community Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members?.map((member: any) => (
            <div
              key={member.profile_id}
              className="flex items-center justify-between p-3 rounded border border-cultGlow/20 hover:border-cultGlow hover:bg-cultPurple/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.profiles.profile_image_url} />
                  <AvatarFallback className="bg-cultPurple text-cultWhite">
                    {member.profiles.sacred_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-cultWhite font-medium">{member.profiles.sacred_name}</p>
                  <p className="text-cultWhite/60 text-sm">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-cultGlow text-cultWhite hover:bg-cultPurple/20"
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-cultDark border-cultGlow">
                    <DropdownMenuItem
                      className="text-cultWhite hover:bg-cultPurple/20"
                      onClick={() => handleRoleChange(member.profile_id, 'admin')}
                    >
                      Make Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-cultWhite hover:bg-cultPurple/20"
                      onClick={() => handleRoleChange(member.profile_id, 'moderator')}
                    >
                      Make Moderator
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-cultWhite hover:bg-cultPurple/20"
                      onClick={() => handleRoleChange(member.profile_id, 'member')}
                    >
                      Reset to Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-500/20"
                  onClick={() => handleRemoveMember(member.profile_id)}
                >
                  <UserX className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};