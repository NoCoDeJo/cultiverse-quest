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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { Globe, Search, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const navigate = useNavigate();
  const { generateWithAI } = useAI();
  const { toast } = useToast();

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

  const handleJoinCult = async (cultId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cultWhite/60" />
              <Input
                placeholder="Search cults..."
                className="pl-10 bg-cultDark/50 border-cultGlow text-cultWhite placeholder:text-cultWhite/60"
              />
            </div>
            <Select defaultValue="all">
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

          {/* Main Content Tabs */}
          <Tabs defaultValue="discover" className="w-full">
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

            <TabsContent value="discover" className="mt-6">
              {!cults || cults.length === 0 ? (
                <Alert>
                  <AlertDescription className="text-cultWhite">
                    No cults found. Create your first cult to begin your journey.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cults.map(cult => (
                    <CultCard 
                      key={cult.id} 
                      cult={cult}
                      onJoin={handleJoinCult}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-cults" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cults?.filter(cult => cult.founder_id === "current_user_id").map(cult => (
                  <CultCard 
                    key={cult.id} 
                    cult={cult}
                    onJoin={handleJoinCult}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;