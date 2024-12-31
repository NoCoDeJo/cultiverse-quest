import { Form } from "@/components/ui/form";
import { FormFields } from "./cult-form/FormFields";
import { useCreateCult } from "./cult-form/useCreateCult";
import OverseerConversation from "./cult-form/OverseerConversation";
import { useState } from "react";

interface CreateCultFormProps {
  onSuccess: () => void;
}

const CreateCultForm = ({ onSuccess }: CreateCultFormProps) => {
  const { form, onSubmit } = useCreateCult(onSuccess);
  const [showForm, setShowForm] = useState(false);

  const handleConversationComplete = (values: any) => {
    Object.keys(values).forEach((key) => {
      form.setValue(key, values[key]);
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
            <button type="submit" className="w-full bg-cultGlow hover:bg-cultGlow/80 text-cultWhite px-4 py-2 rounded">
              Create Cult
            </button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default CreateCultForm;