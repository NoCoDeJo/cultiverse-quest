import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFields } from "./cult-form/FormFields";
import { useCreateCult } from "./cult-form/useCreateCult";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import GenerateWithAIButton from "./cult-form/GenerateWithAIButton";

interface CreateCultFormProps {
  onSuccess: () => void;
}

const CreateCultForm = ({ onSuccess }: CreateCultFormProps) => {
  const { form, onSubmit } = useCreateCult(onSuccess);
  const { generateCultInfo } = useAIAssistant();

  const handleGenerateInfo = async () => {
    const cultName = form.getValues("name");
    const cultInfo = await generateCultInfo(cultName);
    if (cultInfo) {
      form.setValue("description", cultInfo.description);
      form.setValue("theme_color", cultInfo.theme_color);
      form.setValue("cult_type", cultInfo.cult_type || "dev");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormFields form={form} onNameEntered={handleGenerateInfo} />
        <Button type="submit" className="w-full bg-cultGlow hover:bg-cultGlow/80">
          Create Cult
        </Button>
      </form>
    </Form>
  );
};

export default CreateCultForm;