import { useSession } from "@supabase/auth-helpers-react";
import { SearchAndFilters } from "@/components/dashboard/SearchAndFilters";
import { DashboardTabs } from "@/components/dashboard/sections/DashboardTabs";
import { motion } from "framer-motion";
import { useFilteredCults } from "@/hooks/useFilteredCults";
import { Cult } from "@/types/cult";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface DashboardContentProps {
  cults: Cult[] | undefined;
  isLoading: boolean;
  refetch: () => void;
}

const DashboardContent = ({ cults, isLoading, refetch }: DashboardContentProps) => {
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    searchQuery,
    setSearchQuery,
    cultType,
    setCultType,
    activeTab,
    setActiveTab,
    filteredCults
  } = useFilteredCults(cults, session?.user?.id);

  const handleJoinCult = async (cultId: string) => {
    try {
      if (!session) {
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('cult_members')
        .insert({
          cult_id: cultId,
          profile_id: session.user.id,
        });

      if (error) throw error;

      refetch();
      toast({
        title: "Success",
        description: "You've successfully joined the cult!",
      });
    } catch (error) {
      console.error('Error joining cult:', error);
      toast({
        title: "Error",
        description: "Failed to join the cult. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          cultType={cultType}
          onTypeChange={(value) => setCultType(value as 'all' | 'dev' | 'agent')}
        />
      </motion.div>

      <DashboardTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredCults={filteredCults}
        onJoinCult={handleJoinCult}
      />
    </>
  );
};

export default DashboardContent;