import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface ActiveRitualProps {
  ritual: {
    id: string;
    target_url: string;
    participant_count: number;
  };
  onJoin: (ritualId: string) => Promise<void>;
}

export const ActiveRitual = ({ ritual, onJoin }: ActiveRitualProps) => {
  return (
    <div className="p-4 border border-cultGlow rounded-lg">
      <h3 className="text-cultWhite text-lg mb-2">Active Ritual</h3>
      <p className="text-cultWhite/80 mb-4">Target: {ritual.target_url}</p>
      <div className="flex items-center justify-between">
        <span className="text-cultWhite/60">
          <Users className="h-4 w-4 inline-block mr-2" />
          {ritual.participant_count} participants
        </span>
        <Button
          variant="outline"
          className="border-cultGlow text-cultWhite hover:bg-cultPurple/20"
          onClick={() => onJoin(ritual.id)}
        >
          Join Ritual
        </Button>
      </div>
    </div>
  );
};