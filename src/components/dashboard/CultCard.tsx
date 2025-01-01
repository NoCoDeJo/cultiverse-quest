import { Card, CardContent } from "@/components/ui/card";
import { Cult } from "@/types/cult";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CultCardHeader } from "./cult-card/CultCardHeader";
import { CultCardBadges } from "./cult-card/CultCardBadges";
import { CultCardActions } from "./cult-card/CultCardActions";
import { motion } from "framer-motion";

interface CultCardProps {
  cult: Cult;
  onJoin: (cultId: string) => void;
}

const CultCard = ({ cult, onJoin }: CultCardProps) => {
  const session = useSession();
  const currentUserId = session?.user?.id;

  const { data: membership } = useQuery({
    queryKey: ['cult-membership', cult.id, currentUserId],
    queryFn: async () => {
      if (!currentUserId) return null;
      const { data } = await supabase
        .from('cult_members')
        .select('*')
        .eq('cult_id', cult.id)
        .eq('profile_id', currentUserId)
        .single();
      return data;
    },
    enabled: !!currentUserId,
  });

  const { data: pendingApplication } = useQuery({
    queryKey: ['cult-application', cult.id, currentUserId],
    queryFn: async () => {
      if (!currentUserId) return null;
      const { data } = await supabase
        .from('cult_join_applications')
        .select('*')
        .eq('cult_id', cult.id)
        .eq('profile_id', currentUserId)
        .eq('status', 'pending')
        .single();
      return data;
    },
    enabled: !!currentUserId,
  });

  const isFounder = cult.founder_id === currentUserId;
  const isMember = !!membership;
  const hasPendingApplication = !!pendingApplication;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      role="article"
      aria-label={`${cult.name} cult card`}
    >
      <Card 
        className="bg-cultDark/80 border-cultGlow hover:glow-border transition-all duration-300 overflow-hidden group"
        style={{ borderColor: cult.theme_color }}
        tabIndex={0}
      >
        {cult.banner_url && (
          <div className="h-32 w-full overflow-hidden">
            <img 
              src={cult.banner_url} 
              alt={`${cult.name} banner`}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CultCardHeader cult={cult} />
        <CardContent className="space-y-6">
          <p className="text-cultWhite/80 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
            {cult.description}
          </p>
          <CultCardBadges 
            cultType={cult.cult_type}
            joinType={cult.join_type}
            isFounder={isFounder}
            isMember={isMember}
          />
          <div className="flex gap-4">
            <CultCardActions 
              cultId={cult.id}
              isFounder={isFounder}
              isMember={isMember}
              hasPendingApplication={hasPendingApplication}
              joinType={cult.join_type}
              hasSession={!!session}
              onJoin={onJoin}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CultCard;