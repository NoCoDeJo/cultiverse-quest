import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error checking auth status:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: error.message,
        });
        return;
      }
      if (session) {
        navigate("/dashboard");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        });
        navigate("/dashboard");
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out.",
        });
        navigate("/");
      }
    });

    checkUser();
    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black p-4">
      <div className="w-full max-w-md bg-black/30 p-8 rounded-lg backdrop-blur-sm border border-purple-500/20">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="text-white hover:text-purple-400"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Enter the Void</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#6b21a8',
                  brandAccent: '#7c3aed',
                }
              }
            },
            style: {
              button: {
                background: '#2D1B69',
                borderColor: '#8A4FFF',
                color: 'white',
              },
              anchor: {
                color: '#8A4FFF',
              },
              container: {
                color: 'white',
              },
              divider: {
                background: 'rgba(255, 255, 255, 0.1)',
              },
              label: {
                color: 'white',
              },
              input: {
                backgroundColor: 'rgba(45, 27, 105, 0.3)',
                borderColor: '#8A4FFF',
                color: 'white',
              },
            },
          }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default AuthPage;