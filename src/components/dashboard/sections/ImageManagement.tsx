import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Cult } from "@/types/cult";
import { Button } from "@/components/ui/button";
import { ImagePlus, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageManagementProps {
  cult: Cult;
}

export const ImageManagement = ({ cult }: ImageManagementProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
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
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${cult.id}_${type}_${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile_assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile_assets')
        .getPublicUrl(fileName);

      // Update cult record
      const { error: updateError } = await supabase
        .from('cults')
        .update({
          [type === 'logo' ? 'logo_url' : 'banner_url']: publicUrl
        })
        .eq('id', cult.id);

      if (updateError) throw updateError;

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['cult', cult.id] });

      toast({
        title: "Success",
        description: `${type === 'logo' ? 'Logo' : 'Banner'} updated successfully`,
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Logo Management */}
      <div className="space-y-4">
        <div className="aspect-square w-full max-w-[200px] mx-auto relative rounded-lg overflow-hidden bg-cultPurple/20">
          {cult.logo_url ? (
            <img 
              src={cult.logo_url} 
              alt="Cult logo" 
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
              onChange={(e) => handleImageUpload(e, 'logo')}
              disabled={isUploading}
            />
            <Button 
              variant="outline" 
              className="border-cultGlow text-cultWhite"
              disabled={isUploading}
            >
              {cult.logo_url ? (
                <>
                  <Pencil className="w-4 h-4 mr-2" />
                  Change Logo
                </>
              ) : (
                <>
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Add Logo
                </>
              )}
            </Button>
          </label>
        </div>
        <p className="text-sm text-cultWhite/60 text-center">
          Recommended: 400x400 pixels
        </p>
      </div>

      {/* Banner Management */}
      <div className="space-y-4">
        <div className="aspect-[3/1] w-full relative rounded-lg overflow-hidden bg-cultPurple/20">
          {cult.banner_url ? (
            <img 
              src={cult.banner_url} 
              alt="Cult banner" 
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
              {cult.banner_url ? (
                <>
                  <Pencil className="w-4 h-4 mr-2" />
                  Change Banner
                </>
              ) : (
                <>
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Add Banner
                </>
              )}
            </Button>
          </label>
        </div>
        <p className="text-sm text-cultWhite/60 text-center">
          Recommended: 1500x500 pixels
        </p>
      </div>
    </div>
  );
};