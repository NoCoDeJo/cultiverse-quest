import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/types/profile";
import { Cult } from "@/types/cult";
import ProfileManagement from "@/components/dashboard/sections/profile/ProfileManagement";
import CultCard from "@/components/dashboard/CultCard";
import CreateCultDialog from "@/components/dashboard/CreateCultDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: cults = [], isLoading } = useQuery({
    queryKey: ['cults'],
    queryFn: async () => {
      const { data, error: cultsError } = await supabase
        .from('cults')
        .select('*')
        .eq('visibility', 'public');

      if (cultsError) {
        toast({
          title: "Error",
          description: "Failed to load cults",
          variant: "destructive",
        });
        throw cultsError;
      }

      return (data || []) as Cult[];
    }
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session:", session);

        if (!session) {
          navigate("/auth");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        console.log("Profile data:", profileData, "Error:", profileError);

        if (profileError) {
          throw new Error(`Failed to load profile: ${profileError.message}`);
        }

        if (!profileData) {
          throw new Error("Profile not found. Please try signing out and in again.");
        }

        setProfile(profileData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        console.error("Dashboard error:", err);
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };
    
    checkUser();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleJoinCult = async (cultId: string) => {
    toast({
      title: "Coming Soon",
      description: "Cult joining functionality will be available soon!",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cultDark flex items-center justify-center">
        <div className="text-cultWhite text-xl animate-pulse">
          Channeling mystical energies...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cultDark p-4">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="mt-4 border-cultGlow text-cultWhite hover:bg-cultPurple/50"
          >
            Sign Out and Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cultDark to-cultPurple p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <h1 className="text-3xl font-cinzel text-cultWhite">
            The Void Welcomes You
          </h1>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="border-cultGlow text-cultWhite hover:bg-cultPurple/50"
          >
            Exit the Void
          </Button>
        </div>

        {profile && (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-cultDark/50 border-cultGlow">
              <TabsTrigger value="profile" className="text-cultWhite data-[state=active]:bg-cultPurple">
                Profile
              </TabsTrigger>
              <TabsTrigger value="cults" className="text-cultWhite data-[state=active]:bg-cultPurple">
                Cults
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-6">
              <ProfileManagement profile={profile} />
            </TabsContent>
            <TabsContent value="cults" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-cinzel text-cultWhite">
                    Available Cults
                  </h2>
                  <CreateCultDialog onCultCreated={() => queryClient.invalidateQueries({ queryKey: ['cults'] })} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cults.map((cult) => (
                    <CultCard 
                      key={cult.id} 
                      cult={cult} 
                      onJoin={handleJoinCult}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Dashboard;