import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CreateCultButtonProps {
  onClick?: () => void;
}

const CreateCultButton = ({ onClick }: CreateCultButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    navigate('/create-cult');
  };

  return (
    <Button 
      className="bg-cultGlow hover:bg-cultGlow/80"
      onClick={handleClick}
    >
      <Plus className="mr-2 h-4 w-4" />
      Found New Cult
    </Button>
  );
};

export default CreateCultButton;