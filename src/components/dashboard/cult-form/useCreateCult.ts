import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formSchema, FormValues } from "./FormFields";
import { useSession } from "@supabase/auth-helpers-react";

export const useCreateCult = (onSuccess: () => void) => {
  const { toast } = useToast();
  const session = useSession();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      theme_color: "#2D1B69",
      cult_type: "dev",
      custom_url: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (!session?.user?.id) {
        throw new Error("User must be logged in to create a cult");
      }

      const cultData = {
        name: values.name,
        description: values.description,
        theme_color: values.theme_color,
        cult_type: values.cult_type,
        founder_id: session.user.id,
        custom_url: values.custom_url || undefined,
      };

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