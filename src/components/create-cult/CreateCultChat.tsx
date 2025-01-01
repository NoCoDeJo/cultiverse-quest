import { useState } from "react";
import { Message, FormDataType } from "./types";
import { MessageList } from "./MessageList";
import { InputSection } from "./InputSection";

export const CreateCultChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      type: 'system', 
      content: "Welcome! Let's create your cult together. What would you like to name your cult?" 
    }
  ]);
  const [currentStep, setCurrentStep] = useState<'name' | 'description' | 'type' | 'complete'>('name');
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    description: '',
    cult_type: 'dev',
  });

  return (
    <div className="min-h-screen bg-cultDark text-cultWhite p-4">
      <div className="max-w-2xl mx-auto">
        <MessageList messages={messages} />
        <InputSection
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          messages={messages}
          setMessages={setMessages}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
};