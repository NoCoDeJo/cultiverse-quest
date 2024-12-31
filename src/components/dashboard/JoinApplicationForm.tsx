import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface JoinApplicationFormProps {
  cultId: string;
}

interface ApplicationFormData {
  motivation: string;
  experience: string;
}

export const JoinApplicationForm = ({ cultId }: JoinApplicationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ApplicationFormData>({
    defaultValues: {
      motivation: "",
      experience: "",
    },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('cult_join_applications')
        .insert({
          cult_id: cultId,
          application_data: data,
        });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully.",
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['cult-application', cultId] });
      
      // Close the dialog by clicking the close button
      const closeButton = document.querySelector('[data-dialog-close]') as HTMLButtonElement;
      if (closeButton) closeButton.click();

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="motivation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-cultWhite">Why do you want to join this cult?</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  className="bg-cultPurple/20 text-cultWhite border-cultGlow"
                  placeholder="Share your motivation..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-cultWhite">What relevant experience do you have?</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  className="bg-cultPurple/20 text-cultWhite border-cultGlow"
                  placeholder="Share your experience..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full border-cultGlow text-cultWhite hover:bg-cultPurple/50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  );
};