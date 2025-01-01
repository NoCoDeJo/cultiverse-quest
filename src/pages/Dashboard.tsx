import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Cult } from "@/types/cult";
import { LandingPageContent } from "@/types/landing";
import { Navbar } from "@/components/ui/navbar";
import { useNavigate } from "react-router-dom";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { useFilteredCults } from "@/hooks/useFilteredCults";
import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { Moon, Skull, Ghost, Sparkles } from "lucide-react";
import { SearchAndFilters } from "@/components/dashboard/SearchAndFilters";
import { DashboardHeader } from "@/components/dashboard/sections/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/sections/DashboardTabs";
import { ParticleSystem } from "@/components/effects/ParticleSystem";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { performanceMonitor } from "@/utils/performance";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { generateWithAI } = useAI();
  const { toast } = useToast();
  const session = useSession();
  const currentUserId = session?.user?.id;

  useEffect(() => {
    performanceMonitor.start('dashboard-load');
    performanceMonitor.logNavigationTiming();
    
    return () => {
      performanceMonitor.end('dashboard-load');
    };
  }, []);

  const { data: cults, isLoading, refetch } = useQuery({
    queryKey: ['cults'],
    queryFn: async () => {
      performanceMonitor.start('fetch-cults');
      try {
        const { data, error } = await supabase
          .from('cults')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const processedData = (data || []).map(cult => ({
          ...cult,
          landing_page_content: (cult.landing_page_content as any as LandingPageContent) || { sections: [] }
        })) as Cult[];

        return processedData;
      } finally {
        performanceMonitor.end('fetch-cults');
      }
    },
  });

  const {
    searchQuery,
    setSearchQuery,
    cultType,
    setCultType,
    activeTab,
    setActiveTab,
    filteredCults
  } = useFilteredCults(cults, currentUserId);

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
          profile_id: currentUserId,
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

  const testAI = async () => {
    try {
      const response = await generateWithAI("Hello! Please confirm if you're working properly by responding with a short greeting.");
      if (response) {
        toast({
          title: "AI Response",
          description: response,
        });
      }
    } catch (error) {
      console.error('AI test error:', error);
      toast({
        title: "Error",
        description: "Failed to test AI integration",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cultDark flex items-center justify-center" role="status" aria-label="Loading dashboard">
        <div className="text-cultWhite text-xl animate-pulse flex items-center gap-2">
          <Moon className="animate-spin-slow" aria-hidden="true" />
          <span>Summoning dashboard...</span>
        </div>
      </div>
    );
  }

  const floatingIcons = [
    { icon: Moon, delay: 0, label: "Floating moon" },
    { icon: Skull, delay: 0.2, label: "Floating skull" },
    { icon: Ghost, delay: 0.4, label: "Floating ghost" },
    { icon: Sparkles, delay: 0.6, label: "Floating sparkles" },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-cultDark to-cultPurple relative overflow-hidden">
        <ParticleSystem />
        
        {floatingIcons.map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute text-cultGlow/20"
            initial={{ y: "100vh" }}
            animate={{ 
              y: ["100vh", "-100vh"],
              x: [
                `${Math.random() * 100}vw`,
                `${Math.random() * 100}vw`
              ]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Icon.delay,
              ease: "linear"
            }}
            aria-hidden="true"
          >
            <Icon.icon className="w-12 h-12" aria-label={Icon.label} />
          </motion.div>
        ))}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1)_0%,rgba(0,0,0,0)_70%)]" aria-hidden="true" />
        
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-10 space-y-8">
          <DashboardHeader onTestAI={testAI} onCultCreated={refetch} />
          
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
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
