import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Landing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          toast({
            title: "Welcome back",
            description: "You have been successfully authenticated.",
          });
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error handling redirect:", error);
        toast({
          title: "Authentication Error",
          description: "There was a problem with the authentication process.",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    handleRedirect();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-cultDark flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-cultWhite mb-4">Welcome to the Void</h1>
        <div className="animate-pulse">
          <ArrowRight className="w-8 h-8 text-cultGlow mx-auto" />
        </div>
        <p className="text-cultWhite/80">Redirecting you to your destination...</p>
        <Button 
          variant="link" 
          onClick={() => navigate("/dashboard")}
          className="text-cultGlow hover:text-cultGlow/80"
        >
          Click here if you're not redirected automatically
        </Button>
      </div>
    </div>
  );
};

export default Landing;