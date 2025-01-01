import CreateCultButton from "./CreateCultButton";

interface CreateCultDialogProps {
  onCultCreated: () => void;
}

const CreateCultDialog = ({ onCultCreated }: CreateCultDialogProps) => {
  return <CreateCultButton onClick={onCultCreated} />;
};

export default CreateCultDialog;