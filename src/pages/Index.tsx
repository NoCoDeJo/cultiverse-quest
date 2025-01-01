import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skull, Moon, Star, Ghost, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
          console.log("User is authenticated, redirecting to dashboard");
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Auth error:", error);
        toast({
          title: "Error",
          description: "Failed to check authentication status",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cultDark flex items-center justify-center">
        <div className="text-cultWhite text-xl animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cultDark overflow-hidden">
      {/* Animated background pattern */}
      <div className="fixed inset-0 sacred-pattern opacity-5" />
      
      {/* Floating mystical elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Moon className="absolute top-20 left-10 text-cultGlow opacity-20 animate-float" size={40} />
        <Star className="absolute top-40 right-20 text-cultGlow opacity-20 animate-float delay-200" size={40} />
        <Ghost className="absolute bottom-20 left-20 text-cultGlow opacity-20 animate-float delay-300" size={40} />
        <Skull className="absolute bottom-40 right-10 text-cultGlow opacity-20 animate-float delay-100" size={40} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center relative z-10">
          {/* Glowing title */}
          <div className="inline-block group">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-[linear-gradient(102.3deg,rgba(147,39,143,1)_5.9%,rgba(234,172,232,1)_64%,rgba(246,219,245,1)_89%)] animate-background-shine">
              Cult-iverse Protocol
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-cultGlow via-purple-400 to-cultGlow rounded-full animate-glow-pulse" />
          </div>
          
          <p className="text-xl text-cultWhite/80 mb-8 max-w-2xl mx-auto mt-6 animate-fade-in">
            The next generation of decentralized community building. 
            Join the revolution or create your own movement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate("/auth")}
              className="group relative bg-cultGlow hover:bg-cultGlow/90 text-white px-8 py-6 text-xl rounded-lg transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cultGlow via-purple-500 to-cultGlow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center">
                Enter the Protocol
                <Sparkles className="ml-2 w-5 h-5 animate-glow-pulse" />
              </span>
            </Button>
          </div>
        </div>

        {/* Tech Stack Section with mystical styling */}
        <div className="mt-24 relative z-10">
          <h2 className="text-2xl font-bold text-center mb-8 text-cultWhite font-cinzel">Built with Arcane Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Skull className="h-6 w-6 text-cultGlow" />,
                title: "Dark Arts of React",
                description: "Crafted with forbidden TypeScript knowledge"
              },
              {
                icon: <Moon className="h-6 w-6 text-cultGlow" />,
                title: "Mystical Styling",
                description: "Enchanted with Tailwind's ancient runes"
              },
              {
                icon: <Star className="h-6 w-6 text-cultGlow" />,
                title: "Sacred Backend",
                description: "Protected by cryptic security seals"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-cultPurple/20 p-6 rounded-lg border border-cultGlow/20 backdrop-blur-sm hover:border-cultGlow/40 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-cultGlow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                <div className="relative z-10">
                  <div className="bg-cultPurple/40 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cultPurple/60 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-cultWhite mb-2 font-cinzel">{feature.title}</h3>
                  <p className="text-cultWhite/70">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;