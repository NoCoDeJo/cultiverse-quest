import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { Wand2, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Message = {
  type: 'system' | 'user' | 'assistant';
  content: string;
  field?: string;
};

type FormDataType = {
  name: string;
  description: string;
  cult_type: 'dev' | 'agent';
  custom_url?: string;
};

const CreateCult = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { type: 'system', content: "Welcome! Let's create your cult together. What would you like to name your cult?" }
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentStep, setCurrentStep] = useState<'name' | 'description' | 'type' | 'complete'>('name');
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    description: '',
    cult_type: 'dev',
  });
  const { generateCultInfo } = useAIAssistant();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIButton, setShowAIButton] = useState(false);

  const handleGenerateWithAI = async () => {
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please enter a cult name first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const cultInfo = await generateCultInfo(formData.name);
      if (cultInfo) {
        setFormData(prev => ({
          ...prev,
          description: cultInfo.description,
          cult_type: cultInfo.cult_type || 'dev'
        }));
        
        setMessages(prev => [
          ...prev,
          { type: 'assistant', content: "I've generated some details for your cult:" },
          { type: 'assistant', content: `Description: ${cultInfo.description}` },
          { type: 'assistant', content: `Type: ${cultInfo.cult_type}` },
          { type: 'system', content: "You can continue with these details or modify them as you wish." }
        ]);
        
        setCurrentStep('type');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate cult details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentInput.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { type: 'user', content: currentInput, field: currentStep }
    ];

    setMessages(newMessages);
    setCurrentInput("");

    const updatedFormData = { ...formData };

    if (currentStep === 'name') {
      updatedFormData.name = currentInput;
      setShowAIButton(true);
    } else if (currentStep === 'type') {
      updatedFormData.cult_type = currentInput.toLowerCase() === 'agent' ? 'agent' : 'dev';
    } else if (currentStep === 'description') {
      updatedFormData.description = currentInput;
    }

    setFormData(updatedFormData);

    let nextStep: typeof currentStep = currentStep;
    let systemMessage = '';

    switch (currentStep) {
      case 'name':
        nextStep = 'description';
        systemMessage = "Great name! Now, describe your cult's purpose and vision.";
        break;
      case 'description':
        nextStep = 'type';
        systemMessage = "Choose your cult type: 'dev' for developers or 'agent' for AI agents.";
        break;
      case 'type':
        nextStep = 'complete';
        try {
          const { error } = await supabase.from('cults').insert([{
            name: updatedFormData.name,
            description: updatedFormData.description,
            cult_type: updatedFormData.cult_type,
            theme_color: '#2D1B69'
          }]);
          
          if (error) throw error;
          
          systemMessage = "Perfect! Your cult has been created. Redirecting to dashboard...";
          setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
          systemMessage = "There was an error creating your cult. Please try again.";
          console.error('Error creating cult:', error);
        }
        break;
    }

    if (systemMessage) {
      setMessages([...newMessages, { type: 'system', content: systemMessage }]);
    }
    setCurrentStep(nextStep);
    
    if (nextStep !== 'name') {
      setShowAIButton(false);
    }
  };

  return (
    <div className="min-h-screen bg-cultDark text-cultWhite p-4">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-4 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg",
                message.type === 'system' ? "bg-cultPurple/20" :
                message.type === 'user' ? "bg-cultGlow/20 ml-8" :
                "bg-cultPurple/40 mr-8"
              )}
            >
              {message.content}
            </div>
          ))}
        </div>

        {currentStep !== 'complete' && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-cultDark border-t border-cultGlow">
            <div className="max-w-2xl mx-auto space-y-2">
              {showAIButton && (
                <Button 
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating}
                  variant="outline"
                  className="w-full border-cultGlow text-cultWhite hover:bg-cultPurple/20"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating cult details...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate remaining details with AI
                    </>
                  )}
                </Button>
              )}
              <div className="flex gap-2">
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Type your response..."
                  className="flex-1"
                />
                <Button onClick={handleSubmit}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCult;