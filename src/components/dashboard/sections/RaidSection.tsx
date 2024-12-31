import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Share2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export const RaidSection = () => {
  const [raidUrl, setRaidUrl] = useState("");
  const { cultId } = useParams();
  const { toast } = useToast();

  const { data: activeRaid } = useQuery({
    queryKey: ['activeRaid', cultId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('raids')
        .select('*, raid_participants(count)')
        .eq('cult_id', cultId)
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Error fetching active raid:', error);
        return null;
      }

      return data;
    },
  });

  const handleRaid = async () => {
    if (!raidUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid URL to raid",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: newRaid, error: raidError } = await supabase
        .from('raids')
        .insert([
          {
            cult_id: cultId,
            target_url: raidUrl,
            status: 'active'
          }
        ])
        .select()
        .single();

      if (raidError) throw raidError;

      toast({
        title: "Raid Initiated!",
        description: "Community members have been notified about the raid.",
      });

      setRaidUrl("");
    } catch (error) {
      console.error('Error creating raid:', error);
      toast({
        title: "Error",
        description: "Failed to create raid. Please try again.",
        variant: "destructive",
      });
    }
  };

  const joinRaid = async (raidId: string) => {
    try {
      const { data: userProfile } = await supabase.auth.getUser();
      if (!userProfile.user) throw new Error("Not authenticated");

      const { error: joinError } = await supabase
        .from('raid_participants')
        .insert([
          {
            raid_id: raidId,
            profile_id: userProfile.user.id
          }
        ]);

      if (joinError) throw joinError;

      toast({
        title: "Joined Raid!",
        description: "You've successfully joined the raid. Let's make an impact!",
      });
    } catch (error) {
      console.error('Error joining raid:', error);
      toast({
        title: "Error",
        description: "Failed to join raid. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-cultDark/50 border-cultGlow">
      <CardHeader>
        <CardTitle className="text-cultWhite flex items-center gap-2">
          <Users className="h-5 w-5" />
          Community Raids
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeRaid ? (
          <div className="p-4 border border-cultGlow rounded-lg">
            <h3 className="text-cultWhite text-lg mb-2">Active Raid</h3>
            <p className="text-cultWhite/80 mb-4">Target: {activeRaid.target_url}</p>
            <div className="flex items-center justify-between">
              <span className="text-cultWhite/60">
                {activeRaid.raid_participants?.[0]?.count || 0} participants
              </span>
              <Button
                variant="outline"
                className="border-cultGlow text-cultWhite hover:bg-cultPurple/20"
                onClick={() => joinRaid(activeRaid.id)}
              >
                Join Raid
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Enter URL to raid (Twitter, Discord, etc.)"
              value={raidUrl}
              onChange={(e) => setRaidUrl(e.target.value)}
              className="bg-cultDark/30 border-cultGlow text-cultWhite"
            />
            <Button
              variant="outline"
              className="border-cultGlow text-cultWhite hover:bg-cultPurple/20"
              onClick={handleRaid}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Start Raid
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};