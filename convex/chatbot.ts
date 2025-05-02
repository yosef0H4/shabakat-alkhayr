// convex/chatbot.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { internal } from "./_generated/api";
import { getAuth } from "./auth";

// Define the response interface
interface GeminiResponse {
  message: string;
  extractedInfo?: string | null;
  options?: string | null;
}

// Function to process user messages and return AI responses
export const generateGeminiResponse = mutation({
  args: {
    userMessage: v.string(),
    postInfo: v.object({
      post_type: v.union(
        v.literal("helpNeeded"),
        v.literal("helpOffered"),
        v.literal("achievement"),
        v.null()
      ),
      title: v.union(v.string(), v.null()),
      description: v.union(v.string(), v.null()),
      location: v.union(v.string(), v.null()),
      contactInfo: v.union(v.string(), v.null()),
      tags: v.array(v.string()),
      hasImages: v.boolean(),
      images: v.array(v.string()),
    }),
    conversationContext: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Check authentication
    const identity = await getAuth(ctx);
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }
    
    // Get the user from the database
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) =>
        q.eq("email", identity.email || "")
      )
      .first();
    
    if (!user) {
      console.warn("User not found:", identity);
      // Continue without user data
    }
    
    try {
      // Check for API key
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new ConvexError("API key not found");
      }
      
      // Mock response for development
      // In a real implementation, this would use the GoogleGenerativeAI client
      // But for this demo, we'll just return a hardcoded response
      
      // Prepare mock response based on conversation state
      let responseMessage = "I'm here to help you create a post. What would you like to do?";
      let extractedInfo = null;
      let options = null;
      
      // Customize message based on the current post state
      if (args.postInfo.post_type === "helpNeeded") {
        if (!args.postInfo.title) {
          responseMessage = "What would you like to title your help request?";
        } else if (!args.postInfo.description) {
          responseMessage = `Great title: "${args.postInfo.title}". Now, please describe what kind of help you need.`;
        } else if (!args.postInfo.location) {
          responseMessage = "Thanks for the details. Where are you located?";
        } else {
          responseMessage = "Great! You've provided all the essential information. You can now create your help request post.";
                          }
      } else if (args.postInfo.post_type === "helpOffered") {
        if (!args.postInfo.title) {
          responseMessage = "What would you like to title your help offer?";
        } else if (!args.postInfo.description) {
          responseMessage = `Great title: "${args.postInfo.title}". Now, please describe what kind of help you're offering.`;
        } else if (!args.postInfo.location) {
          responseMessage = "Thanks for the details. Where are you located?";
        } else {
          responseMessage = "Great! You've provided all the essential information. You can now create your help offer post.";
        }
      } else {
        // No post type selected yet
        responseMessage = "Would you like to create a help request or offer help to others?";
        options = JSON.stringify([
          { value: "helpNeeded", text: "I need help with something" },
          { value: "helpOffered", text: "I want to offer help" }
        ]);
      }
      
      // Extract information from the user message if applicable
      if (args.userMessage.length > 0) {
        // Very simple extraction logic for demonstration
        if (!args.postInfo.title && args.userMessage.length > 5 && args.userMessage.length < 100) {
          extractedInfo = JSON.stringify({
            ...args.postInfo,
            title: args.userMessage
          });
        } else if (!args.postInfo.description && args.userMessage.length > 10) {
          extractedInfo = JSON.stringify({
            ...args.postInfo,
            description: args.userMessage
          });
        } else if (!args.postInfo.location && args.userMessage.length < 50) {
          extractedInfo = JSON.stringify({
            ...args.postInfo,
            location: args.userMessage
          });
        }
      }
      
      // Set options based on conversation state
      if (args.postInfo.post_type) {
        const missingFields = [];
        if (!args.postInfo.title) missingFields.push("title");
        if (!args.postInfo.description) missingFields.push("description");
        if (!args.postInfo.location) missingFields.push("location");
        
        if (missingFields.length > 0) {
          if (args.postInfo.post_type === "helpNeeded") {
            options = JSON.stringify([
              { value: "needMoreDetails", text: "I need help describing my request" },
              { value: "needLocation", text: "Help me specify my location" },
              { value: "addTags", text: "I want to add tags" }
            ]);
          } else if (args.postInfo.post_type === "helpOffered") {
            options = JSON.stringify([
              { value: "offerMoreDetails", text: "I need help describing my offer" },
              { value: "offerLocation", text: "Help me specify my location" },
              { value: "addTags", text: "I want to add tags" }
            ]);
          }
        }
      }
      
      const result: GeminiResponse = {
        message: responseMessage,
        extractedInfo,
        options
      };
      
      return result;
  } catch (error) {
      console.error("Error generating response:", error);
      throw new ConvexError(`Failed to generate response: ${error}`);
  }
  },
});