import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// Application tables
const applicationTables = {
  posts: defineTable({
    userId: v.string(),
    username: v.string(),
    userAvatar: v.string(),
    title: v.string(),
    description: v.string(),
    location: v.string(),
    images: v.array(v.string()),
    contactInfo: v.string(),
    type: v.union(v.literal("helpNeeded"), v.literal("helpOffered"), v.literal("achievement")),
    tags: v.array(v.string()),
    originalPostId: v.optional(v.id("posts")),
    isCompleted: v.boolean(),
    likedByUsers: v.array(v.string()),
  })
    .index("by_type", ["type"])
    .index("by_location", ["location"])
    .index("by_user", ["userId"])
    .index("by_tags", ["tags"]),

  replies: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
    username: v.string(),
    userAvatar: v.string(),
    text: v.string(),
  }).index("by_post", ["postId"]),
};

// Define the schema
export default defineSchema({
  // Include auth tables with the standard fields
  ...authTables,
  
  // Extend the users table with custom fields
  // This replaces the entire users table definition while keeping the required fields
  users: defineTable({
    // Standard auth fields required by Convex Auth
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    
    // Custom profile fields
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    preferences: v.optional(v.object({
      language: v.optional(v.string()),
      theme: v.optional(v.string()),
      notificationsEnabled: v.optional(v.boolean()),
      profileVisible: v.optional(v.boolean()),
    })),
  }).index("by_email", ["email"]),
  
  // Include application tables
  ...applicationTables,
});