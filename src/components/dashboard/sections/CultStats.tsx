import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, Lock } from "lucide-react";
import { Cult } from "@/types/cult";

interface CultStatsProps {
  cult: Cult;
}

export const CultStats = ({ cult }: CultStatsProps) => {
  return (
    <Card className="bg-cultDark/50 border-cultGlow">
      <CardHeader>
        <CardTitle className="text-cultWhite">Cult Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-cultWhite/80">
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members
          </span>
          <span>{cult.linked_agents_count || 0}</span>
        </div>
        <div className="flex justify-between items-center text-cultWhite/80">
          <span className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Visibility
          </span>
          <span className="flex items-center gap-1">
            {cult.visibility === 'public' ? (
              <>
                <Globe className="h-4 w-4" />
                Public
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Private
              </>
            )}
          </span>
        </div>
        <div className="flex justify-between items-center text-cultWhite/80">
          <span>Type</span>
          <span className={`px-2 py-1 rounded text-sm ${
            cult.cult_type === 'dev' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
          }`}>
            {cult.cult_type === 'dev' ? 'Developer' : 'AI Agent'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};