import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Cult } from "@/types/cult";
import { LandingPageContent } from "@/types/landing";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/ui/navbar";
import CreateCultDialog from "@/components/dashboard/CreateCultDialog";
import CultCard from "@/components/dashboard/CultCard";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { Globe, Users } from "lucide-react";
import { SearchAndFilters } from "@/components/dashboard/SearchAndFilters";
import { useFilteredCults } from "@/hooks/useFilteredCults";

const Dashboard = () => {
  const navigate = useNavigate();
  const { generateWithAI } = useAI();
  const { toast } = useToast();

  // Get current user session
  const { data: session } = await supabase.auth.getSession();
  const currentUserId = session?.user?.id;

  const { data: cults, isLoading, refetch } = useQuery({
    queryKey: ['cults'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cults')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(cult => ({
        ...cult,
        landing_page_content: (cult.landing_page_content as any as LandingPageContent) || { sections: [] }
      })) as Cult[];
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
      <div className="min-h-screen bg-cultDark flex items-center justify-center">
        <div className="text-cultWhite text-xl animate-pulse">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cultDark to-cultPurple">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cultWhite">Explore Cults</h1>
              <p className="text-cultWhite/60 mt-1">Discover and join amazing communities</p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={testAI}
                className="border-cultGlow text-cultWhite hover:bg-cultPurple/20"
              >
                Test AI Integration
              </Button>
              <CreateCultDialog onCultCreated={refetch} />
            </div>
          </div>

          {/* Search and Filter Section */}
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            cultType={cultType}
            onTypeChange={setCultType}
          />

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'discover' | 'my-cults')}>
            <TabsList className="bg-cultDark/50 border-cultGlow">
              <TabsTrigger value="discover" className="text-cultWhite">
                <Globe className="w-4 h-4 mr-2" />
                Discover
              </TabsTrigger>
              <TabsTrigger value="my-cults" className="text-cultWhite">
                <Users className="w-4 h-4 mr-2" />
                My Cults
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {!filteredCults || filteredCults.length === 0 ? (
                <Alert>
                  <AlertDescription className="text-cultWhite">
                    {activeTab === 'my-cults' 
                      ? "You haven't created any cults yet. Create your first cult to begin your journey."
                      : "No cults found matching your search criteria."}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCults.map(cult => (
                    <CultCard 
                      key={cult.id} 
                      cult={cult}
                      onJoin={handleJoinCult}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;