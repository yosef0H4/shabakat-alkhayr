import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("replies")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
  },
});

export const create = mutation({
  args: {
    postId: v.id("posts"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user from the database using getAuthUserId
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }
    
    const user = await ctx.db.get(userId);
    
    // Get the profile image, with fallbacks
    let userAvatar = identity.pictureUrl || "https://eu.ui-avatars.com/api/?name=John+Doe&size=250";
    if (user && user.image) {
      userAvatar = user.image;
    }

    return await ctx.db.insert("replies", {
      postId: args.postId,
      userId: identity.subject,
      username: identity.name ?? "Anonymous",
      userAvatar,
      text: args.text,
    });
  },
});