import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  cultType: string;
  onTypeChange: (value: string) => void;
}

export const SearchAndFilters = ({
  searchQuery,
  onSearchChange,
  cultType,
  onTypeChange,
}: SearchAndFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6" role="search" aria-label="Search and filter cults">
      <motion.div 
        className="relative flex-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cultWhite/60" aria-hidden="true" />
        <Input
          placeholder="Search mystical cults..."
          className="pl-10 bg-cultDark/50 border-cultGlow text-cultWhite placeholder:text-cultWhite/60 focus:ring-cultGlow/50 focus:border-cultGlow transition-all duration-300"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search cults"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Select 
          value={cultType} 
          onValueChange={onTypeChange}
          aria-label="Filter by cult type"
        >
          <SelectTrigger className="w-[180px] border-cultGlow text-cultWhite bg-cultDark/50 focus:ring-cultGlow/50 hover:bg-cultPurple/20 transition-all duration-300">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-cultDark border-cultGlow">
            <SelectItem value="all" className="text-cultWhite hover:bg-cultPurple/20">All Types</SelectItem>
            <SelectItem value="dev" className="text-cultWhite hover:bg-cultPurple/20">Developer</SelectItem>
            <SelectItem value="agent" className="text-cultWhite hover:bg-cultPurple/20">AI Agent</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
    </div>
  );
};