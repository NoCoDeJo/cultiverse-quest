import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Share2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export const RitualSection = () => {
  const [ritualUrl, setRitualUrl] = useState("");
  const { cultId } = useParams();
  const { toast } = useToast();

  const { data: activeRitual } = useQuery({
    queryKey: ['activeRitual', cultId],
    queryFn: async () => {
      // First get the ritual details
      const { data: ritual, error } = await supabase
        .from('rituals')
        .select('*')
        .eq('cult_id', cultId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Error fetching active ritual:', error);
        return null;
      }

      if (!ritual) return null;

      // Then get the participant count separately
      const { count: participantCount } = await supabase
        .from('ritual_participants')
        .select('*', { count: 'exact', head: true })
        .eq('ritual_id', ritual.id);

      return {
        ...ritual,
        participant_count: participantCount || 0
      };
    },
  });

  const handleRitual = async () => {
    if (!ritualUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid URL for the ritual",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: newRitual, error: ritualError } = await supabase
        .from('rituals')
        .insert([
          {
            cult_id: cultId,
            target_url: ritualUrl,
            status: 'active'
          }
        ])
        .select()
        .single();

      if (ritualError) throw ritualError;

      toast({
        title: "Ritual Initiated!",
        description: "Community members have been notified about the ritual.",
      });

      setRitualUrl("");
    } catch (error) {
      console.error('Error creating ritual:', error);
      toast({
        title: "Error",
        description: "Failed to create ritual. Please try again.",
        variant: "destructive",
      });
    }
  };

  const joinRitual = async (ritualId: string) => {
    try {
      const { data: userProfile } = await supabase.auth.getUser();
      if (!userProfile.user) throw new Error("Not authenticated");

      const { error: joinError } = await supabase
        .from('ritual_participants')
        .insert([
          {
            ritual_id: ritualId,
            profile_id: userProfile.user.id
          }
        ]);

      if (joinError) throw joinError;

      toast({
        title: "Joined Ritual!",
        description: "You've successfully joined the ritual. Let's channel our energy!",
      });
    } catch (error) {
      console.error('Error joining ritual:', error);
      toast({
        title: "Error",
        description: "Failed to join ritual. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-cultDark/50 border-cultGlow">
      <CardHeader>
        <CardTitle className="text-cultWhite flex items-center gap-2">
          <Users className="h-5 w-5" />
          Community Rituals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeRitual ? (
          <div className="p-4 border border-cultGlow rounded-lg">
            <h3 className="text-cultWhite text-lg mb-2">Active Ritual</h3>
            <p className="text-cultWhite/80 mb-4">Target: {activeRitual.target_url}</p>
            <div className="flex items-center justify-between">
              <span className="text-cultWhite/60">
                {activeRitual.participant_count} participants
              </span>
              <Button
                variant="outline"
                className="border-cultGlow text-cultWhite hover:bg-cultPurple/20"
                onClick={() => joinRitual(activeRitual.id)}
              >
                Join Ritual
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Enter URL for ritual (Twitter, Discord, etc.)"
              value={ritualUrl}
              onChange={(e) => setRitualUrl(e.target.value)}
              className="bg-cultDark/30 border-cultGlow text-cultWhite"
            />
            <Button
              variant="outline"
              className="border-cultGlow text-cultWhite hover:bg-cultPurple/20"
              onClick={handleRitual}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Start Ritual
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};