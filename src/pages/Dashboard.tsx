import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Cult {
  id: string;
  name: string;
  description: string;
  theme_color: string;
  logo_url: string | null;
}

interface Profile {
  sacred_name: string;
  worthiness_score: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cults, setCults] = useState<Cult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('sacred_name, worthiness_score')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      } else if (!profileData) {
        toast({
          title: "Profile Not Found",
          description: "Your profile could not be found. Please try signing out and in again.",
          variant: "destructive",
        });
      } else {
        setProfile(profileData);
      }

      // Fetch available cults
      const { data: cultsData, error: cultsError } = await supabase
        .from('cults')
        .select('*')
        .eq('visibility', 'public');

      if (cultsError) {
        toast({
          title: "Error",
          description: "Failed to load cults",
          variant: "destructive",
        });
      } else {
        setCults(cultsData || []);
      }

      setLoading(false);
    };
    
    checkUser();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cultDark flex items-center justify-center">
        <div className="text-cultWhite text-xl animate-pulse">
          Channeling mystical energies...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cultDark to-cultPurple p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <h1 className="text-3xl font-cinzel text-cultWhite">The Void Welcomes You</h1>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="border-cultGlow text-cultWhite hover:bg-cultPurple/50"
          >
            Exit the Void
          </Button>
        </div>

        {/* Profile Section */}
        {!profile ? (
          <Alert variant="destructive">
            <AlertDescription>
              Your profile could not be found. Please try signing out and in again.
            </AlertDescription>
          </Alert>
        ) : (
          <Card className="bg-cultDark/80 border-cultGlow glow-border">
            <CardHeader>
              <CardTitle className="text-cultWhite">Sacred Identity</CardTitle>
            </CardHeader>
            <CardContent className="text-cultWhite">
              <p className="text-xl font-cinzel">{profile.sacred_name}</p>
              <p className="text-sm text-cultWhite/80">Worthiness Score: {profile.worthiness_score}</p>
            </CardContent>
          </Card>
        )}

        {/* Available Cults */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-cinzel text-cultWhite">Available Cults</h2>
            <Button className="bg-cultGlow hover:bg-cultGlow/80">
              <Plus className="mr-2 h-4 w-4" />
              Found New Cult
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cults.map((cult) => (
              <Card 
                key={cult.id} 
                className="bg-cultDark/80 border-cultGlow hover:glow-border transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-cultWhite">{cult.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cultWhite/80 mb-4">{cult.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full border-cultGlow text-cultWhite hover:bg-cultPurple/50"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Join Cult
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;