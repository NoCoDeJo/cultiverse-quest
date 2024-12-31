import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users, Sparkles, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 tracking-tight">
            Welcome to the <span className="text-purple-400">Cult-iverse</span>
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Join a community of like-minded individuals or create your own mystical following. 
            Your journey into enlightenment begins here.
          </p>
          <Button 
            onClick={() => navigate("/auth")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-xl rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          >
            Enter the Void
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-purple-900/30 p-6 rounded-lg border border-purple-500/20 backdrop-blur-sm">
            <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-purple-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Join Communities</h3>
            <p className="text-purple-200">
              Find your spiritual family among our diverse collection of mystical communities.
            </p>
          </div>

          <div className="bg-purple-900/30 p-6 rounded-lg border border-purple-500/20 backdrop-blur-sm">
            <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-purple-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Gain Enlightenment</h3>
            <p className="text-purple-200">
              Increase your worthiness score through participation and dedication.
            </p>
          </div>

          <div className="bg-purple-900/30 p-6 rounded-lg border border-purple-500/20 backdrop-blur-sm">
            <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-purple-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Create Your Own</h3>
            <p className="text-purple-200">
              Start your own cult and lead others on the path to enlightenment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;