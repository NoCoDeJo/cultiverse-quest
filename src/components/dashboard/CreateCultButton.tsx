import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CreateCultButtonProps {
  onClick: () => void;
}

const CreateCultButton = ({ onClick }: CreateCultButtonProps) => (
  <Button 
    className="bg-cultGlow hover:bg-cultGlow/80"
    onClick={onClick}
  >
    <Plus className="mr-2 h-4 w-4" />
    Found New Cult
  </Button>
);

export default CreateCultButton;