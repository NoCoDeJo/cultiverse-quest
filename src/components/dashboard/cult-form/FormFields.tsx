import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const formSchema = z.object({
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
  onNameEntered?: () => void;
}

export const FormFields = ({ form, onNameEntered }: FormFieldsProps) => {
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("name", value);
    setShowGenerateButton(value.length >= 2);
  };

  const handleGenerateClick = async () => {
    if (onNameEntered) {
      setIsGenerating(true);
      try {
        await onNameEntered();
        setHasGenerated(true);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-cultWhite">Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter cult name..." 
                {...field} 
                onChange={handleNameChange}
              />
            </FormControl>
            <FormMessage />
            {showGenerateButton && !hasGenerated && (
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateClick}
                disabled={isGenerating}
                className="mt-2 w-full border-cultGlow text-cultWhite hover:bg-cultPurple/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating details...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate details with AI
                  </>
                )}
              </Button>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-cultWhite">Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your cult's purpose..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cult_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-cultWhite">Cult Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a cult type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="dev">Developer</SelectItem>
                <SelectItem value="agent">AI Agent</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="theme_color"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-cultWhite">Theme Color</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <Input type="color" {...field} className="w-12 h-10 p-1" />
                <Input {...field} placeholder="#2D1B69" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export { formSchema };