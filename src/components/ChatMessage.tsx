import React from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  isLoading?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  // Skip system messages (they're just for context)
  if (message.role === "system") return null;
  
  const isUser = message.role === "user";
  
  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div 
        className={`max-w-3/4 p-3 rounded-lg ${
          isUser 
            ? "bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200" 
            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        }`}
      >
        <div className="prose dark:prose-invert max-w-none">
          {message.isLoading ? (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse delay-300"></div>
            </div>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
} 