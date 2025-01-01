import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { JoinApplicationForm } from "../JoinApplicationForm";

interface CultCardActionsProps {
  cultId: string;
  isFounder: boolean;
  isMember: boolean;
  hasPendingApplication: boolean;
  joinType: string;
  hasSession: boolean;
  onJoin: (cultId: string) => void;
}

export const CultCardActions = ({
  cultId,
  isFounder,
  isMember,
  hasPendingApplication,
  joinType,
  hasSession,
  onJoin,
}: CultCardActionsProps) => {
  const navigate = useNavigate();

  if (isFounder) {
    return (
      <Button 
        variant="outline" 
        className="flex-1 border-cultGlow text-cultWhite hover:bg-cultPurple/50 transition-all duration-300 hover:scale-105"
        onClick={() => navigate(`/cult/${cultId}`)}
      >
        Manage
      </Button>
    );
  }

  if (!hasSession) {
    return (
      <Button 
        variant="outline" 
        className="flex-1 border-cultGlow text-cultWhite hover:bg-cultPurple/50 transition-all duration-300 hover:scale-105"
        onClick={() => navigate('/auth')}
      >
        <Users className="mr-2 h-4 w-4" />
        Sign in to Join
      </Button>
    );
  }

  if (isMember) {
    return (
      <Button 
        variant="outline" 
        className="flex-1 border-cultGlow text-cultWhite hover:bg-cultPurple/50 transition-all duration-300 hover:scale-105"
        onClick={() => navigate(`/cult/${cultId}`)}
      >
        View
      </Button>
    );
  }

  if (hasPendingApplication) {
    return (
      <Button 
        variant="outline" 
        className="flex-1 border-cultGlow text-cultWhite hover:bg-cultPurple/50 opacity-75"
        disabled
      >
        Application Pending
      </Button>
    );
  }

  if (joinType === 'public') {
    return (
      <Button 
        variant="outline" 
        className="flex-1 border-cultGlow text-cultWhite hover:bg-cultPurple/50 transition-all duration-300 hover:scale-105"
        onClick={() => onJoin(cultId)}
      >
        <Users className="mr-2 h-4 w-4" />
        Join
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex-1 border-cultGlow text-cultWhite hover:bg-cultPurple/50 transition-all duration-300 hover:scale-105"
        >
          <Users className="mr-2 h-4 w-4" />
          Apply to Join
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-cultDark border-cultGlow animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-cultWhite">Join Cult</DialogTitle>
        </DialogHeader>
        <JoinApplicationForm cultId={cultId} />
      </DialogContent>
    </Dialog>
  );
};