import { Authenticated, Unauthenticated } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster, toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { PostList } from "./components/PostList";
import { CreatePostForm } from "./components/CreatePostForm";
import { FilterDialog } from "./components/FilterDialog";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Navigation } from "./components/Navigation";
import { ProfilePage } from "./components/ProfilePage";
import { SettingsPage } from "./components/SettingsPage";
import { ChatPage } from "./components/ChatPage";
import { MockDataToggle } from "./components/MockDataToggle";
import "./styles/toast.css";

export default function App() {
  const { t } = useTranslation();
  
  // State for post filtering and creation
  const [postType, setPostType] = useState<"helpNeeded" | "helpOffered" | "achievement">("helpNeeded");
  const [locationFilter, setLocationFilter] = useState("");
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  
  // Navigation state
  const [currentView, setCurrentView] = useState("feed");

  const handleApplyFilters = (location: string, tags: string[]) => {
    setLocationFilter(location);
    setTagFilters(tags);
  };

  // Render the appropriate view based on currentView state
  const renderView = () => {
    switch (currentView) {
      case "profile":
        return <ProfilePage />;
      case "settings":
        return (
          <>
            <div className="mb-4">
              <MockDataToggle onImportSuccess={() => {
                toast.success("تم تحديث البيانات");
              }} />
            </div>
            <SettingsPage />
          </>
        );
      case "chat":
        return <ChatPage />;
      case "feed":
      default:
        return (
          <div className="flex flex-col">
            <div className="sticky top-12 z-10 bg-white dark:bg-[#15202b] pt-2 pb-2 border-b border-gray-100 dark:border-[#38444d]">
              <div className="flex justify-between items-center px-4">
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                  <button
                    onClick={() => setPostType("helpNeeded")}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                      postType === "helpNeeded" 
                        ? "bg-primary-500 text-white" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-[#2a343d] dark:text-gray-200 dark:hover:bg-[#38444d]"
                    }`}
                  >
                    {t('nav.helpNeeded')}
                  </button>
                  <button
                    onClick={() => setPostType("helpOffered")}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                      postType === "helpOffered" 
                        ? "bg-primary-500 text-white" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-[#2a343d] dark:text-gray-200 dark:hover:bg-[#38444d]"
                    }`}
                  >
                    {t('nav.helpOffered')}
                  </button>
                  <button
                    onClick={() => setPostType("achievement")}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                      postType === "achievement" 
                        ? "bg-primary-500 text-white" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-[#2a343d] dark:text-gray-200 dark:hover:bg-[#38444d]"
                    }`}
                  >
                    {t('nav.achievements')}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilterDialog(true)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
                      locationFilter || tagFilters.length > 0 
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#2a343d] dark:text-gray-200 dark:hover:bg-[#38444d]"
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                    <span>{t('posts.filter')}</span>
                    {(locationFilter || tagFilters.length > 0) && (
                      <span className="ml-1 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {(locationFilter ? 1 : 0) + (tagFilters.length > 0 ? 1 : 0)}
                      </span>
                    )}
                  </button>
                  {postType !== "achievement" && (
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="bg-primary-500 hover:bg-primary-600 text-white flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      {t('posts.createPost')}
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Active filters display */}
            {(locationFilter || tagFilters.length > 0) && (
              <div className="flex flex-wrap gap-2 items-center mx-4 my-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400 mr-1">
                  {t('filters.activeFilters')}:
                </span>
                {locationFilter && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-[#253341] rounded-full text-sm text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/50">
                    <span>{locationFilter}</span>
                    <button
                      onClick={() => setLocationFilter("")}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 ml-1"
                      aria-label="Remove location filter"
                    >
                      ×
                    </button>
                  </div>
                )}
                {tagFilters.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-[#253341] rounded-full text-sm text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/50"
                  >
                    <span>#{tag}</span>
                    <button
                      onClick={() => setTagFilters(tagFilters.filter(t => t !== tag))}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 ml-1"
                      aria-label={`Remove tag ${tag}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setLocationFilter("");
                    setTagFilters([]);
                  }}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline ml-auto"
                >
                  {t('filters.clearAll')}
                </button>
              </div>
            )}

            <PostList
              type={postType}
              locationFilter={locationFilter}
              tagFilters={tagFilters}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#15202b] text-gray-900 dark:text-white" dir="auto">
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#15202b]/90 backdrop-blur-md border-b border-gray-200 dark:border-[#38444d]">
        <div className="flex justify-between items-center h-12 px-4">
          <h2 className="text-xl font-bold text-primary-500">
            {t('app.title')}
          </h2>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <SignOutButton />
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col">
        <div className="w-full">
          <Authenticated>
            <Navigation 
              currentView={currentView} 
              onNavigate={setCurrentView} 
            />
            <div className="w-full md:max-w-2xl md:mx-auto">
              {renderView()}
            </div>
          </Authenticated>
          <Unauthenticated>
            <div className="max-w-md mx-auto p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2 text-primary-500">
                  {t('app.title')}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">{t('app.signIn')}</p>
              </div>
              <div className="bg-white dark:bg-[#253341] border border-gray-200 dark:border-[#38444d] p-6 rounded-2xl shadow-sm">
                <SignInForm />
              </div>
            </div>
          </Unauthenticated>
        </div>
      </main>
      
      {/* Modal Dialogs */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#253341] rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-[#38444d]">
              <h2 className="text-xl font-bold">{t('posts.createNewPost')}</h2>
              <button
                onClick={() => setShowCreatePost(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#2a343d] text-gray-500 dark:text-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <CreatePostForm onSuccess={() => setShowCreatePost(false)} />
            </div>
          </div>
        </div>
      )}
      
      {/* Filter Dialog */}
      <FilterDialog 
        open={showFilterDialog}
        onClose={() => setShowFilterDialog(false)}
        onApply={handleApplyFilters}
        currentLocation={locationFilter}
        currentTags={tagFilters}
      />
      
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'white',
            color: '#374151',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
          },
          className: "dark:bg-[#253341] dark:text-gray-100 dark:border-[#38444d] prose dark:prose-invert max-w-none prose-sm markdown-toast",
          classNames: {
            success: 'border-l-4 border-green-500',
            error: 'border-l-4 border-red-500'
          }
        }}
      />
    </div>
  );
}