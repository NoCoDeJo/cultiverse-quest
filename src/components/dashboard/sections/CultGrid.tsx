import { motion } from "framer-motion";
import { Cult } from "@/types/cult";
import CultCard from "../CultCard";

interface CultGridProps {
  cults: Cult[];
  onJoinCult: (cultId: string) => void;
}

const CultGrid = ({ cults, onJoinCult }: CultGridProps) => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      initial="hidden"
      animate="show"
    >
      {cults.map((cult) => (
        <motion.div
          key={cult.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
        >
          <CultCard 
            cult={cult}
            onJoin={onJoinCult}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CultGrid;