import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateCultButton from "./CreateCultButton";
import CreateCultForm from "./CreateCultForm";
import { useState } from "react";

interface CreateCultDialogProps {
  onCultCreated: () => void;
}

const CreateCultDialog = ({ onCultCreated }: CreateCultDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onCultCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CreateCultButton onClick={() => {}} />
      </DialogTrigger>
      <DialogContent className="bg-cultDark border-cultGlow">
        <DialogHeader>
          <DialogTitle className="text-cultWhite">Found New Cult</DialogTitle>
        </DialogHeader>
        <CreateCultForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCultDialog;