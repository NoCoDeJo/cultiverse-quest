import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../FormFields";

interface CultTypeFieldProps {
  form: UseFormReturn<FormValues>;
}

export const CultTypeField = ({ form }: CultTypeFieldProps) => {
  return (
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
  );
};