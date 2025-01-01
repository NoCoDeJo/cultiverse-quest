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
import { Globe, Users, Moon, Skull, Ghost, Sparkles } from "lucide-react";
import { SearchAndFilters } from "@/components/dashboard/SearchAndFilters";
import { useFilteredCults } from "@/hooks/useFilteredCults";
import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const { generateWithAI } = useAI();
  const { toast } = useToast();
  const session = useSession();
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
        <div className="text-cultWhite text-xl animate-pulse flex items-center gap-2">
          <Moon className="animate-spin-slow" />
          Summoning dashboard...
        </div>
      </div>
    );
  }

  const floatingIcons = [
    { icon: Moon, delay: 0 },
    { icon: Skull, delay: 0.2 },
    { icon: Ghost, delay: 0.4 },
    { icon: Sparkles, delay: 0.6 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cultDark to-cultPurple relative overflow-hidden">
      {/* Floating Background Icons */}
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
        >
          <Icon.icon className="w-12 h-12" />
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1)_0%,rgba(0,0,0,0)_70%)]" />
      
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
        <div className="flex flex-col space-y-6">
          {/* Header Section */}
          <motion.div 
            className="flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-3xl font-bold text-cultWhite font-cinzel bg-gradient-to-r from-purple-400 to-cultGlow bg-clip-text text-transparent">
                Explore Mystical Cults
              </h1>
              <p className="text-cultWhite/60 mt-1">Discover and join extraordinary communities</p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={testAI}
                className="border-cultGlow text-cultWhite hover:bg-cultPurple/20 transition-all duration-300 hover:glow-border"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Test AI Integration
              </Button>
              <CreateCultDialog onCultCreated={refetch} />
            </div>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SearchAndFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              cultType={cultType}
              onTypeChange={(value) => setCultType(value as 'all' | 'dev' | 'agent')}
            />
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'discover' | 'my-cults')}>
              <TabsList className="bg-cultDark/50 border-cultGlow">
                <TabsTrigger value="discover" className="text-cultWhite data-[state=active]:bg-cultPurple/30">
                  <Globe className="w-4 h-4 mr-2" />
                  Discover
                </TabsTrigger>
                <TabsTrigger value="my-cults" className="text-cultWhite data-[state=active]:bg-cultPurple/30">
                  <Users className="w-4 h-4 mr-2" />
                  My Cults
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {!filteredCults || filteredCults.length === 0 ? (
                  <Alert className="bg-cultDark/50 border-cultGlow">
                    <AlertDescription className="text-cultWhite flex items-center gap-2">
                      <Ghost className="h-4 w-4" />
                      {activeTab === 'my-cults' 
                        ? "You haven't created any cults yet. Begin your mystical journey by creating your first cult."
                        : "No cults match your search criteria in this realm."}
                    </AlertDescription>
                  </Alert>
                ) : (
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
                    {filteredCults.map((cult, index) => (
                      <motion.div
                        key={cult.id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          show: { opacity: 1, y: 0 }
                        }}
                      >
                        <CultCard 
                          cult={cult}
                          onJoin={handleJoinCult}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;