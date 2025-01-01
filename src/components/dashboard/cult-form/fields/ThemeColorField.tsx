import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../FormFields";

interface ThemeColorFieldProps {
  form: UseFormReturn<FormValues>;
}

export const ThemeColorField = ({ form }: ThemeColorFieldProps) => {
  return (
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
  );
};