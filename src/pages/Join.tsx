import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Join = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [cultName, setCultName] = useState("");

  useEffect(() => {
    const checkInvite = async () => {
      try {
        const { data: invite, error: inviteError } = await supabase
          .from('cult_invites')
          .select('*, cults(name)')
          .eq('code', code)
          .single();

        if (inviteError || !invite) {
          toast({
            title: "Invalid Invite",
            description: "This invite link is invalid or has expired",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        setCultName(invite.cults.name);
        setLoading(false);
      } catch (error) {
        console.error('Error checking invite:', error);
        navigate('/');
      }
    };

    checkInvite();
  }, [code, navigate, toast]);

  const handleJoin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Store the invite code in localStorage and redirect to auth
        localStorage.setItem('pendingInvite', code || '');
        navigate('/auth');
        return;
      }

      // Get the cult ID from the invite
      const { data: invite } = await supabase
        .from('cult_invites')
        .select('cult_id, current_uses')
        .eq('code', code)
        .single();

      if (!invite) {
        toast({
          title: "Error",
          description: "Invalid invite code",
          variant: "destructive",
        });
        return;
      }

      // Join the cult
      const { error: joinError } = await supabase
        .from('cult_members')
        .insert({
          cult_id: invite.cult_id,
          profile_id: session.user.id,
        });

      if (joinError) throw joinError;

      // Increment the invite usage using a regular update
      const { error: updateError } = await supabase
        .from('cult_invites')
        .update({ current_uses: (invite.current_uses || 0) + 1 })
        .eq('code', code);

      if (updateError) throw updateError;

      toast({
        title: "Welcome to the cult!",
        description: "You have successfully joined the community",
      });

      navigate(`/cult/${invite.cult_id}`);
    } catch (error) {
      console.error('Error joining cult:', error);
      toast({
        title: "Error",
        description: "Failed to join the cult. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cultDark flex items-center justify-center">
        <div className="text-cultWhite text-xl animate-pulse">
          Verifying invite...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cultDark to-cultPurple p-4 flex items-center justify-center">
      <Card className="w-full max-w-md bg-cultDark/50 border-cultGlow">
        <CardHeader>
          <CardTitle className="text-cultWhite text-center">Join {cultName}</CardTitle>
          <CardDescription className="text-cultWhite/60 text-center">
            You've been invited to join this mystical gathering
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleJoin}
            className="w-full bg-cultGlow hover:bg-cultGlow/80"
          >
            Accept Invitation
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full border-cultGlow text-cultWhite hover:bg-cultPurple/20"
          >
            Maybe Later
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Join;