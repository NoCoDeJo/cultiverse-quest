import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface WorthinessScoreProps {
  score: number;
}

export const WorthinessScore = ({ score }: WorthinessScoreProps) => {
  return (
    <Card className="bg-cultDark/80 border-cultGlow">
      <CardHeader>
        <CardTitle className="text-cultWhite flex items-center gap-2">
          <Trophy className="h-5 w-5 text-cultGlow" />
          Worthiness Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="text-4xl font-bold text-cultGlow">{score || 0}</p>
          <p className="text-cultWhite/60 mt-2">
            Increase your worthiness by participating in rituals and joining cults
          </p>
        </div>
      </CardContent>
    </Card>
  );
};