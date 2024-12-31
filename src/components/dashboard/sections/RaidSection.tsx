import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Share2, Users } from "lucide-react";

export const RaidSection = () => {
  const [raidUrl, setRaidUrl] = useState("");
  const { toast } = useToast();

  const handleRaid = () => {
    if (!raidUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid URL to raid",
        variant: "destructive",
      });
      return;
    }

    // Here you would implement the actual raid logic
    toast({
      title: "Raid Initiated!",
      description: "Community members have been notified about the raid.",
    });
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
      </CardContent>
    </Card>
  );
};