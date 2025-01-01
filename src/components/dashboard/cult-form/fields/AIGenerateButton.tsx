import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";

interface AIGenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
}

export const AIGenerateButton = ({ onClick, isGenerating }: AIGenerateButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
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
  );
};