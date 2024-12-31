import { Button } from "@/components/ui/button";
import { UserPlus, MessageSquare, Share2, Brain, Coins, Robot } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuickActionsProps {
  cultId: string;
  cultName: string;
}

export const QuickActions = ({ cultId, cultName }: QuickActionsProps) => {
  const [inviteLink, setInviteLink] = useState("");
  const { toast } = useToast();

  const generateInviteLink = async () => {
    // In a real app, you'd want to generate a unique invite link
    const link = `${window.location.origin}/join/${cultId}`;
    setInviteLink(link);
    await navigator.clipboard.writeText(link);
    toast({
      title: "Invite Link Copied!",
      description: "Share this link with potential members",
    });
  };

  const handleAIAgentCreation = async () => {
    toast({
      title: "Creating AI Agent",
      description: "Your personal AI assistant is being initialized...",
    });
    // Here you would integrate with your AI service
  };

  const handleTokenCreation = async () => {
    toast({
      title: "Token Creation",
      description: "Community token creation will be available soon!",
    });
    // Here you would integrate with your crypto service
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4 border-cultGlow text-cultWhite hover:bg-cultPurple/20"
          >
            <UserPlus className="h-6 w-6" />
            <span>Invite Members</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-cultDark border-cultGlow">
          <DialogHeader>
            <DialogTitle className="text-cultWhite">Invite Members to {cultName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              onClick={generateInviteLink}
              className="w-full border-cultGlow text-cultWhite hover:bg-cultPurple/20"
            >
              Generate Invite Link
            </Button>
            {inviteLink && (
              <div className="p-2 bg-cultPurple/20 rounded border border-cultGlow text-cultWhite break-all">
                {inviteLink}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Button 
        variant="outline"
        className="flex flex-col items-center gap-2 h-auto py-4 border-cultGlow text-cultWhite hover:bg-cultPurple/20"
        onClick={handleAIAgentCreation}
      >
        <Robot className="h-6 w-6" />
        <span>Create AI Agent</span>
      </Button>

      <Button 
        variant="outline"
        className="flex flex-col items-center gap-2 h-auto py-4 border-cultGlow text-cultWhite hover:bg-cultPurple/20"
        onClick={handleTokenCreation}
      >
        <Coins className="h-6 w-6" />
        <span>Launch Token</span>
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 border-cultGlow text-cultWhite hover:bg-cultPurple/20"
          >
            <MessageSquare className="h-6 w-6" />
            <span>AI Chat</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-cultDark border-cultGlow">
          <DialogHeader>
            <DialogTitle className="text-cultWhite">Chat with Cult AI</DialogTitle>
          </DialogHeader>
          <div className="h-[400px] flex items-center justify-center text-cultWhite/60">
            AI Chat interface coming soon...
          </div>
        </DialogContent>
      </Dialog>

      <Button 
        variant="outline"
        className="flex flex-col items-center gap-2 h-auto py-4 border-cultGlow text-cultWhite hover:bg-cultPurple/20"
      >
        <Brain className="h-6 w-6" />
        <span>Train Agent</span>
      </Button>

      <Button 
        variant="outline"
        className="flex flex-col items-center gap-2 h-auto py-4 border-cultGlow text-cultWhite hover:bg-cultPurple/20"
      >
        <Share2 className="h-6 w-6" />
        <span>Share Cult</span>
      </Button>
    </div>
  );
};