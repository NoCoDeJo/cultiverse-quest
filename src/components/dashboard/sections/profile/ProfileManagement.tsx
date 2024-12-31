import { Profile } from "@/types/profile";
import { ProfileEditor } from "./ProfileEditor";

interface ProfileManagementProps {
  profile: Profile;
}

const ProfileManagement: React.FC<ProfileManagementProps> = ({ profile }) => {
  return <ProfileEditor profile={profile} />;
};

export default ProfileManagement;