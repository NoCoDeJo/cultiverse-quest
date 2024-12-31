import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@/types/profile";

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard = ({ profile }: ProfileCardProps) => (
  <Card className="bg-cultDark/80 border-cultGlow glow-border">
    <CardHeader>
      <CardTitle className="text-cultWhite">Sacred Identity</CardTitle>
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