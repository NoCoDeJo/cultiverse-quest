import { useState, useEffect } from "react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { FormValues } from "./FormFields";
import ChatMessage from "./chat/ChatMessage";
import ChatInput from "./chat/ChatInput";
import ActionButtons from "./chat/ActionButtons";

interface OverseerConversationProps {
  onComplete: (values: Partial<FormValues>) => void;
}

const OverseerConversation = ({ onComplete }: OverseerConversationProps) => {
  const [step, setStep] = useState(0);
  const [cultName, setCultName] = useState("");
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const { generateCultInfo } = useAIAssistant();
  const [messages, setMessages] = useState<Array<{ text: string; sender: "overseer" | "user" }>>([]);

  const conversations = [
    "Welcome, seeker of truth. I am the Overseer, guardian of all cults.",
    "Tell me, what name shall your cult bear?",
    "Ah, {cultName}... an intriguing choice. Shall we consult the ancient AI to forge your cult's destiny?",
    "Very well. Let us proceed with the ancient rites of creation...",
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
    
    setMessages(prev => [...prev, { text: text.replace("{cultName}", cultName), sender: "overseer" }]);
  };

  useEffect(() => {
    if (step < conversations.length) {
      setShowInput(false);
      typeText(conversations[step]);
    }
  }, [step, cultName]);

  const handleNameSubmit = () => {
    if (cultName.trim()) {
      setMessages(prev => [...prev, { text: cultName, sender: "user" }]);
      setStep(2);
    }
  };

  const handleAIChoice = async (choice: boolean) => {
    const response = choice ? "Yes, guide me, Overseer" : "No, I shall forge my own path";
    setMessages(prev => [...prev, { text: response, sender: "user" }]);
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

  return (
    <div className="space-y-4 text-cultWhite">
      <div className="h-[300px] overflow-y-auto bg-cultDark/30 rounded-lg border border-cultGlow p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} text={message.text} sender={message.sender} />
        ))}
        {isTyping && (
          <ChatMessage 
            text={currentText + "\u258A"} 
            sender="overseer" 
          />
        )}
      </div>

      {showInput && step === 1 && (
        <ChatInput
          value={cultName}
          onChange={setCultName}
          onSubmit={handleNameSubmit}
          placeholder="Enter the name of your cult..."
        />
      )}

      {showInput && step === 2 && (
        <ActionButtons
          onAIConsult={() => handleAIChoice(true)}
          onManualProceed={() => handleAIChoice(false)}
        />
      )}
    </div>
  );
};

export default OverseerConversation;