import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { ReplyForm } from "./ReplyForm";
import { CreateAchievementForm } from "./CreateAchievementForm";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useCurrentUser } from "../../lib/hooks/useCurrentUser";
import { format, formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";

interface PostCardProps {
  post: {
    _id: Id<"posts">;
    userId: string;
    username: string;
    userAvatar: string;
    title: string;
    description: string;
    location: string;
    images: string[];
    contactInfo: string;
    type: "helpNeeded" | "helpOffered" | "achievement";
    tags: string[];
    isCompleted: boolean;
    likedByUsers: string[];
    originalPostId?: Id<"posts">;
    _creationTime: number;
  };
}

export function PostCard({ post }: PostCardProps) {
  const { t } = useTranslation();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const replies = useQuery(api.replies.list, { postId: post._id });
  const toggleLike = useMutation(api.posts.toggleLike);
  const deletePost = useMutation(api.posts.deletePost);
  
  // Only query the original post if this post has an originalPostId
  const originalPostArgs = post.originalPostId ? { postId: post.originalPostId } : "skip";
  const originalPost = useQuery(api.posts.getById, originalPostArgs);

  // Get current user information
  const currentUser = useCurrentUser();

  // Check if current user is post author
  const isAuthor = !!currentUser.subjectId && post.userId === currentUser.subjectId;

  // Check if current user has liked the post
  const hasLiked = !!currentUser.user && post.likedByUsers.includes(currentUser.user._id);

  const handleToggleLike = () => {
    toggleLike({ postId: post._id });
  };

  const handleShowAchievementForm = () => {
    setShowAchievementForm(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deletePost({ postId: post._id });
      toast.success(t('success.postDeleted'));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(t('errors.deletePostFailed'));
    } finally {
      setIsDeleting(false);
    }
  };

  // Format the date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show time, otherwise show date
    if (date.toDateString() === now.toDateString()) {
      return format(date, 'h:mm a');
    } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      // Within the last week, show relative time
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      // Older than a week, show the date
      return format(date, 'MMM d, yyyy');
    }
  };

  // Get appropriate status badge
  const getStatusBadge = () => {
    if (post.type === "achievement") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
          {t('posts.achievement')}
        </span>
      );
    } 
    if (post.isCompleted) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          {t('posts.completed')}
        </span>
      );
    }
    if (post.type === "helpNeeded") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
          {t('nav.helpNeeded')}
        </span>
      );
    }
    if (post.type === "helpOffered") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
          {t('nav.helpOffered')}
        </span>
      );
    }
  };

  return (
    <article className="tweet-card">
      <div className="flex gap-3">
        {/* Avatar column */}
        <div className="flex-shrink-0">
          <img
            src={post.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.username)}&background=random`}
            alt={post.username}
            className="avatar-sm"
          />
        </div>
        
        {/* Content column */}
        <div className="flex-1 min-w-0">
          {/* Header: username, timestamp, status badge */}
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span className="tweet-name">{post.username}</span>
            <span className="tweet-timestamp">· {formatDate(post._creationTime)}</span>
            <div className="ml-auto">{getStatusBadge()}</div>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{post.location}</span>
          </div>
          
          {/* Post title */}
          <h2 className="text-base font-bold mb-1 text-gray-900 dark:text-white">{post.title}</h2>
          
          {/* Post description - Now using ReactMarkdown */}
          <div className="mb-3 text-gray-800 dark:text-gray-200 text-sm prose dark:prose-invert max-w-none prose-sm">
            <ReactMarkdown>{post.description}</ReactMarkdown>
          </div>
          
          {/* Show original post reference if this is an achievement */}
          {post.type === "achievement" && post.originalPostId && originalPost && (
            <div className="mb-3 p-3 bg-gray-50 dark:bg-[#2a343d] rounded-xl border border-gray-200 dark:border-[#38444d]">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <span className="font-medium">Based on:</span> {originalPost.title}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                By {originalPost.username} in {originalPost.location}
              </div>
            </div>
          )}
          
          {/* Post images */}
          {post.images.length > 0 && (
            <div className="mb-3 overflow-hidden rounded-xl">
              {post.images.length === 1 ? (
                <img
                  src={post.images[0]}
                  alt="Post"
                  className="w-full max-h-96 object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-xl border border-gray-200 dark:border-[#38444d]"
                  onClick={() => setShowImageModal(post.images[0])}
                />
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  {post.images.slice(0, 4).map((image, index) => (
                    <div key={index} className={`${post.images.length === 3 && index === 0 ? 'col-span-2' : ''}`}>
                      <img
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="w-full aspect-square object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-md border border-gray-200 dark:border-[#38444d]"
                        onClick={() => setShowImageModal(image)}
                      />
                    </div>
                  ))}
                  {post.images.length > 4 && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      +{post.images.length - 4} more
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-[#2a343d] dark:text-gray-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Contact info if available */}
          {post.contactInfo && (
            <div className="mb-3 p-3 bg-gray-50 dark:bg-[#2a343d] rounded-xl border border-gray-200 dark:border-[#38444d]">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">{t('posts.contact')}:</span> {post.contactInfo}
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center gap-8 mt-2 text-gray-500 dark:text-gray-400">
            {/* Like button */}
            <button
              onClick={handleToggleLike}
              className={`tweet-action ${hasLiked ? "text-like" : ""} ${hasLiked ? "like" : ""}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {post.likedByUsers.length > 0 && (
                <span className="tweet-action-count">{post.likedByUsers.length}</span>
              )}
            </button>
            
            {/* Reply button */}
            <button
              onClick={() => {
                setShowReplies(!showReplies);
                if (!showReplies) {
                  setShowReplyForm(false);
                }
              }}
              className="tweet-action reply"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              {replies && replies.length > 0 && (
                <span className="tweet-action-count">{replies.length}</span>
              )}
            </button>
            
            {/* Add Reply button */}
            <button
              onClick={() => {
                setShowReplyForm(!showReplyForm);
                if (!showReplyForm) {
                  setShowReplies(true);
                }
              }}
              className="tweet-action reply"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                 <polyline points="15 14 20 9 15 4"></polyline><path d="M4 20v-7a4 4 0 0 1 4-4h12"></path>
               </svg>
              <span className="tweet-action-count">{t('posts.reply')}</span>
            </button>
            
            {/* Mark as Achievement button - only for the post author */}
            {isAuthor && !post.isCompleted && post.type !== "achievement" && (
              <button
                onClick={handleShowAchievementForm}
                className="tweet-action"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                   <circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"></polyline>
                 </svg>
                <span className="tweet-action-count">{t('posts.markAsAchievement')}</span>
              </button>
            )}
            
            {/* Delete button - only for the post author */}
            {isAuthor && (
              <button
                onClick={handleDeleteClick}
                className="tweet-action ml-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#253341] rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('posts.confirmDelete')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('posts.deleteConfirmMessage')}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#2a343d] rounded-full hover:bg-gray-200 dark:hover:bg-[#38444d] transition-colors"
                disabled={isDeleting}
              >
                {t('filters.cancel')}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('posts.deleting')}
                  </div>
                ) : (
                  t('posts.delete')
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Form Modal */}
      {showAchievementForm && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#253341] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('achievements.createAchievement')}</h2>
              <button
                onClick={() => setShowAchievementForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#2a343d] text-gray-500 dark:text-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <CreateAchievementForm 
              originalPost={post} 
              onSuccess={() => setShowAchievementForm(false)}
            />
          </div>
        </div>
      )}

      {/* Show Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setShowImageModal(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center">
            <button 
              className="absolute top-4 right-4 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-opacity z-10"
              onClick={() => setShowImageModal(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={showImageModal} 
              alt="Preview" 
              className="max-h-[80vh] max-w-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-3 ml-12">
          <ReplyForm 
            postId={post._id}
            onSuccess={() => {
              setShowReplyForm(false);
            }}
          />
        </div>
      )}

      {/* Show Replies */}
      {showReplies && replies && replies.length > 0 && (
        <div className="mt-3 ml-12 space-y-4">
          {replies.map((reply) => (
            <div 
              key={reply._id} 
              className="flex gap-3 py-3 hover:bg-gray-50 dark:hover:bg-[#1e2732]/50 transition-colors rounded-lg"
            >
              <img
                src={reply.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.username)}&background=random`}
                alt={reply.username}
                className="avatar-sm"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="tweet-name">{reply.username}</p>
                  <span className="tweet-timestamp">
                    {formatDistanceToNow(new Date(reply._creationTime), { addSuffix: true })}
                  </span>
                </div>
                {/* Reply text - Now using ReactMarkdown */}
                <div className="mt-1 text-gray-800 dark:text-gray-200 text-sm prose dark:prose-invert max-w-none prose-sm">
                  <ReactMarkdown>{reply.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}