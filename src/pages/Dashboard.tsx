import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    
    checkUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end p-4">
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="text-white border-purple-500 hover:bg-purple-900/50"
          >
            Sign Out
          </Button>
        </div>
        <div className="text-white text-center mt-20">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Void</h1>
          <p className="text-lg text-purple-200">Your journey begins here...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;