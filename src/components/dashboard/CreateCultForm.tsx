import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFields } from "./cult-form/FormFields";
import { useCreateCult } from "./cult-form/useCreateCult";
import { Wand2 } from "lucide-react";
import { useAIAssistant } from "@/hooks/useAIAssistant";

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
      form.setValue("twitter_handle", cultInfo.twitter_handle);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateInfo}
            className="border-cultGlow text-cultWhite hover:bg-cultPurple/20"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Generate with AI
          </Button>
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