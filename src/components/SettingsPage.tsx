import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useTheme } from "../lib/contexts/ThemeContext";

export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const user = useQuery(api.auth.loggedInUser);
  const updateProfile = useMutation(api.auth.updateProfile);
  const { theme, setTheme } = useTheme();
  
  // State for settings
  const [language, setLanguage] = useState(i18n.language || "en");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize settings from user preferences when loaded
  useEffect(() => {
    if (user?.preferences) {
      if (user.preferences.language) {
        setLanguage(user.preferences.language);
      }
      
      if (user.preferences.notificationsEnabled !== undefined) {
        setNotificationsEnabled(user.preferences.notificationsEnabled);
      }
      
      if (user.preferences.profileVisible !== undefined) {
        setProfileVisible(user.preferences.profileVisible);
      }
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

  const updateSetting = async (updateData: any, successMessage: string) => {
    setIsSaving(true);
    try {
      await updateProfile(updateData);
      toast.success(successMessage);
    } catch (error) {
      toast.error(t('errors.updateProfileFailed'));
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    
    // Set direction for RTL languages (Arabic)
    if (newLanguage === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    }
    
    // Save preference to user profile
    await updateSetting({ language: newLanguage }, t('settings.languageChanged'));
  };
  
  const handleThemeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as "light" | "dark" | "system";
    setTheme(newTheme);
    toast.success(t('settings.themeChanged'));
  };
  
  const handleNotificationsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    setNotificationsEnabled(enabled);
    
    // Save preference to user profile
    await updateSetting(
      { notificationsEnabled: enabled }, 
      enabled ? t('settings.notificationsEnabled') : t('settings.notificationsDisabled')
    );
  };
  
  const handleProfileVisibilityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const visible = e.target.checked;
    setProfileVisible(visible);
    
    // Save preference to user profile
    await updateSetting(
      { profileVisible: visible },
      visible ? t('settings.profileVisible') : t('settings.profileHidden')
    );
  };
  
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="px-4">
        <h1 className="text-xl font-bold py-4 border-b border-gray-200 dark:border-[#38444d]">
          {t('settings.title')}
        </h1>
        
        <div className="divide-y divide-gray-200 dark:divide-[#38444d]">
          {/* Language Settings */}
          <div className="py-4">
            <div className="mb-2">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('settings.language')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('settings.languageDescription')}
              </p>
            </div>
            <div className="mt-3">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-[#38444d] rounded-md bg-white dark:bg-[#253341] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isSaving}
              >
                <option value="en">🇺🇸 English</option>
                <option value="ar">🇸🇦 العربية</option>
              </select>
            </div>
          </div>
          
          {/* Theme Settings */}
          <div className="py-4">
            <div className="mb-2">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('settings.theme')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('settings.themeDescription')}
              </p>
            </div>
            <div className="mt-3">
              <select
                value={theme}
                onChange={handleThemeChange}
                className="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-[#38444d] rounded-md bg-white dark:bg-[#253341] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isSaving}
              >
                <option value="light">{t('settings.lightTheme')}</option>
                <option value="dark">{t('settings.darkTheme')}</option>
                <option value="system">{t('settings.systemTheme')}</option>
              </select>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className="py-4">
            <div className="mb-2">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('settings.notifications')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('settings.notificationsDescription')}
              </p>
            </div>
            <div className="mt-3 flex items-center">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="notifications-toggle" 
                  name="notifications-toggle" 
                  checked={notificationsEnabled}
                  onChange={handleNotificationsChange}
                  disabled={isSaving}
                  className="sr-only"
                />
                <div className="block w-10 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div 
                  className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform ${
                    notificationsEnabled ? 'translate-x-4 bg-primary-500' : 'bg-white'
                  }`}
                ></div>
              </div>
              <label htmlFor="notifications-toggle" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                {t('settings.enableNotifications')}
              </label>
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div className="py-4">
            <div className="mb-2">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('settings.privacy')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('settings.privacyDescription')}
              </p>
            </div>
            <div className="mt-3 flex items-center">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="privacy-toggle" 
                  name="privacy-toggle" 
                  checked={profileVisible}
                  onChange={handleProfileVisibilityChange}
                  disabled={isSaving}
                  className="sr-only"
                />
                <div className="block w-10 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div 
                  className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform ${
                    profileVisible ? 'translate-x-4 bg-primary-500' : 'bg-white'
                  }`}
                ></div>
              </div>
              <label htmlFor="privacy-toggle" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                {t('settings.publicProfile')}
              </label>
            </div>
          </div>
          
          {/* Account Settings */}
          <div className="py-4">
            <div className="mb-2">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('settings.account')}
              </h2>
            </div>
            <div className="space-y-2 mt-3">
              <button
                className="w-full max-w-xs flex items-center justify-between px-4 py-2 text-left border border-gray-300 dark:border-[#38444d] rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a343d] transition-colors"
                onClick={() => toast.info(t('settings.featureComingSoon'))}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  {t('settings.changePassword')}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button
                className="w-full max-w-xs flex items-center justify-between px-4 py-2 text-left border border-gray-300 dark:border-[#38444d] rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a343d] transition-colors"
                onClick={() => toast.info(t('settings.featureComingSoon'))}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                  </svg>
                  {t('settings.exportData')}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button
                className="w-full max-w-xs flex items-center justify-between px-4 py-2 text-left border border-red-300 dark:border-red-800/50 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                onClick={() => toast.error(t('settings.accountDeletionWarning'))}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {t('settings.deleteAccount')}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* About Section */}
          <div className="py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-[#2a343d]">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('settings.version')} 1.0.0
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.copyright')} © {new Date().getFullYear()} Charity Connect
                </p>
              </div>
              <div className="flex gap-2">
                <a 
                  href="#" 
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#38444d] transition-colors"
                  title="Help"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#38444d] transition-colors"
                  title="Code"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}