import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Cult } from "@/types/cult";

interface CultCardProps {
  cult: Cult;
  onJoin: (cultId: string) => void;
}

const CultCard = ({ cult, onJoin }: CultCardProps) => (
  <Card 
    className="bg-cultDark/80 border-cultGlow hover:glow-border transition-all duration-300"
    style={{ borderColor: cult.theme_color }}
  >
    <CardHeader>
      <CardTitle className="text-cultWhite">{cult.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-cultWhite/80 mb-4">{cult.description}</p>
      <Button 
        variant="outline" 
        className="w-full border-cultGlow text-cultWhite hover:bg-cultPurple/50"
        onClick={() => onJoin(cult.id)}
      >
        <Users className="mr-2 h-4 w-4" />
        Join Cult
      </Button>
    </CardContent>
  </Card>
);

export default CultCard;