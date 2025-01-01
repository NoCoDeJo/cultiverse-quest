import { CardHeader, CardTitle } from "@/components/ui/card";
import { Twitter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Cult } from "@/types/cult";

interface CultCardHeaderProps {
  cult: Cult;
}

export const CultCardHeader = ({ cult }: CultCardHeaderProps) => {
  return (
    <CardHeader className="relative">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-cultGlow animate-pulse">
          <AvatarImage src={cult.logo_url} />
          <AvatarFallback className="bg-cultPurple text-cultWhite">
            {cult.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-cultWhite flex items-center justify-between flex-1">
          <span className="font-cinzel">{cult.name}</span>
          {cult.twitter_handle && (
            <a 
              href={`https://twitter.com/${cult.twitter_handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cultWhite/60 hover:text-cultWhite transition-colors transform hover:scale-110 duration-300"
            >
              <Twitter className="h-5 w-5" />
            </a>
          )}
        </CardTitle>
      </div>
    </CardHeader>
  );
};