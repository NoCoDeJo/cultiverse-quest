import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Cult } from "@/types/cult";
import { LandingPageContent } from "@/types/landing";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/ui/navbar";
import CreateCultDialog from "@/components/dashboard/CreateCultDialog";
import CultCard from "@/components/dashboard/CultCard";

const Dashboard = () => {
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
    } catch (error) {
      console.error('Error joining cult:', error);
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cultWhite">Your Cults</h1>
          <CreateCultDialog onCultCreated={refetch} />
        </div>
        
        {!cults || cults.length === 0 ? (
          <Alert>
            <AlertDescription>
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
      </div>
    </div>
  );
};

export default Dashboard;