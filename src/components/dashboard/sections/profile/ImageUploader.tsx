import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ImagePlus, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploaderProps {
  currentImageUrl?: string | null;
  type: 'profile' | 'banner';
  profileId: string;
  aspectRatio?: string;
  maxWidth?: string;
}

export const ImageUploader = ({ 
  currentImageUrl, 
  type, 
  profileId,
  aspectRatio = "aspect-square",
  maxWidth = "max-w-[200px]"
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const fileName = `${profileId}_${type}_${Date.now()}.${fileExt}`;
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
        .eq('id', profileId);

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

  return (
    <div className="space-y-4">
      <div className={`${aspectRatio} w-full ${maxWidth} mx-auto relative rounded-lg overflow-hidden bg-cultPurple/20`}>
        {currentImageUrl ? (
          <img 
            src={currentImageUrl} 
            alt={`${type} image`} 
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
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          <Button 
            variant="outline" 
            className="border-cultGlow text-cultWhite"
            disabled={isUploading}
          >
            {currentImageUrl ? (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Change {type === 'profile' ? 'Profile' : 'Banner'} Image
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4 mr-2" />
                Add {type === 'profile' ? 'Profile' : 'Banner'} Image
              </>
            )}
          </Button>
        </label>
      </div>
      <p className="text-sm text-cultWhite/60 text-center">
        Recommended: {type === 'profile' ? '400x400' : '1500x500'} pixels
      </p>
    </div>
  );
};