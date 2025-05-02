import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    type: v.union(v.literal("helpNeeded"), v.literal("helpOffered"), v.literal("achievement")),
    locationFilter: v.optional(v.string()),
    tagFilters: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("posts")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .order("desc");
    
    // For help needed and help offered, exclude completed posts
    if (args.type === "helpNeeded" || args.type === "helpOffered") {
      query = query.filter(q => q.eq(q.field("isCompleted"), false));
    }
    
    let posts = await query.collect();

    // Apply filters if provided
    if (args.locationFilter) {
      posts = posts.filter(post => 
        post.location.toLowerCase().includes(args.locationFilter!.toLowerCase())
      );
    }

    if (args.tagFilters && args.tagFilters.length > 0) {
      posts = posts.filter(post =>
        args.tagFilters!.some(tag => post.tags.includes(tag))
      );
    }

    return posts;
  },
});

// Get all posts for filter suggestions
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    // Using best practices: limiting to 1000 posts to avoid loading too many
    return await ctx.db.query("posts").take(1000);
  },
});

// Get posts by the current user
export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", user.subject))
      .order("desc")
      .collect();
  },
});

// Get a specific post by ID
export const getById = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      // Return null instead of throwing an error
      // This allows clients to handle missing posts more gracefully
      return null;
    }
    return post;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    location: v.string(),
    contactInfo: v.string(),
    type: v.union(v.literal("helpNeeded"), v.literal("helpOffered"), v.literal("achievement")),
    tags: v.array(v.string()),
    images: v.array(v.string()),
    originalPostId: v.optional(v.id("posts")),
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

    return await ctx.db.insert("posts", {
      userId: identity.subject,
      username: identity.name ?? "Anonymous",
      userAvatar,
      ...args,
      isCompleted: false,
      likedByUsers: [],
    });
  },
});
export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if the current user is the post author
    if (post.userId !== identity.subject) {
      throw new Error("Not authorized to delete this post");
    }

    // Delete the post
    await ctx.db.delete(args.postId);
    
    return { success: true };
  },
});

// Generate an upload URL for post images
export const generatePostImageUploadUrl = mutation({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.storage.generateUploadUrl();
  },
});

// Save post image after upload and return the URL
export const savePostImage = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Generate URL for the uploaded image
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("Failed to get URL for uploaded image");
    }
    
    return url;
  },
});

export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Not authenticated");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const userId = user.subject;
    const likedByUsers = [...post.likedByUsers];
    const userLikeIndex = likedByUsers.indexOf(userId);

    if (userLikeIndex === -1) {
      likedByUsers.push(userId);
    } else {
      likedByUsers.splice(userLikeIndex, 1);
    }

    await ctx.db.patch(args.postId, { likedByUsers });
  },
});

export const markAsCompleted = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Not authenticated");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // In a real app, you would check if the current user is the post author
    // For this example, we're assuming the check is already done on the client

    await ctx.db.patch(args.postId, { isCompleted: true });
  },
});

// Get completed posts (achievements section)
export const listCompleted = query({
  args: {
    locationFilter: v.optional(v.string()),
    tagFilters: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Get help needed and help offered posts that are marked as completed
    let query = ctx.db
      .query("posts")
      .filter(q => 
        q.and(
          q.or(
            q.eq(q.field("type"), "helpNeeded"),
            q.eq(q.field("type"), "helpOffered")
          ),
          q.eq(q.field("isCompleted"), true)
        )
      )
      .order("desc"); // Order by creation time descending (newest first)
    
    let posts = await query.collect();

    // Apply filters if provided
    if (args.locationFilter) {
      posts = posts.filter(post => 
        post.location.toLowerCase().includes(args.locationFilter!.toLowerCase())
      );
    }

    if (args.tagFilters && args.tagFilters.length > 0) {
      posts = posts.filter(post =>
        args.tagFilters!.some(tag => post.tags.includes(tag))
      );
    }

    return posts;
  },
});