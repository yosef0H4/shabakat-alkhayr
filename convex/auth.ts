import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { MutationCtx, QueryCtx } from "./_generated/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Anonymous],
});

export const loggedInUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return user;
  },
});

export const getIdentity = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    return {
      subject: identity.subject,
      name: identity.name,
      pictureUrl: identity.pictureUrl
    };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    language: v.optional(v.string()),
    theme: v.optional(v.string()),
    notificationsEnabled: v.optional(v.boolean()),
    profileVisible: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Get the user identity to access the subject field (user ID)
    const identity = await ctx.auth.getUserIdentity();
    const userSubject = identity?.subject;
    if (!userSubject) {
      throw new Error("User identity not found");
    }
    
    // Update profile fields
    const updates: Record<string, any> = {};
    
    // If name is being updated, we need to cascade this change
    if (args.name !== undefined && args.name !== user.name) {
      updates.name = args.name;
      
      // Update the username in all user's posts
      const userPosts = await ctx.db
        .query("posts")
        .withIndex("by_user", (q) => q.eq("userId", userSubject))
        .collect();
      
      // Update each post with the new username
      for (const post of userPosts) {
        await ctx.db.patch(post._id, { username: args.name });
      }
      
      // Update the username in all user's replies
      const userReplies = await ctx.db
        .query("replies")
        .filter(q => q.eq(q.field("userId"), userSubject))
        .collect();
      
      // Update each reply with the new username
      for (const reply of userReplies) {
        await ctx.db.patch(reply._id, { username: args.name });
      }
    } else if (args.name !== undefined) {
      updates.name = args.name;
    }
    
    if (args.bio !== undefined) {
      updates.bio = args.bio;
    }
    
    if (args.location !== undefined) {
      updates.location = args.location;
    }
    
    // Update preferences object
    const currentPreferences = user.preferences || {};
    const newPreferences = { ...currentPreferences };
    
    if (args.language !== undefined) {
      newPreferences.language = args.language;
    }
    
    if (args.theme !== undefined) {
      newPreferences.theme = args.theme;
    }
    
    if (args.notificationsEnabled !== undefined) {
      newPreferences.notificationsEnabled = args.notificationsEnabled;
    }
    
    if (args.profileVisible !== undefined) {
      newPreferences.profileVisible = args.profileVisible;
    }
    
    // Only update preferences if there are changes
    if (Object.keys(newPreferences).length > 0) {
      updates.preferences = newPreferences;
    }
    
    // Apply updates if there are any
    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(userId, updates);
    }
    
    return true;
  },
});

// Generate upload URL for profile picture
export const generateProfilePictureUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.storage.generateUploadUrl();
  },
});

// Save profile picture after upload
export const saveProfilePicture = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Get URL for the uploaded image
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("Failed to get URL for uploaded image");
    }
    
    // Update user profile with new image URL
    await ctx.db.patch(userId, {
      image: url
    });
    
    return true;
  },
});

/**
 * Helper function to get the authenticated user identity
 */
export async function getAuth(ctx: QueryCtx | MutationCtx) {
  return await ctx.auth.getUserIdentity();
}