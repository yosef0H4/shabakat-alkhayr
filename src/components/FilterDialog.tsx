import { useState, useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useTranslation } from "react-i18next";
import { Modal } from "./common/Modal";

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (location: string, tags: string[]) => void;
  currentLocation: string;
  currentTags: string[];
}

export function FilterDialog({
  open,
  onClose,
  onApply,
  currentLocation,
  currentTags,
}: FilterDialogProps) {
  const { t } = useTranslation();
  const [location, setLocation] = useState(currentLocation);
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(currentTags);
  
  // Reset values when the dialog opens with new props
  useEffect(() => {
    if (open) {
      setLocation(currentLocation);
      setSelectedTags(currentTags);
    }
  }, [open, currentLocation, currentTags]);

  // Get all unique tags from posts for suggestions
  const allPosts = useQuery(api.posts.listAll);
  const allTags = allPosts
    ? [...new Set(allPosts.flatMap((post) => post.tags))].sort()
    : [];

  // Use useMemo instead of useEffect + setState for filtered suggestions
  const filteredSuggestions = useMemo(() => {
    if (tagInput.trim()) {
      const filtered = allTags.filter(
        tag => 
          tag.toLowerCase().includes(tagInput.toLowerCase()) && 
          !selectedTags.includes(tag)
      );
      return filtered.slice(0, 5); // Show only top 5 matches
    } 
    return [];
  }, [tagInput, allTags, selectedTags]);

  const handleAddTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleAddSuggestedTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(location, selectedTags);
    onClose();
  };

  const handleReset = () => {
    setLocation("");
    setSelectedTags([]);
    setTagInput("");
  };

  // Get unique locations from all posts
  const allLocations = allPosts
    ? [...new Set(allPosts.map(post => post.location))].sort()
    : [];

  // Filter locations based on input using computed value instead of state
  const filteredLocations = location.trim() 
    ? allLocations.filter(loc => 
        loc.toLowerCase().includes(location.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={t('filters.filterPosts')}
      footer={
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#2a343d] hover:bg-gray-200 dark:hover:bg-[#344552] rounded-full transition-colors"
          >
            {t('filters.reset')}
          </button>
          <div className="space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#2a343d] hover:bg-gray-200 dark:hover:bg-[#344552] rounded-full transition-colors"
            >
              {t('filters.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-full transition-colors"
            >
              {t('filters.apply')}
            </button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('filters.location')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-input block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-[#253341] border border-gray-300 dark:border-[#38444d] rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:text-white"
              placeholder={t('filters.filterByLocation')}
              autoComplete="off"
            />
          </div>
          
          {/* Location suggestions */}
          {filteredLocations.length > 0 && (
            <div className="mt-1 bg-white dark:bg-[#253341] rounded-md shadow-lg border border-gray-200 dark:border-[#38444d] max-h-48 overflow-y-auto z-10">
              {filteredLocations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-[#2a343d] text-gray-700 dark:text-gray-200 focus:outline-none transition-colors"
                  onClick={() => setLocation(loc)}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tags filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('posts.tags')}
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="form-input block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-[#253341] border border-gray-300 dark:border-[#38444d] rounded-l-lg dark:text-white"
                placeholder={t('filters.addTag')}
                autoComplete="off"
              />
            </div>
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-r-lg transition-colors"
            >
              {t('filters.addTag')}
            </button>
          </div>
          
          {/* Tag suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="mt-1 bg-white dark:bg-[#253341] rounded-md shadow-lg border border-gray-200 dark:border-[#38444d] max-h-48 overflow-y-auto z-10">
              {filteredSuggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-[#2a343d] text-gray-700 dark:text-gray-200 focus:outline-none transition-colors"
                  onClick={() => handleAddSuggestedTag(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
          
          {/* Popular tags */}
          {!tagInput && allTags.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Popular tags:</p>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 10).map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddSuggestedTag(tag)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors
                      ${selectedTags.includes(tag) 
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#2a343d] dark:text-gray-300 dark:hover:bg-[#344552]'
                      }`}
                    disabled={selectedTags.includes(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Selected tags */}
          {selectedTags.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Selected tags:</p>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 rounded-full text-sm text-primary-600 dark:text-primary-400"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-primary-200 dark:hover:bg-primary-800"
                      aria-label={`Remove ${tag} tag`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}