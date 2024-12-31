import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

interface GenerateWithAIButtonProps {
  onClick: () => void;
}

const GenerateWithAIButton = ({ onClick }: GenerateWithAIButtonProps) => (
  <Button
    type="button"
    variant="outline"
    onClick={onClick}
    className="border-cultGlow text-cultWhite hover:bg-cultPurple/20"
  >
    <Wand2 className="mr-2 h-4 w-4" />
    Generate with AI
  </Button>
);

export default GenerateWithAIButton;