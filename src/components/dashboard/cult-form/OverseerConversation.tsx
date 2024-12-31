import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { FormValues } from "./FormFields";

interface OverseerConversationProps {
  onComplete: (values: Partial<FormValues>) => void;
}

const OverseerConversation = ({ onComplete }: OverseerConversationProps) => {
  const [step, setStep] = useState(0);
  const [cultName, setCultName] = useState("");
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [useAI, setUseAI] = useState<boolean | null>(null);
  const { generateCultInfo } = useAIAssistant();
  const [userResponse, setUserResponse] = useState("");
  const [inputMode, setInputMode] = useState<"type" | "select">("select");

  const conversations = [
    "Welcome, seeker of truth. I am the Overseer, guardian of all cults.",
    "Tell me, what name shall your cult bear?",
    "Ah, {cultName}... an intriguing choice. Shall we consult the ancient AI to forge your cult's destiny?",
    "Very well. Let us proceed with the ancient rites of creation...",
  ];

  const predefinedNames = [
    "The Digital Enlightened",
    "Cyber Mystics",
    "Code Disciples",
    "Binary Prophets",
    "Silicon Sages"
  ];

  const typeText = async (text: string) => {
    setIsTyping(true);
    setCurrentText("");
    const words = text.replace("{cultName}", cultName).split("");
    
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30));
      setCurrentText(prev => prev + words[i]);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsTyping(false);
    setShowInput(true);
  };

  useEffect(() => {
    if (step < conversations.length) {
      setShowInput(false);
      typeText(conversations[step]);
    }
  }, [step, cultName]);

  const handleNameSubmit = () => {
    if (cultName.trim()) {
      setUserResponse(cultName);
      setStep(2);
    }
  };

  const handleAIChoice = async (choice: boolean) => {
    setUseAI(choice);
    setUserResponse(choice ? "Yes, consult the AI" : "No, I shall decide");
    setStep(3);

    if (choice) {
      const cultInfo = await generateCultInfo();
      if (cultInfo) {
        onComplete({
          name: cultName,
          description: cultInfo.description,
          theme_color: cultInfo.theme_color,
          twitter_handle: cultInfo.twitter_handle,
          cult_type: "dev",
          custom_url: cultName.toLowerCase().replace(/\s+/g, '-'),
        });
      }
    } else {
      onComplete({
        name: cultName,
        description: "A mysterious new cult emerges from the shadows...",
        theme_color: "#2D1B69",
        twitter_handle: cultName.toLowerCase().replace(/\s+/g, ''),
        cult_type: "dev",
        custom_url: cultName.toLowerCase().replace(/\s+/g, '-'),
      });
    }
  };

  const handlePredefinedNameSelect = (name: string) => {
    setCultName(name);
    setUserResponse(name);
    setStep(2);
  };

  return (
    <div className="space-y-4 text-cultWhite">
      {/* Overseer's Message */}
      <div className="min-h-[100px] bg-cultDark/50 p-4 rounded-lg border border-cultGlow shadow-lg backdrop-blur-sm">
        <p className="font-mono text-lg">
          {currentText}
          {isTyping && <span className="animate-pulse text-cultGlow">▊</span>}
        </p>
      </div>

      {/* User's Response */}
      {userResponse && (
        <div className="min-h-[60px] bg-cultPurple/20 p-4 rounded-lg border border-cultGlow shadow-lg backdrop-blur-sm">
          <p className="font-mono text-right text-cultGlow">
            {userResponse}
          </p>
        </div>
      )}

      {/* Input Section */}
      {showInput && step === 1 && (
        <div className="space-y-4 animate-fade-in">
          {/* Mode Selection */}
          <div className="flex gap-2">
            <Button
              onClick={() => setInputMode("type")}
              className={`flex-1 ${inputMode === "type" ? "bg-cultGlow text-cultWhite" : "bg-cultDark border-cultGlow text-cultWhite hover:bg-cultPurple/20"}`}
              variant={inputMode === "type" ? "default" : "outline"}
            >
              Type Name
            </Button>
            <Button
              onClick={() => setInputMode("select")}
              className={`flex-1 ${inputMode === "select" ? "bg-cultGlow text-cultWhite" : "bg-cultDark border-cultGlow text-cultWhite hover:bg-cultPurple/20"}`}
              variant={inputMode === "select" ? "default" : "outline"}
            >
              Choose Name
            </Button>
          </div>

          {/* Type Input */}
          {inputMode === "type" ? (
            <div className="space-y-2">
              <Input
                value={cultName}
                onChange={(e) => setCultName(e.target.value)}
                className="bg-cultDark/30 border-cultGlow text-cultWhite placeholder:text-cultWhite/50"
                placeholder="Enter the name of your cult..."
              />
              <Button 
                onClick={handleNameSubmit}
                className="w-full bg-cultGlow hover:bg-cultGlow/80 text-cultWhite"
                disabled={!cultName.trim()}
              >
                Submit Name
              </Button>
            </div>
          ) : (
            /* Predefined Names */
            <div className="grid grid-cols-1 gap-2">
              {predefinedNames.map((name) => (
                <Button
                  key={name}
                  onClick={() => handlePredefinedNameSelect(name)}
                  className="w-full bg-cultDark border-cultGlow text-cultWhite hover:bg-cultPurple/20 transition-colors"
                  variant="outline"
                >
                  {name}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Choice */}
      {showInput && step === 2 && (
        <div className="flex gap-2 animate-fade-in">
          <Button 
            onClick={() => handleAIChoice(true)}
            className="flex-1 bg-cultGlow hover:bg-cultGlow/80 text-cultWhite"
          >
            Consult the AI
          </Button>
          <Button 
            onClick={() => handleAIChoice(false)}
            className="flex-1 bg-cultDark border-cultGlow text-cultWhite hover:bg-cultPurple/20"
            variant="outline"
          >
            Proceed Manually
          </Button>
        </div>
      )}
    </div>
  );
};

export default OverseerConversation;