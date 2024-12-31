import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, UserPlus, MessageSquare, Brain, Coins } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ActivityItem {
  id: string;
  type: 'join' | 'message' | 'training' | 'token';
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  cultId: string;
}

export const ActivityFeed = ({ cultId }: ActivityFeedProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Subscribe to realtime updates
    const channel = supabase
      .channel('cult_activities')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cult_activities',
          filter: `cult_id=eq.${cultId}`,
        },
        (payload) => {
          console.log('Change received!', payload);
          // Update activities when new data comes in
          // This is a placeholder - you'll need to implement the actual activity tracking
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cultId]);

  const getIconForActivity = (type: ActivityItem['type']) => {
    switch (type) {
      case 'join':
        return <UserPlus className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'training':
        return <Brain className="h-4 w-4" />;
      case 'token':
        return <Coins className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <ScrollArea className="h-[300px] rounded-md border border-cultGlow/20 p-4">
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 text-cultWhite/80">
              {getIconForActivity(activity.type)}
              <span>{activity.description}</span>
              <span className="text-sm text-cultWhite/60">
                {new Date(activity.timestamp).toRelative()}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center text-cultWhite/60">
            No activities yet. Start building your community!
          </div>
        )}
      </div>
    </ScrollArea>
  );
};