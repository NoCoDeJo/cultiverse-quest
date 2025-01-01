import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";

interface AIGenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
}

export const AIGenerateButton = ({ onClick, isGenerating }: AIGenerateButtonProps) => (
  <Button 
    onClick={onClick}
    disabled={isGenerating}
    variant="outline"
    className="w-full border-cultGlow text-cultWhite hover:bg-cultPurple/20"
  >
    {isGenerating ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Generating cult details...
      </>
    ) : (
      <>
        <Wand2 className="mr-2 h-4 w-4" />
        Generate remaining details with AI
      </>
    )}
  </Button>
);