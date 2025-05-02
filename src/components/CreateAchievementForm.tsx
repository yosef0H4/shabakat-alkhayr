import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

interface CreateAchievementFormProps {
  originalPost: {
    _id: Id<"posts">;
    title: string;
    description: string;
    location: string;
    userId: string;
    username: string;
  };
  onSuccess?: () => void;
}

export function CreateAchievementForm({ originalPost, onSuccess }: CreateAchievementFormProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(`Achievement: ${originalPost.title}`);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charactersLeft, setCharactersLeft] = useState(500); // Description char limit
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createAchievement = useMutation(api.posts.create);
  const markAsCompleted = useMutation(api.posts.markAsCompleted);
  const generateUploadUrl = useMutation(api.posts.generatePostImageUploadUrl);
  const savePostImage = useMutation(api.posts.savePostImage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // First mark the original post as completed
      await markAsCompleted({
        postId: originalPost._id
      });
      
      // Then create the achievement post
      await createAchievement({
        title,
        description: `${description}\n\nOriginal request: ${originalPost.description}`,
        location: originalPost.location,
        contactInfo: "",
        type: "achievement" as const,
        tags: ["achievement"],
        images,
        originalPostId: originalPost._id
      });

      toast.success("Achievement created successfully!");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create achievement. Please try again.");
      console.error("Error creating achievement:", error);
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
      
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
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
      {/* Title */}
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-0 bg-transparent border-0 font-bold text-xl focus:outline-none placeholder-gray-400 dark:placeholder-gray-600"
          required
          placeholder="Achievement Title"
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
              placeholder="Describe how you addressed this need..."
              maxLength={500}
            />
            <div className={`absolute bottom-2 right-3 text-xs ${
              charactersLeft < 20 
                ? "text-red-500 dark:text-red-400" 
                : "text-gray-500 dark:text-gray-400"
            }`}>
              {charactersLeft} characters left
            </div>
          </>
        )}
        
        
      </div>

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
            <span className="text-sm">Uploading...</span>
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
              alt="Image preview" 
              className="max-h-[80vh] max-w-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Original Post Info */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-100 dark:border-yellow-800/30 my-4">
        <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Original Post</h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">{originalPost.title}</p>
        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">by {originalPost.username} in {originalPost.location}</p>
        <div className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 prose dark:prose-invert max-w-none prose-sm prose-yellow">
          <ReactMarkdown>{originalPost.description}</ReactMarkdown>
        </div>
      </div>

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
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-sm transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating...</span>
            </div>
          ) : (
            "Create Achievement"
          )}
        </button>
      </div>
    </form>
  );
}