import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);
      
      // First clear any stored session data
      await supabase.auth.clearSession();
      
      // Then perform the sign out
      const { error } = await supabase.auth.signOut({
        scope: 'local'  // Only sign out locally to avoid JWT validation
      });
      
      if (error) throw error;

      // Navigate immediately after successful sign out
      navigate('/');
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      // Still navigate even if there's an error
      navigate('/');
      
      toast({
        title: "Session ended",
        description: "You have been logged out.",
      });
    } finally {
      setIsSigningOut(false);
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
            disabled={isSigningOut}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </div>
    </nav>
  );
};