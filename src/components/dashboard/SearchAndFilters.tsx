import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cultWhite/60" />
        <Input
          placeholder="Search cults..."
          className="pl-10 bg-cultDark/50 border-cultGlow text-cultWhite placeholder:text-cultWhite/60"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={cultType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[180px] border-cultGlow text-cultWhite bg-cultDark/50">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent className="bg-cultDark border-cultGlow">
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="dev">Developer</SelectItem>
          <SelectItem value="agent">AI Agent</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};