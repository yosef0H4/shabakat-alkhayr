import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { PostCard } from "./PostCard";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export function ProfilePage() {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // posts, achievements, or likes
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  
  // Fetch current user profile
  const user = useQuery(api.auth.loggedInUser);
  
  // Fetch user's posts
  const userPosts = useQuery(api.posts.listByUser);
  
  // Get mutations for updating profile and uploading profile picture
  const updateProfile = useMutation(api.auth.updateProfile);
  const generateUploadUrl = useMutation(api.auth.generateProfilePictureUploadUrl);
  const saveProfilePicture = useMutation(api.auth.saveProfilePicture);
  
  // State for editable fields
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  
  // Update state when user data is loaded
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setLocation(user.location || "");
    }
  }, [user]);
  
  // Loading state
  if (!user) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        name,
        bio,
        location,
      });
      
      setIsEditing(false);
      toast.success(t('profile.profileUpdated'));
    } catch (error) {
      toast.error(t('errors.updateProfileFailed'));
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      
      // Step 1: Generate a signed upload URL
      const postUrl = await generateUploadUrl();
      
      // Step 2: Upload the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error("Failed to upload image");
      }
      
      const { storageId } = await result.json();
      
      // Step 3: Save the storageId to update the user's profile picture
      await saveProfilePicture({ storageId });
      
      toast.success(t('profile.photoUpdated'));
    } catch (error) {
      toast.error(t('errors.uploadFailed'));
      console.error("Error uploading profile picture:", error);
    } finally {
      setIsUploadingImage(false);
      // Clear the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleMarkdownPreview = () => {
    setShowMarkdownPreview(!showMarkdownPreview);
  };

  // Filter posts by type for tab navigation
  const achievements = userPosts?.filter(post => post.type === "achievement") || [];
  const helpPosts = userPosts?.filter(post => 
    post.type === "helpNeeded" || post.type === "helpOffered"
  ) || [];
  
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Profile header */}
      <div className="relative">
        {/* Banner/cover photo - Twitter style */}
        <div className="h-32 md:h-48 bg-primary-100 dark:bg-primary-900/30"></div>
        
        {/* Profile info with avatar */}
        <div className="px-4">
          {/* Avatar */}
          <div className="relative mt-[-48px] mb-3">
            <div 
              className={`w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-[#15202b] bg-white dark:bg-[#15202b] shadow-md ${!isUploadingImage && 'cursor-pointer hover:opacity-90'}`}
              onClick={!isUploadingImage ? handleProfilePictureClick : undefined}
            >
              {isUploadingImage ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                  <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <img 
                  src={user.image || `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(user.name || "Anonymous User")}&size=250`} 
                  alt={user.name || "User"} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div 
              className={`absolute bottom-1 right-1 bg-white dark:bg-[#15202b] border border-gray-200 dark:border-[#38444d] p-1.5 rounded-full shadow-md cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2a343d] transition-colors ${isUploadingImage && 'opacity-50 cursor-not-allowed'}`}
              onClick={!isUploadingImage ? handleProfilePictureClick : undefined}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
              disabled={isUploadingImage}
            />
          </div>
          
          {/* Profile actions */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${
                isEditing
                  ? "bg-primary-500 text-white border-primary-500 hover:bg-primary-600"
                  : "bg-transparent text-gray-800 dark:text-white border-gray-300 dark:border-[#38444d] hover:bg-gray-100 dark:hover:bg-[#2a343d]"
              }`}
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('profile.saving')}</span>
                </div>
              ) : (
                isEditing ? t('profile.save') : t('profile.edit')
              )}
            </button>
          </div>
          
          {/* Profile info */}
          <div className="mb-6">
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xl font-bold mb-1 w-full bg-transparent border-b border-gray-300 dark:border-[#38444d] focus:border-primary-500 dark:focus:border-primary-500 outline-none pb-1"
                placeholder="Display name"
              />
            ) : (
              <h1 className="text-xl font-bold mb-1">
                {user.name || t('profile.anonymousUser')}
              </h1>
            )}
            
            <div className="text-gray-500 dark:text-gray-400 mb-3 text-sm">
              <div className="flex items-center gap-1 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{t('profile.joinedOn', { date: formatDate(user._creationTime) })}</span>
              </div>
              
              {user.email && (
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>{user.email}</span>
                </div>
              )}
            </div>
            
            {/* Bio with Markdown Support */}
            <div className="mb-3">
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    
                    <button 
                      type="button"
                      onClick={toggleMarkdownPreview}
                      className="text-xs text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      {showMarkdownPreview ? "Edit" : "Preview"}
                    </button>
                  </div>
                  
                  {showMarkdownPreview ? (
                    <div className="min-h-[100px] p-3 bg-white dark:bg-[#253341] border border-gray-300 dark:border-[#38444d] rounded-lg overflow-y-auto prose dark:prose-invert max-w-none prose-sm">
                      {bio ? (
                        <ReactMarkdown>{bio}</ReactMarkdown>
                      ) : (
                        <p className="text-gray-400 dark:text-gray-500 italic">No content to preview</p>
                      )}
                    </div>
                  ) : (
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full bg-white dark:bg-[#253341] border border-gray-300 dark:border-[#38444d] rounded-lg p-3 text-gray-800 dark:text-white focus:border-primary-500 dark:focus:border-primary-500 outline-none resize-none"
                      placeholder={t('profile.bioPlaceholder')}
                    />
                  )}
                  
                  
                </div>
              ) : (
                <div className="text-gray-800 dark:text-white prose dark:prose-invert max-w-none prose-sm">
                  {user.bio ? (
                    <ReactMarkdown>{user.bio}</ReactMarkdown>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">{t('profile.noBio')}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Location */}
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              {isEditing ? (
                <div className="flex w-full items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 bg-transparent border-b border-gray-300 dark:border-[#38444d] focus:border-primary-500 dark:focus:border-primary-500 outline-none pb-1"
                    placeholder={t('profile.locationPlaceholder')}
                  />
                </div>
              ) : user.location ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{user.location}</span>
                </>
              ) : (
                <span>{t('profile.noLocation')}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="tab-nav border-b border-gray-200 dark:border-[#38444d]">
        <button
          className={`tab-item ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          {t('profile.userPosts')}
        </button>
        <button
          className={`tab-item ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          {t('profile.achievements')}
        </button>
      </div>
      
      {/* Content based on active tab */}
      <div className="divide-y divide-gray-200 dark:divide-[#38444d]">
        {activeTab === 'posts' && (
          <>
            {helpPosts.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <div className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">{t('profile.noPosts')}</p>
              </div>
            ) : (
              helpPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            )}
          </>
        )}
        
        {activeTab === 'achievements' && (
          <>
            {achievements.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <div className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">{t('profile.noAchievements')}</p>
              </div>
            ) : (
              achievements.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}