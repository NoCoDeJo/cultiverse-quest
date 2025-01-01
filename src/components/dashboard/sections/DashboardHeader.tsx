import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateCultDialog from "@/components/dashboard/CreateCultDialog";

interface DashboardHeaderProps {
  onTestAI: () => void;
  onCultCreated: () => void;
}

export const DashboardHeader = ({ onTestAI, onCultCreated }: DashboardHeaderProps) => {
  return (
    <motion.div 
      className="flex justify-between items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-4xl font-bold text-cultWhite font-cinzel bg-gradient-to-r from-purple-400 to-cultGlow bg-clip-text text-transparent animate-background-shine bg-[length:400%_100%]">
          Explore Mystical Cults
        </h1>
        <p className="text-cultWhite/60 mt-2 font-inter">
          Discover and join extraordinary communities
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onTestAI}
          className="border-cultGlow text-cultWhite hover:bg-cultPurple/20 transition-all duration-300 hover:glow-border group"
        >
          <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
          Test AI Integration
        </Button>
        <CreateCultDialog onCultCreated={onCultCreated} />
      </div>
    </motion.div>
  );
};