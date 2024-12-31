import { Button } from "@/components/ui/button";
import { UserPlus, MessageSquare, Share2, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { nanoid } from "nanoid";

interface QuickActionsProps {
  cultId: string;
  cultName: string;
}

export const QuickActions = ({ cultId, cultName }: QuickActionsProps) => {
  const [inviteCode, setInviteCode] = useState("");
  const { toast } = useToast();

  const generateInviteCode = async () => {
    try {
      const code = nanoid(10);
      const { error } = await supabase
        .from('cult_invites')
        .insert({
          cult_id: cultId,
          code: code,
        });

      if (error) throw error;

      const inviteLink = `${window.location.origin}/join/${code}`;
      setInviteCode(inviteLink);
      await navigator.clipboard.writeText(inviteLink);
      
      toast({
        title: "Invite Link Created!",
        description: "The link has been copied to your clipboard",
      });
    } catch (error) {
      console.error('Error generating invite:', error);
      toast({
        title: "Error",
        description: "Failed to generate invite link",
        variant: "destructive",
      });
    }
  };

  const copyInviteLink = async () => {
    await navigator.clipboard.writeText(inviteCode);
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard",
    });
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
              onClick={generateInviteCode}
              className="w-full border-cultGlow text-cultWhite hover:bg-cultPurple/20"
            >
              Generate New Invite Link
            </Button>
            {inviteCode && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input 
                    value={inviteCode}
                    readOnly
                    className="bg-cultPurple/20 text-cultWhite"
                  />
                  <Button
                    onClick={copyInviteLink}
                    variant="outline"
                    className="border-cultGlow text-cultWhite hover:bg-cultPurple/20"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-cultWhite/60">
                  Share this link with potential members
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-4 border-cultGlow text-cultWhite hover:bg-cultPurple/20"
          >
            <MessageSquare className="h-6 w-6" />
            <span>Community Chat</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-cultDark border-cultGlow">
          <DialogHeader>
            <DialogTitle className="text-cultWhite">Community Chat</DialogTitle>
          </DialogHeader>
          <div className="h-[400px] flex items-center justify-center text-cultWhite/60">
            Chat interface coming soon...
          </div>
        </DialogContent>
      </Dialog>

      <Button 
        variant="outline"
        className="flex flex-col items-center gap-2 h-auto py-4 border-cultGlow text-cultWhite hover:bg-cultPurple/20"
      >
        <Share2 className="h-6 w-6" />
        <span>Share Community</span>
      </Button>
    </div>
  );
};