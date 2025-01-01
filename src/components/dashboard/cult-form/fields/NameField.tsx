import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../FormFields";
import { AIGenerateButton } from "./AIGenerateButton";
import { useState } from "react";

interface NameFieldProps {
  form: UseFormReturn<FormValues>;
  onNameEntered?: () => Promise<void>;
}

export const NameField = ({ form, onNameEntered }: NameFieldProps) => {
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
            <AIGenerateButton
              onClick={handleGenerateClick}
              isGenerating={isGenerating}
            />
          )}
        </FormItem>
      )}
    />
  );
};