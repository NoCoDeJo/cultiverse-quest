import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2 } from "lucide-react";

interface CreateRitualProps {
  ritualUrl: string;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
}

export const CreateRitual = ({ ritualUrl, onUrlChange, onSubmit }: CreateRitualProps) => {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter URL for ritual (Twitter, Discord, etc.)"
        value={ritualUrl}
        onChange={(e) => onUrlChange(e.target.value)}
        className="bg-cultDark/30 border-cultGlow text-cultWhite"
      />
      <Button
        variant="outline"
        className="border-cultGlow text-cultWhite hover:bg-cultPurple/20"
        onClick={onSubmit}
      >
        <Share2 className="h-4 w-4 mr-2" />
        Start Ritual
      </Button>
    </div>
  );
};