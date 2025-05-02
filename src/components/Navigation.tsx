import { useTranslation } from "react-i18next";

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  const { t } = useTranslation();
  
  return (
    <div className="tab-nav border-b border-gray-200 dark:border-[#38444d]">
      <button
        onClick={() => onNavigate("feed")}
        className={`tab-item ${currentView === "feed" ? "active" : ""}`}
        aria-current={currentView === "feed" ? "page" : undefined}
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className="text-sm">{t('nav.feed')}</span>
        </div>
      </button>
      <button
        onClick={() => onNavigate("chat")}
        className={`tab-item ${currentView === "chat" ? "active" : ""}`}
        aria-current={currentView === "chat" ? "page" : undefined}
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-sm">{t('nav.chat')}</span>
        </div>
      </button>
      <button
        onClick={() => onNavigate("profile")}
        className={`tab-item ${currentView === "profile" ? "active" : ""}`}
        aria-current={currentView === "profile" ? "page" : undefined}
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-sm">{t('nav.profile')}</span>
        </div>
      </button>
      <button
        onClick={() => onNavigate("settings")}
        className={`tab-item ${currentView === "settings" ? "active" : ""}`}
        aria-current={currentView === "settings" ? "page" : undefined}
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-sm">{t('nav.settings')}</span>
        </div>
      </button>
    </div>
  );
}