import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

interface ReplyFormProps {
  postId: Id<"posts">;
  onSuccess?: () => void;
}

export function ReplyForm({ postId, onSuccess }: ReplyFormProps) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const maxChars = 280; // Twitter-like character limit

  const createReply = useMutation(api.replies.create);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= maxChars) {
      setText(newText);
      setCharCount(newText.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error(t('errors.replyCannotBeEmpty'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createReply({
        postId,
        text: text.trim()
      });
      
      setText("");
      setCharCount(0);
      toast.success(t('success.replyPosted'));
      onSuccess?.();
    } catch (error) {
      toast.error(t('errors.postReplyFailed'));
      console.error("Error creating reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMarkdownPreview = () => {
    setShowMarkdownPreview(!showMarkdownPreview);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="compose-box relative border border-gray-200 dark:border-[#38444d] rounded-2xl transition-colors p-3">
        <div className="flex justify-between items-center mb-2">
          
          <button 
            type="button"
            onClick={toggleMarkdownPreview}
            className="text-xs text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {showMarkdownPreview ? "Edit" : "Preview"}
          </button>
        </div>
        
        {showMarkdownPreview ? (
          <div className="min-h-[80px] bg-white dark:bg-[#253341] border border-gray-200 dark:border-[#38444d] rounded-lg p-3 mb-3 overflow-y-auto prose dark:prose-invert max-w-none prose-sm">
            {text ? (
              <ReactMarkdown>{text}</ReactMarkdown>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 italic">No content to preview</p>
            )}
          </div>
        ) : (
          <textarea
            value={text}
            onChange={handleTextChange}
            className="w-full bg-transparent border-0 resize-none focus:outline-none placeholder-gray-400 dark:placeholder-gray-600 min-h-[80px]"
            placeholder={t('replies.writeReply')}
            maxLength={maxChars}
          />
        )}
        
        
        
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-[#38444d]">
          <div className={`text-xs ${
            maxChars - charCount < 20 
              ? "text-red-500 dark:text-red-400" 
              : "text-gray-500 dark:text-gray-400"
          }`}>
            {maxChars - charCount}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || text.trim().length === 0}
            className="px-4 py-1.5 bg-primary-500 text-white rounded-full text-sm font-bold transition-colors hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t('replies.posting')}</span>
              </div>
            ) : (
              t('replies.postReply')
            )}
          </button>
        </div>
      </div>
    </form>
  );
}