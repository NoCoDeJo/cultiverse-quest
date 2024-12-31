import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

const ChatInput = ({ value, onChange, onSubmit, placeholder }: ChatInputProps) => {
  return (
    <div className="flex gap-2 animate-fade-in">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-cultDark/30 border-cultGlow text-cultWhite placeholder:text-cultWhite/50"
        placeholder={placeholder || "Enter your response..."}
      />
      <Button 
        onClick={onSubmit}
        className="bg-cultGlow hover:bg-cultGlow/80 text-cultWhite whitespace-nowrap"
        disabled={!value.trim()}
      >
        Submit
      </Button>
    </div>
  );
};

export default ChatInput;