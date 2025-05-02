import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface PostData {
  title: string;
  description: string;
  location?: string;
  contactInfo?: string;
  tags?: string[];
  type: "helpNeeded" | "helpOffered";
}

interface PostPreviewProps {
  data: PostData;
  onSubmit: (finalData: PostData) => void;
  onCancel: () => void;
}

export function PostPreview({ data, onSubmit, onCancel }: PostPreviewProps) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(true); // Always start in edit mode
  const [editedData, setEditedData] = useState<PostData>(data);

  // Reset editedData if data changes
  useEffect(() => {
    setEditedData(data);
  }, [data]);

  const handleInputChange = (field: keyof PostData, value: string | string[]) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    handleInputChange("tags", tags);
  };

  const handleSubmit = () => {
    // Use the edited data for submission
    onSubmit(editedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-xl max-h-[90vh] flex flex-col">
        <h2 className="text-xl font-bold mb-4 flex-shrink-0">
          {t("chat.postPreview")}
        </h2>
        
        <div className="space-y-4 overflow-y-auto mb-4 pr-2">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("preview.title")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editedData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${!editedData.title ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="Please provide a title"
            />
            {!editedData.title && <p className="text-xs text-red-500 mt-1">Title is required.</p>}
          </div>
          
          {/* Description Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("preview.description")} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={editedData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={5}
              className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none ${!editedData.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="Please provide a description"
            />
            {!editedData.description && <p className="text-xs text-red-500 mt-1">Description is required.</p>}
          </div>
          
          {/* Location Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("preview.location")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editedData.location || ""}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${!editedData.location ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="Please provide a location"
            />
            {!editedData.location && <p className="text-xs text-red-500 mt-1">Location is required.</p>}
          </div>
          
          {/* Contact Info Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("preview.contactInfo")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editedData.contactInfo || ""}
              onChange={(e) => handleInputChange("contactInfo", e.target.value)}
              className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${!editedData.contactInfo ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="e.g., phone number, email, or how to connect"
            />
            {!editedData.contactInfo && <p className="text-xs text-red-500 mt-1">Contact info is required.</p>}
          </div>
          
          {/* Tags Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("preview.tags")} ({t("preview.optional")})
            </label>
            <input
              type="text"
              value={(editedData.tags || []).join(", ")}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder={t("preview.tagsPlaceholder")}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {/* Optional: Display tags preview below */}
            {(editedData.tags && editedData.tags.length > 0) && (
              <div className="mt-2 flex flex-wrap gap-1">
                {editedData.tags.map((tag, index) => (
                  <span key={index} className="inline-block bg-gray-200 dark:bg-gray-600 rounded-full px-2 py-1 text-xs font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-auto flex-shrink-0 border-t border-gray-200 dark:border-gray-700 pt-4">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
          >
            {t("preview.cancel")}
          </button>
          
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full text-sm font-medium"
          >
            {t("chat.createPost")}
          </button>
        </div>
      </div>
    </div>
  );
}