import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRitual = () => {
  const [ritualUrl, setRitualUrl] = useState("");
  const { cultId } = useParams();
  const { toast } = useToast();

  const { data: activeRitual, refetch } = useQuery({
    queryKey: ['activeRitual', cultId],
    queryFn: async () => {
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
      const { error: ritualError } = await supabase
        .from('rituals')
        .insert([
          {
            cult_id: cultId,
            target_url: ritualUrl,
            status: 'active'
          }
        ]);

      if (ritualError) throw ritualError;

      toast({
        title: "Ritual Initiated!",
        description: "Community members have been notified about the ritual.",
      });

      setRitualUrl("");
      refetch();
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
      
      refetch();
    } catch (error) {
      console.error('Error joining ritual:', error);
      toast({
        title: "Error",
        description: "Failed to join ritual. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    ritualUrl,
    setRitualUrl,
    activeRitual,
    handleRitual,
    joinRitual
  };
};