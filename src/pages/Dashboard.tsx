import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Cult } from "@/types/cult";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Dashboard = () => {
  const { data: cults, isLoading } = useQuery({
    queryKey: ['cults'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cults')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Ensure each cult has the correct landing_page_content structure
      return (data || []).map(cult => ({
        ...cult,
        landing_page_content: (cult.landing_page_content as LandingPageContent) || { sections: [] }
      })) as Cult[];
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cultDark flex items-center justify-center">
        <div className="text-cultWhite text-xl animate-pulse">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!cults || cults.length === 0) {
    return (
      <div className="min-h-screen bg-cultDark p-4">
        <Alert variant="destructive">
          <AlertDescription>No cults found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cultDark to-cultPurple p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {cults.map(cult => (
          <div key={cult.id} className="bg-cultDark/50 border border-cultGlow p-4 rounded-lg">
            <h2 className="text-cultWhite text-xl">{cult.name}</h2>
            <p className="text-cultWhite/80">{cult.description}</p>
            <Button variant="outline" className="mt-2">
              View Cult
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
