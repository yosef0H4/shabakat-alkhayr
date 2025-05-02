import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

interface CreatePostFormProps {
  onSuccess?: () => void;
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const { t } = useTranslation();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [type, setType] = useState<"helpNeeded" | "helpOffered" | "achievement">("helpNeeded");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [charactersLeft, setCharactersLeft] = useState(500); // Description char limit
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

  const createPost = useMutation(api.posts.create);
  const generateUploadUrl = useMutation(api.posts.generatePostImageUploadUrl);
  const savePostImage = useMutation(api.posts.savePostImage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createPost({
        title,
        description,
        location,
        contactInfo,
        type,
        tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
        images,
      });

      toast.success(t('success.postCreated'));
      onSuccess?.();

      // Reset form
      setTitle("");
      setDescription("");
      setLocation("");
      setContactInfo("");
      setType("helpNeeded");
      setTags("");
      setImages([]);
    } catch (error) {
      toast.error(t('errors.createPostFailed'));
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = () => {
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
      
      // Step 3: Save the storageId and get back the URL
      const imageUrl = await savePostImage({ storageId });
      
      // Add the new image URL to the images array
      setImages([...images, imageUrl]);
      
      toast.success(t('success.imageUploaded'));
    } catch (error) {
      toast.error(t('errors.uploadFailed'));
      console.error("Error uploading image:", error);
    } finally {
      setIsUploadingImage(false);
      // Clear the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleShowImage = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setDescription(text);
    setCharactersLeft(500 - text.length);
  };

  const toggleMarkdownPreview = () => {
    setShowMarkdownPreview(!showMarkdownPreview);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Post Type Selection */}
      <div className="mb-4 border-b border-gray-200 dark:border-[#38444d] pb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('posts.type')}
        </label>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          <button
            type="button"
            onClick={() => setType("helpNeeded")}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-bold ${
              type === "helpNeeded" 
                ? "bg-primary-500 text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-[#2a343d] dark:text-gray-200 dark:hover:bg-[#38444d]"
            }`}
          >
            {t('nav.helpNeeded')}
          </button>
          <button
            type="button"
            onClick={() => setType("helpOffered")}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-bold ${
              type === "helpOffered" 
                ? "bg-primary-500 text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-[#2a343d] dark:text-gray-200 dark:hover:bg-[#38444d]"
            }`}
          >
            {t('nav.helpOffered')}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-0 bg-transparent border-0 font-bold text-xl focus:outline-none placeholder-gray-400 dark:placeholder-gray-600"
          required
          placeholder={t('posts.title')}
        />
      </div>

      {/* Description with Markdown Support */}
      <div className="mb-4 relative">
        <div className="flex justify-between items-center mb-2">
          
          <button 
            type="button"
            onClick={toggleMarkdownPreview}
            className="text-xs text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {showMarkdownPreview ? "Edit" : "Preview"}
          </button>
        </div>
        
        {showMarkdownPreview ? (
          <div className="min-h-[100px] p-3 bg-white dark:bg-[#253341] border border-gray-200 dark:border-[#38444d] rounded-lg overflow-y-auto prose dark:prose-invert max-w-none prose-sm">
            {description ? (
              <ReactMarkdown>{description}</ReactMarkdown>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 italic">No content to preview</p>
            )}
          </div>
        ) : (
          <>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              className="w-full p-3 bg-white dark:bg-[#253341] border border-gray-200 dark:border-[#38444d] rounded-lg resize-none text-base focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 placeholder-gray-400 dark:placeholder-gray-600 min-h-[100px]"
              rows={4}
              required
              placeholder={
                type === "helpNeeded"
                  ? "Describe what kind of help you need, when you need it, etc."
                  : "Describe what you're offering, any limitations, availability, etc."
              }
              maxLength={500}
            />
            <div className={`absolute bottom-2 right-3 text-xs ${
              charactersLeft < 20 
                ? "text-red-500 dark:text-red-400" 
                : "text-gray-500 dark:text-gray-400"
            }`}>
              {charactersLeft} {t('characters left')}
            </div>
          </>
        )}
        
        
      </div>

      {/* Location */}
      <div className="mb-4 border-t border-gray-200 dark:border-[#38444d] pt-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-0 bg-transparent border-0 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600"
            required
            placeholder={t('posts.location')}
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="mb-4 border-t border-gray-200 dark:border-[#38444d] pt-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="w-full p-0 bg-transparent border-0 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600"
            required
            placeholder={t('posts.contactInfo')}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="mb-4 border-t border-gray-200 dark:border-[#38444d] pt-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-0 bg-transparent border-0 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600"
            placeholder={t('posts.tags')}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 pl-7">Separate tags with commas</p>
      </div>

      {/* Preview of entered tags */}
      {tags && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.split(",").map((tag) => 
            tag.trim() && (
              <span key={tag.trim()} className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-[#2a343d] dark:text-gray-200">
                #{tag.trim()}
              </span>
            )
          )}
        </div>
      )}

      {/* Image uploader */}
      <div className="flex flex-wrap gap-2 items-center mt-4 border-t border-gray-200 dark:border-[#38444d] pt-4">
        <button
          type="button"
          onClick={handleImageUpload}
          className="w-10 h-10 flex items-center justify-center rounded-full text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          disabled={isUploadingImage}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {isUploadingImage && (
          <div className="flex items-center gap-2 text-primary-500">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">{t('posts.uploading')}</span>
          </div>
        )}
        
        {/* Display uploaded images */}
        <div className="flex flex-wrap gap-2 w-full mt-2">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img 
                src={imageUrl} 
                alt={`Upload ${index + 1}`} 
                className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 dark:border-[#38444d]"
                onClick={() => handleShowImage(imageUrl)}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-white dark:bg-[#15202b] rounded-full w-6 h-6 flex items-center justify-center shadow-md text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 border border-gray-200 dark:border-[#38444d]"
                aria-label="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Image preview modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center">
            <button 
              className="absolute top-4 right-4 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-opacity z-10"
              onClick={() => setPreviewImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={previewImage} 
              alt={t('posts.imagePreview')} 
              className="max-h-[80vh] max-w-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-[#38444d] pt-4 mt-4 flex justify-between items-center">
        <div className="flex items-center text-primary-500">
          {images.length > 0 && (
            <div className="flex items-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="ml-1 text-sm">{images.length}</span>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-bold text-sm transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t('posts.creating')}</span>
            </div>
          ) : (
            t('posts.create')
          )}
        </button>
      </div>
    </form>
  );
}