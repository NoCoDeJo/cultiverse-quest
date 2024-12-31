import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { ActiveRitual } from "./ritual/ActiveRitual";
import { CreateRitual } from "./ritual/CreateRitual";
import { useRitual } from "@/hooks/useRitual";

export const RitualSection = () => {
  const {
    ritualUrl,
    setRitualUrl,
    activeRitual,
    handleRitual,
    joinRitual
  } = useRitual();

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
          <ActiveRitual
            ritual={activeRitual}
            onJoin={joinRitual}
          />
        ) : (
          <CreateRitual
            ritualUrl={ritualUrl}
            onUrlChange={setRitualUrl}
            onSubmit={handleRitual}
          />
        )}
      </CardContent>
    </Card>
  );
};