import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Code2, Cpu, Globe, Shield, Terminal, Waves } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cultDark overflow-hidden">
      {/* Animated background pattern */}
      <div className="fixed inset-0 sacred-pattern opacity-5" />
      
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Floating tech elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Code2 className="absolute top-20 left-10 text-cultGlow opacity-20 animate-float" size={40} />
          <Terminal className="absolute top-40 right-20 text-cultGlow opacity-20 animate-float" size={40} />
          <Cpu className="absolute bottom-20 left-20 text-cultGlow opacity-20 animate-float" size={40} />
          <Globe className="absolute bottom-40 right-10 text-cultGlow opacity-20 animate-float" size={40} />
        </div>

        <div className="text-center relative z-10">
          <div className="inline-block">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cultGlow to-purple-400">
              Cult-iverse Protocol
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-cultGlow to-purple-400 rounded-full" />
          </div>
          
          <p className="text-xl text-cultWhite/80 mb-8 max-w-2xl mx-auto mt-6 animate-fade-in">
            The next generation of decentralized community building. 
            Join the revolution or create your own movement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate("/auth")}
              className="relative group bg-cultGlow hover:bg-cultGlow/90 text-white px-8 py-6 text-xl rounded-lg transition-all duration-300"
            >
              <span className="relative z-10">Enter the Protocol</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cultGlow to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mt-24 relative z-10">
          <h2 className="text-2xl font-bold text-center mb-8 text-cultWhite">Built with Modern Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Terminal className="h-6 w-6 text-cultGlow" />,
                title: "React.js + TypeScript",
                description: "Modern frontend architecture with type safety"
              },
              {
                icon: <Waves className="h-6 w-6 text-cultGlow" />,
                title: "Tailwind CSS",
                description: "Advanced styling with modern CSS features"
              },
              {
                icon: <Shield className="h-6 w-6 text-cultGlow" />,
                title: "Secure Backend",
                description: "Protected by enterprise-grade security"
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
                  <h3 className="text-xl font-semibold text-cultWhite mb-2">{feature.title}</h3>
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