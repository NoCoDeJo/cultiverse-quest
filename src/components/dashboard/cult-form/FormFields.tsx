import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { NameField } from "./fields/NameField";
import { DescriptionField } from "./fields/DescriptionField";
import { CultTypeField } from "./fields/CultTypeField";
import { ThemeColorField } from "./fields/ThemeColorField";

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Cult name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  theme_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Please enter a valid hex color code.",
  }),
  cult_type: z.enum(["dev", "agent"], {
    required_error: "Please select a cult type.",
  }),
  custom_url: z.string()
    .regex(/^[a-z0-9-]+$/, {
      message: "Custom URL can only contain lowercase letters, numbers, and hyphens.",
    })
    .optional(),
});

export type FormValues = z.infer<typeof formSchema>;

interface FormFieldsProps {
  form: UseFormReturn<FormValues>;
  onNameEntered?: () => Promise<void>;
}

export const FormFields = ({ form, onNameEntered }: FormFieldsProps) => {
  return (
    <>
      <NameField form={form} onNameEntered={onNameEntered} />
      <DescriptionField form={form} />
      <CultTypeField form={form} />
      <ThemeColorField form={form} />
    </>
  );
};