import { Profile } from "@/types/profile";
import { ImageUploader } from "./ImageUploader";
import { SacredNameEditor } from "./SacredNameEditor";
import { WorthinessScore } from "./WorthinessScore";

interface ProfileManagementProps {
  profile: Profile;
}

export const ProfileManagement = ({ profile }: ProfileManagementProps) => {
  return (
    <div className="space-y-6">
      <SacredNameEditor 
        profileId={profile.id} 
        currentName={profile.sacred_name} 
      />

      <div className="max-w-md mx-auto">
        <ImageUploader
          currentImageUrl={profile.profile_image_url}
          type="profile"
          profileId={profile.id}
        />
      </div>

      <WorthinessScore score={profile.worthiness_score || 0} />
    </div>
  );
};