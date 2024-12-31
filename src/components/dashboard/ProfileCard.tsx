import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => (
  <Card className="bg-cultDark/80 border-cultGlow glow-border">
    <CardHeader>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-4 border-cultDark">
          <AvatarImage src={profile.profile_image_url} />
          <AvatarFallback className="bg-cultPurple text-cultWhite">
            {profile.sacred_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-cultWhite">Sacred Identity</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="text-cultWhite">
      <p className="text-xl font-cinzel">{profile.sacred_name}</p>
      <p className="text-sm text-cultWhite/80">
        Worthiness Score: {profile.worthiness_score}
      </p>
    </CardContent>
  </Card>
);

export default ProfileCard;