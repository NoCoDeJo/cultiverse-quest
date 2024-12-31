import React from 'react';

interface ChatMessageProps {
  text: string;
  sender: 'overseer' | 'user';
}

const ChatMessage = ({ text, sender }: ChatMessageProps) => {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          sender === 'user'
            ? 'bg-cultGlow/20 text-right'
            : 'bg-cultDark/50 border border-cultGlow'
        }`}
      >
        <p className="font-mono">{text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;