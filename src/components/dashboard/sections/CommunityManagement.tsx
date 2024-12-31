import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberListItem } from "./community/MemberListItem";
import { useCommunityManagement } from "./community/useCommunityManagement";

interface CommunityManagementProps {
  cultId: string;
}

export const CommunityManagement = ({ cultId }: CommunityManagementProps) => {
  const { members, isLoading, handleRoleChange, handleRemoveMember } = useCommunityManagement(cultId);

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
          {members?.map((member) => (
            <MemberListItem
              key={member.profile_id}
              member={member}
              onRoleChange={handleRoleChange}
              onRemove={handleRemoveMember}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};