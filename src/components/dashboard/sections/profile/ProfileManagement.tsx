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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploader
          currentImageUrl={profile.profile_image_url}
          type="profile"
          profileId={profile.id}
        />
        <ImageUploader
          currentImageUrl={profile.banner_image_url}
          type="banner"
          profileId={profile.id}
          aspectRatio="aspect-[3/1]"
          maxWidth="w-full"
        />
      </div>

      <WorthinessScore score={profile.worthiness_score || 0} />
    </div>
  );
};