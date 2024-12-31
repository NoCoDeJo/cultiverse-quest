import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-8">Welcome to the Cult-iverse</h1>
        <p className="text-xl text-purple-200 mb-12">Your journey into the mystical realms awaits...</p>
        <Button 
          onClick={() => navigate("/auth")}
          className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-6 text-xl"
        >
          Enter the Void
        </Button>
      </div>
    </div>
  );
};

export default Index;