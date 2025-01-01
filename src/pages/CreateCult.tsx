import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { useCreateCult } from "@/components/dashboard/cult-form/useCreateCult";
import { Wand2, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  type: 'system' | 'user' | 'assistant';
  content: string;
  field?: string;
};

type FormDataType = {
  name: string;
  description: string;
  twitter_handle?: string;
  cult_type: 'dev' | 'agent';
  custom_url?: string;
};

const CreateCult = () => {
  const navigate = useNavigate();
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
  const { form, onSubmit } = useCreateCult(() => navigate('/dashboard'));
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateWithAI = async () => {
    if (!formData.name) {
      setMessages(prev => [...prev, { 
        type: 'system', 
        content: "Please enter a cult name first before generating with AI." 
      }]);
      return;
    }

    setIsGenerating(true);
    const cultInfo = await generateCultInfo();
    setIsGenerating(false);

    if (cultInfo) {
      form.setValue("name", formData.name);
      form.setValue("description", cultInfo.description);
      form.setValue("theme_color", cultInfo.theme_color);
      await onSubmit({
        name: formData.name,
        description: cultInfo.description,
        theme_color: cultInfo.theme_color,
        cult_type: 'dev',
      });
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
    if (currentStep === 'type') {
      // Validate cult type input
      const cultType = currentInput.toLowerCase();
      updatedFormData.cult_type = cultType === 'agent' ? 'agent' : 'dev';
    } else {
      updatedFormData[currentStep as keyof FormDataType] = currentInput;
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
        await onSubmit({
          ...updatedFormData,
          theme_color: '#2D1B69',
        });
        systemMessage = "Perfect! Your cult has been created. Redirecting to dashboard...";
        break;
    }

    if (systemMessage) {
      setMessages([...newMessages, { type: 'system', content: systemMessage }]);
    }
    setCurrentStep(nextStep);
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
            <div className="max-w-2xl mx-auto flex gap-2">
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
              {currentStep === 'name' && (
                <Button 
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating || !currentInput}
                  variant="outline"
                  className="border-cultGlow"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCult;