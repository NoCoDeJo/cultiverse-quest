import { Form } from "@/components/ui/form";
import { FormFields } from "./cult-form/FormFields";
import { useCreateCult } from "./cult-form/useCreateCult";
import OverseerConversation from "./cult-form/OverseerConversation";
import { useState } from "react";
import { FormValues } from "./cult-form/FormFields";
import { Loader2 } from "lucide-react";

interface CreateCultFormProps {
  onSuccess: () => void;
}

const CreateCultForm = ({ onSuccess }: CreateCultFormProps) => {
  const { form, onSubmit, isSubmitting } = useCreateCult(onSuccess);
  const [showForm, setShowForm] = useState(false);

  const handleConversationComplete = (values: Partial<FormValues>) => {
    (Object.keys(values) as Array<keyof FormValues>).forEach((key) => {
      if (values[key] !== undefined) {
        form.setValue(key, values[key]!);
      }
    });
    setShowForm(true);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!showForm ? (
          <OverseerConversation onComplete={handleConversationComplete} />
        ) : (
          <div className="animate-fade-in">
            <FormFields form={form} />
            <button 
              type="submit" 
              className="w-full bg-cultGlow hover:bg-cultGlow/80 text-cultWhite px-4 py-2 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Cult...
                </>
              ) : (
                "Create Cult"
              )}
            </button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default CreateCultForm;