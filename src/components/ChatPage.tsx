// Enhanced ChatPage.tsx component with improved conversation logic

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { GoogleGenAI } from "@google/genai";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import i18n from "../lib/i18n";

// Import necessary components
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { PostPreview } from "./PostPreview";

// Define message types
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  isLoading?: boolean;
}

// Define user intent types
type UserIntent = "need_help" | "offer_help" | "search" | "settings" | null;

// Define the structure for post data
interface PostData {
  title: string;
  description: string;
  location?: string;
  contactInfo?: string;
  tags?: string[];
  type: "helpNeeded" | "helpOffered";
}

export function ChatPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiKey, setApiKey] = useState("");
  const [isKeyStored, setIsKeyStored] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(true);
  
  // Simplified state management
  const [userIntent, setUserIntent] = useState<UserIntent>(null);
  const [showIntentButtons, setShowIntentButtons] = useState(true);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postData, setPostData] = useState<PostData | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [userLanguageStyle, setUserLanguageStyle] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get the create post mutation
  const createPost = useMutation(api.posts.create);
  
  // Load API key from localStorage if available
  useEffect(() => {
    try {
      const storedKey = localStorage.getItem("gemini_api_key");
      if (storedKey) {
        // Trim the stored key before using it
        const trimmedKey = storedKey.trim();
        
        // Basic format validation
        if (isValidApiKeyFormat(trimmedKey)) {
          setApiKey(trimmedKey);
          setIsKeyStored(true);
          setShowConsentDialog(false);
        } else {
          // If stored key is invalid, remove it and prompt for a new one
          console.warn("Stored API key is invalid, prompting for a new one");
          localStorage.removeItem("gemini_api_key");
          toast.error("Your saved API key appears to be invalid. Please enter a new one.");
        }
      }
    } catch (error) {
      console.error("Error loading API key from localStorage:", error);
      // In case of any errors, reset to the consent dialog
      setShowConsentDialog(true);
    }
  }, []);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send welcome message when conversation starts
  useEffect(() => {
    if (isKeyStored && messages.length === 0) {
      const welcomeMessage: Message = {
        role: "assistant",
        content: t("chat.welcome")
      };
      setMessages([welcomeMessage]);
    }
  }, [isKeyStored, messages.length, t]);
  
  // Function to validate Gemini API key format
  const isValidApiKeyFormat = (key: string): boolean => {
    // Gemini API keys are typically:
    // - Don't contain spaces
    // - Have a specific length pattern
    // - Alphanumeric with some special characters
    // This is a basic validation that might need adjustments
    if (!key || key.includes(" ")) return false;
    
    // Typically API keys have some minimum length
    if (key.length < 10) return false;
    
    return true;
  };
  
  // Test the API key with a simple prompt to verify it works
  const testApiKey = async (key: string): Promise<boolean> => {
    try {
      const ai = new GoogleGenAI({ apiKey: key.trim() });
      
      // Use a minimal prompt to test the key
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: "Test"
      });
      
      // If we get here, the key is valid
      return true;
    } catch (error: any) {
      console.error("API key validation error:", error);
      
      // Check for specific error messages that indicate invalid key
      if (error.message?.includes("API key not valid")) {
        return false;
      }
      
      // For other errors (network, etc.), we'll assume the key might be valid
      // and the error is due to other issues
      return true;
    }
  };
  
  // Handle API key management
  const handleSaveApiKey = async () => {
    if (!apiKey) {
      toast.error(t("chat.emptyApiKey"));
      return;
    }
    
    if (!hasAcceptedTerms) {
      toast.error(t("chat.mustAcceptTerms"));
      return;
    }
    
    // Trim whitespace from API key
    const trimmedKey = apiKey.trim();
    
    if (trimmedKey !== apiKey) {
      setApiKey(trimmedKey);
    }
    
    // Basic format validation
    if (!isValidApiKeyFormat(trimmedKey)) {
      toast.error("API key appears to be invalid. Please check for spaces or formatting issues.");
      return;
    }
    
    // Show loading state
    toast.loading("Validating API key...");
    
    // Test the API key with a real request
    const isValid = await testApiKey(trimmedKey);
    
    // Dismiss the loading toast
    toast.dismiss();
    
    if (!isValid) {
      toast.error("The API key is invalid. Please check your key and try again.");
      return;
    }
    
    // Store the validated key
    localStorage.setItem("gemini_api_key", trimmedKey);
    setApiKey(trimmedKey);
    setIsKeyStored(true);
    setShowConsentDialog(false);
    toast.success(t("chat.apiKeySaved"));
  };
  
  const handleClearApiKey = () => {
    localStorage.removeItem("gemini_api_key");
    setApiKey("");
    setIsKeyStored(false);
    setShowConsentDialog(true);
  };

  // Helper function to detect user's language and style
  const detectUserLanguageStyle = (message: string): string => {
    // This is a simple implementation. In a real app, you might use
    // more sophisticated language detection libraries or APIs
    if (!message || message.trim().length < 5) return "";
    
    // Return the message as a sample of their style
    return message.trim();
  };

  // Helper to detect language from i18n
  const detectUserLanguage = (): string => {
    // Get the current language from i18n, which is already set up with browser detection
    return i18n.language || "en";
  };

  // Handle user intent selection
  const handleIntentSelection = async (intent: UserIntent) => {
    setUserIntent(intent);
    setShowIntentButtons(false);
    
    // Add user intent as a message
    let intentMessage = "";
    switch (intent) {
      case "need_help":
        intentMessage = t("chat.intentNeedHelp");
        break;
      case "offer_help":
        intentMessage = t("chat.intentOfferHelp");
        break;
      case "search":
        intentMessage = t("chat.intentSearch");
        break;
      case "settings":
        intentMessage = t("chat.intentSettings");
        break;
    }
    
    // Add user message
    const userMessage: Message = { 
      role: "user", 
      content: intentMessage 
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Set initial language style based on the translated message
    setUserLanguageStyle(intentMessage);
    
    // Generate AI response based on intent
    await handleInitialIntentResponse(intent, intentMessage);
  };

  // Generate AI response based on initial intent
  const handleInitialIntentResponse = async (intent: UserIntent, userMessage: string = "") => {
    if (!apiKey) {
      toast.error(t("chat.noApiKey"));
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Initialize Gemini with user's API key - make sure it's trimmed
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      
      // Get user's language from i18n
      const userLang = detectUserLanguage();
      
      // Create an example message to help AI understand the language
      const langContext = userMessage || t("chat.welcome");
      
      // Create a system prompt based on intent
      const systemPrompt = `You are a helpful assistant in a charity app. The user has indicated they ${
        intent === "need_help" ? "need help with something" : 
        intent === "offer_help" ? "want to offer help to others" :
        intent === "search" ? "want to search for something" :
        "have a question"
      }.
      
      IMPORTANT: Your response should be DIRECT and should NOT include prefixes like "assistant:" or "user:" or repeat any part of the conversation history.
      
      VERY IMPORTANT: The user's language is "${userLang}". Their last message was: "${langContext}".
      You MUST respond in the same language as the user's last message (e.g., Arabic, English, Spanish, etc.).
      Use a standard, formal version of that language - do NOT attempt to mimic slang, dialect, or informal speech patterns.
      
      ${intent === "need_help" ? 
        `Be direct and brief. Ask only the most essential questions.
        
        Start with a simple question about what specific type of help they need.
        
        The key information we'll eventually need is:
        - What type of help they need
        - The location where help is needed
        - How they can be contacted
        
        But don't ask for all of this at once - just focus on understanding their need first.
        
        Be concise and avoid asking too many follow-up questions.` 
        : 
        intent === "offer_help" ?
        `Be direct and brief. Ask only the most essential questions.
        
        Start by asking what specific help they can provide.
        
        Eventually, we'll need to know:
        - The help they can provide
        - Their location
        - Contact information
        
        But focus on one thing at a time and keep the conversation flowing naturally without too many questions.`
        :
        intent === "search" ?
        `Ask briefly and directly what they're looking for within the app.
        
        Keep your response short and to the point. Avoid asking multiple follow-up questions.`
        :
        `How can I assist you today? Please be specific about what you need help with.`
      }
      
      Use a friendly but concise tone. No need to introduce yourself - just ask a simple question.`;
      
      // Generate content using the proper chat format
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: systemPrompt
      });

      // Get response text, with fallback for undefined
      let responseText = response.text || "Sorry, I couldn't generate a response.";
      
      // Clean up any accidentally included prefixes or formatting artifacts
      responseText = responseText
        .replace(/^(assistant|user):\s*/gi, '')  // Remove role prefixes
        .replace(/^AI:\s*/gi, '')               // Remove AI: prefix
        .trim();
      
      // Add assistant message to chat
      const assistantMessage: Message = { 
        role: "assistant", 
        content: responseText 
      };
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error: any) {
      console.error("Error generating response:", error);
      
      // Handle specific error cases
      if (error.message?.includes("API key not valid")) {
        toast.error(t("chat.invalidApiKey"));
        handleClearApiKey();
      } else if (error.message?.includes("quota exceeded")) {
        toast.error(t("chat.quotaExceeded"));
      } else {
        toast.error(t("chat.apiError"));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (message: string) => {
    if (!apiKey) {
      toast.error(t("chat.noApiKey"));
      return;
    }
    
    // Detect and update user's language and style
    if (!userLanguageStyle || userLanguageStyle.length < 5) {
      const detectedStyle = detectUserLanguageStyle(message);
      if (detectedStyle) {
        setUserLanguageStyle(detectedStyle);
      }
    }
    
    // Add user message to chat
    const userMessage: Message = { role: "user", content: message };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      setIsGenerating(true);
      
      // Initialize Gemini with user's API key - make sure it's trimmed
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      
      // Create context from previous messages for the prompt
      const conversation = messages.map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n\n');
      
      // Add the new message to the conversation
      const fullConversation = `${conversation}\n\nUser: ${message}`;
      
      // Get user's language from i18n
      const userLang = detectUserLanguage();
      
      // Create system instructions
      const systemInstructions = `You are a helpful assistant in a charity app. 
      
      IMPORTANT: Your response should be DIRECT and should NOT include prefixes like "assistant:" or "user:" or repeat any part of the conversation history.
      
      VERY IMPORTANT: The user's language is "${userLang}". Their current message is: "${message}".
      You MUST respond in the same language as the user's message (e.g., Arabic, English, Spanish, etc.).
      Use a standard, formal version of that language - do NOT attempt to mimic slang, dialect, or informal speech patterns.
      
      ${userIntent === "need_help" ? 
        `You're helping someone describe what help they need. 
        
        IMPORTANT: Be brief and direct. Avoid asking too many detailed questions.
        
        If their description is clear enough, acknowledge it and move on.
        Only ask for further details if absolutely necessary.
        
        The essential information to gather eventually is:
        - What type of help they need
        - The location where help is needed
        - How they can be contacted
        
        Once this information is provided, remind the user they can click the "Review & Create Post" button.`
        : 
        userIntent === "offer_help" ?
        `You're helping someone describe what help they can offer. Be brief and direct.
        
        Gather only these essential pieces of information, without asking too many questions:
        - A description of the help they can provide
        - The location where they can offer help
        - How they can be contacted
        
        Once this information is provided, remind the user about the "Review & Create Post" button.`
        :
        userIntent === "search" ?
        `You're helping someone search for posts WITHIN THIS APP. Be direct and avoid asking multiple follow-up questions.
        
        DO NOT perform web searches or provide general information outside the app.
        Remind them they can use the main Feed tab for more detailed filtering options.`
        :
        "Be concise and helpful regarding app settings and functions."
      }`;
      
      // Combine system instructions and conversation history
      const finalPrompt = `${systemInstructions}\n\nConversation history:\n${fullConversation}\n\nAssistant:`;
      
      // Generate content using the proper format
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: finalPrompt
      });

      // Get response text, with fallback for undefined
      let responseText = response.text || "Sorry, I couldn't generate a response.";
      
      // Clean up any accidentally included prefixes or formatting artifacts
      responseText = responseText
        .replace(/^(assistant|user):\s*/gi, '')  // Remove role prefixes
        .replace(/^AI:\s*/gi, '')               // Remove AI: prefix
        .trim();
      
      // Add assistant message to chat
      const assistantMessage: Message = { role: "assistant", content: responseText };
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error: any) {
      console.error("Error generating response:", error);
      
      // Handle specific error cases
      if (error.message?.includes("API key not valid")) {
        toast.error(t("chat.invalidApiKey"));
        handleClearApiKey();
      } else if (error.message?.includes("quota exceeded")) {
        toast.error(t("chat.quotaExceeded"));
      } else {
        toast.error(t("chat.apiError"));
      }
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle creating a post preview from the conversation
  const handleReviewAndCreatePost = async () => {
    if (userIntent !== "need_help" && userIntent !== "offer_help") {
      toast.error(t("chat.cannotCreatePostWithoutIntent"));
      return;
    }
    
    try {
      setIsCreatingPost(true);
      
      // Initialize Gemini with user's API key - make sure it's trimmed
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      
      // Create context from the conversation
      const conversation = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join("\n\n");
      
      // Get the user's language
      const userLang = detectUserLanguage();
      
      // Create the extraction prompt
      const extractionPrompt = `
      System: Analyze the following conversation transcript from the Charity Connect app. The user's intent is to ${userIntent === "need_help" ? "request help" : "offer help"}.
      Extract the information needed to create a post.

      The conversation is in language: ${userLang}
      
      Conversation Transcript:
      ${conversation}

      Based ONLY on the conversation above, generate a JSON object with the following fields:
      - "title": A concise, relevant title summarizing the ${userIntent === "need_help" ? "request" : "offer"} (infer this if not explicitly stated, max 80 chars).
      - "description": A VERY DETAILED and SPECIFIC description based on the user's statements. Include ALL relevant details about what exactly ${userIntent === "need_help" ? "is needed" : "is being offered"}.
      - "location": The location mentioned by the user.
      - "contactInfo": The contact information provided by the user.
      - "tags": An array of 1-5 relevant keyword tags based on the description (e.g., ["moving", "elderly", "transportation"]).
      - "type": "${userIntent === "need_help" ? "helpNeeded" : "helpOffered"}"

      VERY IMPORTANT: The post MUST be created in the EXACT SAME LANGUAGE used in the conversation (${userLang}). 
      If the conversation was in Arabic, the title and description must be in Arabic.
      If it was in Spanish, use Spanish, etc. DO NOT translate to English.
      
      VITAL FOR HELP REQUESTS: If the user's description was vague (like "I need guidance" or "I need help"), 
      but they provided more specific details later in the conversation, make sure to INCLUDE ALL THESE SPECIFIC DETAILS 
      in the description. The description should clearly explain EXACTLY what help is needed, leaving no room for confusion.
      
      The post should use clear, simple language while maintaining the original language of the conversation.
      Ensure the meaning is preserved accurately while making the content easy to understand.

      If any of the required fields (description, location, contactInfo) cannot be determined from the conversation, set their value to an empty string (""). If no tags can be determined, use an empty array ([]).

      Return ONLY the JSON object. Do not include any explanatory text before or after the JSON.
      `;
      
      // Generate JSON content
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: extractionPrompt
      });

      let extractedData: PostData | null = null;
      
      try {
        // Extract JSON
        let jsonString = response.text || "{}";
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          extractedData = JSON.parse(jsonMatch[0]) as PostData;
          // Ensure type matches intent
          extractedData.type = userIntent === "need_help" ? "helpNeeded" : "helpOffered";
        } else {
          throw new Error("No JSON object found in response.");
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError, response.text);
        toast.error(t("chat.failedToCreatePost"));
        
        // Provide default structure to allow editing
        extractedData = {
          title: "",
          description: "",
          location: "",
          contactInfo: "",
          tags: [],
          type: userIntent === "need_help" ? "helpNeeded" : "helpOffered",
        };
      }
      
      // Set data and show preview
      setPostData(extractedData);
      setShowPreviewModal(true);
      
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast.error(t("chat.failedToCreatePost"));
    } finally {
      setIsCreatingPost(false);
    }
  };
  
  // Handle submitting the final post
  const handleSubmitPost = async (finalPostData: PostData) => {
    if (!finalPostData) {
      toast.error(t("chat.noPostDataToSubmit"));
      return;
    }
    
    // Validate required fields
    if (!finalPostData.title || !finalPostData.description || !finalPostData.location || !finalPostData.contactInfo) {
      toast.error(t("chat.missingRequiredFields"));
      return;
    }
    
    try {
      setIsCreatingPost(true);
      
      // Submit the post to the API
      await createPost({
        title: finalPostData.title,
        description: finalPostData.description,
        location: finalPostData.location || "",
        contactInfo: finalPostData.contactInfo || "",
        type: finalPostData.type,
        tags: finalPostData.tags || [],
        images: [],
      });
      
      // Reset post data and hide preview
      setPostData(null);
      setShowPreviewModal(false);
      
      // Add success message to chat
      const successMessage: Message = { 
        role: "assistant", 
        content: t("chat.postCreatedSuccess")
      };
      setMessages(prev => [...prev, successMessage]);
      
      toast.success(t("success.postCreated"));
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error(t("chat.failedToSubmitPost"));
    } finally {
      setIsCreatingPost(false);
    }
  };
  
  // Render the chat interface or API key setup
  return (
    <div className="flex flex-col h-full">
      {showConsentDialog ? (
        <ConsentDialog 
          apiKey={apiKey}
          setApiKey={setApiKey}
          hasAcceptedTerms={hasAcceptedTerms}
          setHasAcceptedTerms={setHasAcceptedTerms}
          onSave={handleSaveApiKey}
        />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4">
            {/* Intent selection buttons (only shown at start) */}
            {messages.length > 0 && showIntentButtons && (
              <div className="my-4 flex flex-col space-y-2 items-center">
                <div className="text-center text-gray-600 dark:text-gray-400 mb-2">
                  {t("chat.selectIntent")}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button 
                    onClick={() => handleIntentSelection("need_help")}
                    className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                  >
                    {t("chat.intentNeedHelpButton")}
                  </button>
                  <button
                    onClick={() => handleIntentSelection("offer_help")}
                    className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                  >
                    {t("chat.intentOfferHelpButton")}
                  </button>
                  <button
                    onClick={() => handleIntentSelection("search")}
                    className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    {t("chat.intentSearchButton")}
                  </button>
                  <button
                    onClick={() => handleIntentSelection("settings")}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t("chat.intentSettingsButton")}
                  </button>
                </div>
              </div>
            )}
            
            {/* Message container */}
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                {t("chat.startPrompt")}
              </div>
            ) : (
              messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))
            )}
            
            {/* Loading indicator */}
            {isGenerating && (
              <ChatMessage 
                message={{ 
                  role: "assistant", 
                  content: "...", 
                  isLoading: true 
                }} 
              />
            )}
            
            {/* Review & Create Post button */}
            {(userIntent === "need_help" || userIntent === "offer_help") && messages.length > 2 && (
              <div className="flex justify-center my-4">
                <button
                  onClick={handleReviewAndCreatePost}
                  disabled={isCreatingPost}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isCreatingPost ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t("chat.generatingPreview")}</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 00-1 1v14a1 1 0 001 1h12a1 1 0 001-1V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 009.586 3H4zm4 10a1 1 0 100 2h4a1 1 0 100-2H8zm0-4a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                      </svg>
                      <span>{t("chat.reviewAndCreatePost")}</span>
                    </>
                  )}
                </button>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <ChatInput 
            onSendMessage={handleSendMessage} 
            disabled={isGenerating || isCreatingPost} 
            placeholder={t("chat.inputPlaceholder")}
          />
          
          {/* Post preview */}
          {showPreviewModal && postData && (
            <PostPreview 
              data={postData} 
              onSubmit={handleSubmitPost}
              onCancel={() => {
                setShowPreviewModal(false);
                setPostData(null);
              }}
            />
          )}
          
          {/* API key removal button */}
          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleClearApiKey}
              className="text-xs text-gray-500 hover:text-red-500"
            >
              {t("chat.removeApiKey")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ConsentDialog component (unchanged)
interface ConsentDialogProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  hasAcceptedTerms: boolean;
  setHasAcceptedTerms: (accepted: boolean) => void;
  onSave: () => void;
}

function ConsentDialog({ apiKey, setApiKey, hasAcceptedTerms, setHasAcceptedTerms, onSave }: ConsentDialogProps) {
  const { t } = useTranslation();
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    setApiKey(pastedText);
  };
  
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">{t("chat.apiKeyRequired")}</h2>
      
      <p className="mb-4">{t("chat.apiKeyExplanation")}</p>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4">
        <h3 className="font-semibold mb-2">How to get a Gemini API key:</h3>
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          <li>Go to <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">https://ai.google.dev/</a></li>
          <li>Sign in with your Google account</li>
          <li>Click "Get API key"</li>
          <li>Create a new project or select an existing one</li>
          <li>Copy the API key and paste it below</li>
        </ol>
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          Note: Google provides free quota for Gemini API usage, but you may need to set up billing information.
        </p>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2">{t("chat.enterApiKey")}</label>
        <div className="flex">
          <input
            type={showApiKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onPaste={handlePaste}
            className="flex-1 px-3 py-2 border rounded-l-md"
            placeholder={t("chat.apiKeyPlaceholder")}
          />
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className="px-3 py-2 border border-l-0 rounded-r-md hover:bg-gray-50"
          >
            {showApiKey ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={hasAcceptedTerms}
            onChange={(e) => setHasAcceptedTerms(e.target.checked)}
            className="mr-2"
          />
          <span>{t("chat.acceptTerms")}</span>
        </label>
      </div>
      
      <button
        onClick={onSave}
        disabled={!apiKey || !hasAcceptedTerms}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("chat.saveApiKey")}
      </button>
    </div>
  );
}