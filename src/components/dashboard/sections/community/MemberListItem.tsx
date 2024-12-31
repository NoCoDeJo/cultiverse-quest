import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Shield, UserX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MemberListItemProps {
  member: {
    profile_id: string;
    role: string;
    profiles: {
      sacred_name: string;
      profile_image_url: string | null;
    };
  };
  onRoleChange: (memberId: string, newRole: string) => Promise<void>;
  onRemove: (memberId: string) => Promise<void>;
}

export const MemberListItem = ({ member, onRoleChange, onRemove }: MemberListItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 rounded border border-cultGlow/20 hover:border-cultGlow hover:bg-cultPurple/20 transition-all">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={member.profiles.profile_image_url || undefined} />
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
              onClick={() => onRoleChange(member.profile_id, 'admin')}
            >
              Make Admin
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-cultWhite hover:bg-cultPurple/20"
              onClick={() => onRoleChange(member.profile_id, 'moderator')}
            >
              Make Moderator
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-cultWhite hover:bg-cultPurple/20"
              onClick={() => onRoleChange(member.profile_id, 'member')}
            >
              Reset to Member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          size="sm"
          className="border-red-500 text-red-500 hover:bg-red-500/20"
          onClick={() => onRemove(member.profile_id)}
        >
          <UserX className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};