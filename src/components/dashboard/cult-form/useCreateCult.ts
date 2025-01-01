import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formSchema, FormValues } from "./FormFields";

export const useCreateCult = (onSuccess: () => void) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      theme_color: "#2D1B69",
      twitter_handle: "",
      cult_type: "dev",
      custom_url: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const cultData: any = {
        name: values.name,
        description: values.description,
        theme_color: values.theme_color,
        cult_type: values.cult_type,
      };

      // Only add optional fields if they have values
      if (values.twitter_handle) {
        cultData.twitter_handle = values.twitter_handle;
      }
      if (values.custom_url) {
        cultData.custom_url = values.custom_url;
      }

      const { error } = await supabase.from("cults").insert(cultData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your cult has been created.",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error creating cult:", error);
      toast({
        title: "Error",
        description: "Failed to create cult. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { form, onSubmit };
};