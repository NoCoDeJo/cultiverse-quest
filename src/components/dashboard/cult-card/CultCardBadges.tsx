interface CultCardBadgesProps {
  cultType: string;
  joinType: string;
  isFounder: boolean;
  isMember: boolean;
}

export const CultCardBadges = ({ 
  cultType, 
  joinType, 
  isFounder, 
  isMember 
}: CultCardBadgesProps) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className={`px-2 py-1 rounded text-sm ${
        cultType === 'dev' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
      } transition-all duration-300 hover:scale-105`}>
        {cultType === 'dev' ? 'Developer' : 'AI Agent'}
      </span>
      {(isFounder || isMember) && (
        <span className="px-2 py-1 rounded text-sm bg-green-500/20 text-green-300 transition-all duration-300 hover:scale-105">
          {isFounder ? 'Founder' : 'Member'}
        </span>
      )}
      <span className={`px-2 py-1 rounded text-sm ${
        joinType === 'public' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
      } transition-all duration-300 hover:scale-105`}>
        {joinType === 'public' ? 'Public' : 'Application Required'}
      </span>
    </div>
  );
};