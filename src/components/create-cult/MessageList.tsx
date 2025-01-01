import { cn } from "@/lib/utils";
import { Message } from "./types";
import { motion } from "framer-motion";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="space-y-4 mb-4">
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={cn(
            "p-4 rounded-lg",
            message.type === 'system' ? "bg-cultPurple/20" :
            message.type === 'user' ? "bg-cultGlow/20 ml-8" :
            "bg-cultPurple/40 mr-8"
          )}
        >
          {message.content}
        </motion.div>
      ))}
    </div>
  );
};