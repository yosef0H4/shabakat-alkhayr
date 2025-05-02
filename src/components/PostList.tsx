import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PostCard } from "./PostCard";
import { useTranslation } from "react-i18next";

interface PostListProps {
  type: "helpNeeded" | "helpOffered" | "achievement";
  locationFilter?: string;
  tagFilters?: string[];
}

export function PostList({ type, locationFilter, tagFilters }: PostListProps) {
  const { t } = useTranslation();
  const posts = useQuery(api.posts.list, { 
    type,
    locationFilter: locationFilter || undefined,
    tagFilters: tagFilters?.length ? tagFilters : undefined,
  });

  // Loading state
  if (!posts) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">{t('posts.loading')}</p>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="bg-white dark:bg-[#253341] rounded-xl p-8 m-4 text-center border border-gray-200 dark:border-[#38444d]">
        <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-[#2a343d] rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-gray-600">
          {type === "helpNeeded" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          )}
          {type === "helpOffered" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
               <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          )}
          {type === "achievement" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          )}
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          {t('posts.noPostsAvailable')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {type === "helpNeeded" && 
            "There are currently no help requests matching your criteria. Try adjusting your filters or check back later."}
          {type === "helpOffered" && 
            "There are currently no help offers matching your criteria. Try adjusting your filters or check back later."}
          {type === "achievement" && 
            "There are currently no achievements to display. As community members help each other, achievements will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col divide-y divide-gray-100 dark:divide-[#38444d]">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}