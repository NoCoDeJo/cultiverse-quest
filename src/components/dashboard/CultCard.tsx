import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Twitter } from "lucide-react";
import { Cult } from "@/types/cult";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CultCardProps {
  cult: Cult;
  onJoin: (cultId: string) => void;
}

const CultCard: React.FC<CultCardProps> = ({ cult, onJoin }) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="bg-cultDark/80 border-cultGlow hover:glow-border transition-all duration-300 overflow-hidden"
      style={{ borderColor: cult.theme_color }}
    >
      {cult.banner_url && (
        <div className="h-32 w-full overflow-hidden">
          <img 
            src={cult.banner_url} 
            alt={`${cult.name} banner`}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="relative">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-cultGlow">
            <AvatarImage src={cult.logo_url} />
            <AvatarFallback className="bg-cultPurple text-cultWhite">
              {cult.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-cultWhite flex items-center justify-between flex-1">
            <span>{cult.name}</span>
            {cult.twitter_handle && (
              <a 
                href={`https://twitter.com/${cult.twitter_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cultWhite/60 hover:text-cultWhite transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-cultWhite/80 mb-2">{cult.description}</p>
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-2 py-1 rounded text-sm ${
            cult.cult_type === 'dev' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
          }`}>
            {cult.cult_type === 'dev' ? 'Developer' : 'AI Agent'}
          </span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 border-cultGlow text-cultWhite hover:bg-cultPurple/50"
            onClick={() => onJoin(cult.id)}
          >
            <Users className="mr-2 h-4 w-4" />
            Join
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-cultGlow text-cultWhite hover:bg-cultPurple/50"
            onClick={() => navigate(`/cult/${cult.id}`)}
          >
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CultCard;