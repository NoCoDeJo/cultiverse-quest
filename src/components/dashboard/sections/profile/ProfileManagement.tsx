import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

interface ProfileManagementProps {
  profile: Profile;
}

export const ProfileManagement = ({ profile }: ProfileManagementProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [sacredName, setSacredName] = useState(profile.sacred_name);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'banner') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}_${type}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('profile_assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile_assets')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          [type === 'profile' ? 'profile_image_url' : 'banner_image_url']: publicUrl
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Success",
        description: `${type === 'profile' ? 'Profile' : 'Banner'} image updated successfully`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ sacred_name: sacredName })
        .eq('id', profile.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-cultDark/80 border-cultGlow">
        <CardHeader>
          <CardTitle className="text-cultWhite">Sacred Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sacred-name" className="text-cultWhite">Sacred Name</Label>
            <Input
              id="sacred-name"
              value={sacredName}
              onChange={(e) => setSacredName(e.target.value)}
              className="bg-cultDark/50 border-cultGlow text-cultWhite"
            />
          </div>
          <Button
            onClick={handleUpdateProfile}
            className="w-full bg-cultPurple hover:bg-cultPurple/80 text-cultWhite"
          >
            Update Profile
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-cultDark/80 border-cultGlow">
        <CardHeader>
          <CardTitle className="text-cultWhite">Profile Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Image */}
          <div className="space-y-4">
            <div className="aspect-square w-full max-w-[200px] mx-auto relative rounded-lg overflow-hidden bg-cultPurple/20">
              {profile.profile_image_url ? (
                <img 
                  src={profile.profile_image_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-cultWhite/60">
                  <ImagePlus className="w-12 h-12" />
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'profile')}
                  disabled={isUploading}
                />
                <Button 
                  variant="outline" 
                  className="border-cultGlow text-cultWhite"
                  disabled={isUploading}
                >
                  {profile.profile_image_url ? (
                    <>
                      <Pencil className="w-4 h-4 mr-2" />
                      Change Profile Image
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-4 h-4 mr-2" />
                      Add Profile Image
                    </>
                  )}
                </Button>
              </label>
            </div>
          </div>

          {/* Banner Image */}
          <div className="space-y-4">
            <div className="aspect-[3/1] w-full relative rounded-lg overflow-hidden bg-cultPurple/20">
              {profile.banner_image_url ? (
                <img 
                  src={profile.banner_image_url} 
                  alt="Banner" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-cultWhite/60">
                  <ImagePlus className="w-12 h-12" />
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'banner')}
                  disabled={isUploading}
                />
                <Button 
                  variant="outline" 
                  className="border-cultGlow text-cultWhite"
                  disabled={isUploading}
                >
                  {profile.banner_image_url ? (
                    <>
                      <Pencil className="w-4 h-4 mr-2" />
                      Change Banner Image
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-4 h-4 mr-2" />
                      Add Banner Image
                    </>
                  )}
                </Button>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-cultDark/80 border-cultGlow">
        <CardHeader>
          <CardTitle className="text-cultWhite">Worthiness Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-4xl font-bold text-cultGlow">{profile.worthiness_score || 0}</p>
            <p className="text-cultWhite/60 mt-2">
              Increase your worthiness by participating in rituals and joining cults
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};