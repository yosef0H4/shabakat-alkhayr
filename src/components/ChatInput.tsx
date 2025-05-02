import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, disabled = false, placeholder }: ChatInputProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;
    
    onSendMessage(trimmedMessage);
    setMessage("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter without Shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder || t("chat.typeSomething")}
            className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-3 pr-10 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 min-h-[44px] max-h-[120px]"
            rows={1}
          />
          {disabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 rounded-lg">
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="rounded-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 text-white p-3 h-[44px] w-[44px] flex items-center justify-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </form>
    </div>
  );
} 