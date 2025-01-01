import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Cult } from "@/types/cult";
import { Navbar } from "@/components/ui/navbar";
import { useAI } from "@/hooks/useAI";
import { DashboardHeader } from "@/components/dashboard/sections/DashboardHeader";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { performanceMonitor } from "@/utils/performance";
import { useEffect, useState } from "react";
import DashboardContent from "@/components/dashboard/sections/DashboardContent";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

const Dashboard = () => {
  const { generateWithAI } = useAI();
  const { toast } = useToast();
  const navigate = useNavigate();
  const session = useSession();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!session) {
          console.log("User is not authenticated, redirecting to auth");
          navigate('/auth');
        }
      } catch (error) {
        console.error("Auth error:", error);
        toast({
          title: "Error",
          description: "Failed to check authentication status",
          variant: "destructive",
        });
        navigate('/auth');
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

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

        return data.map(cult => ({
          ...cult,
          landing_page_content: cult.landing_page_content ? 
            (typeof cult.landing_page_content === 'string' ? 
              JSON.parse(cult.landing_page_content) : 
              cult.landing_page_content) as Cult['landing_page_content'] : 
            { sections: [] }
        })) as Cult[];
      } finally {
        performanceMonitor.end('fetch-cults');
      }
    },
    enabled: !isCheckingAuth && !!session,
  });

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

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-cultDark flex items-center justify-center">
        <div className="text-cultWhite text-xl animate-pulse">
          Verifying access...
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-cultDark to-cultPurple relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1)_0%,rgba(0,0,0,0)_70%)]" aria-hidden="true" />
        
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-10 space-y-8">
          <DashboardHeader onTestAI={testAI} onCultCreated={refetch} />
          <DashboardContent 
            cults={cults}
            isLoading={isLoading}
            refetch={refetch}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;