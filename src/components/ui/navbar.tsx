import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      // First check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session, just redirect to home
        navigate("/");
        return;
      }

      // Proceed with sign out
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      // If any error occurs, force navigate to home
      navigate("/");
    }
  };

  return (
    <nav className="bg-cultDark/80 border-b border-cultGlow backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Button
            variant="ghost"
            className="text-cultWhite hover:text-cultGlow"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="h-5 w-5 mr-2" />
            Dashboard
          </Button>
          
          <Button
            variant="ghost"
            className="text-cultWhite hover:text-cultGlow"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
};