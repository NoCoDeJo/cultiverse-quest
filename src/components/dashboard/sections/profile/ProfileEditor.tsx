import { Profile } from "@/types/profile";
import { SacredNameEditor } from "./SacredNameEditor";
import { AboutMeEditor } from "./AboutMeEditor";
import { ImageUploader } from "./ImageUploader";
import { WorthinessScore } from "./WorthinessScore";

interface ProfileEditorProps {
  profile: Profile;
}

export const ProfileEditor = ({ profile }: ProfileEditorProps) => {
  return (
    <div className="space-y-6">
      <SacredNameEditor 
        profileId={profile.id} 
        currentName={profile.sacred_name} 
      />
      
      <AboutMeEditor 
        profileId={profile.id}
        currentDescription={profile.description}
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