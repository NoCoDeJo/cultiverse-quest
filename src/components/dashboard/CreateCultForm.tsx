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
    const cultInfo = await generateCultInfo();
    if (cultInfo) {
      form.setValue("name", cultInfo.name);
      form.setValue("description", cultInfo.description);
      form.setValue("theme_color", cultInfo.theme_color);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-end">
          <GenerateWithAIButton onClick={handleGenerateInfo} />
        </div>
        <FormFields form={form} />
        <Button type="submit" className="w-full bg-cultGlow hover:bg-cultGlow/80">
          Create Cult
        </Button>
      </form>
    </Form>
  );
};

export default CreateCultForm;