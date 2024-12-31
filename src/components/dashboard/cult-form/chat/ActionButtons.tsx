import React from 'react';
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onAIConsult: () => void;
  onManualProceed: () => void;
}

const ActionButtons = ({ onAIConsult, onManualProceed }: ActionButtonsProps) => {
  return (
    <div className="flex gap-2 animate-fade-in">
      <Button 
        onClick={onAIConsult}
        className="flex-1 bg-cultGlow hover:bg-cultGlow/80 text-cultWhite"
      >
        Consult the AI
      </Button>
      <Button 
        onClick={onManualProceed}
        className="flex-1 bg-cultDark border-cultGlow text-cultWhite hover:bg-cultPurple/20"
        variant="outline"
      >
        Proceed Manually
      </Button>
    </div>
  );
};

export default ActionButtons;