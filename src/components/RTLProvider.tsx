import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface RTLProviderProps {
  children: ReactNode;
}

export function RTLProvider({ children }: RTLProviderProps) {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    // Set direction based on current language
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
    
    // Add RTL class for styling purposes
    if (dir === "rtl") {
      document.body.classList.add("rtl");
    } else {
      document.body.classList.remove("rtl");
    }
    
    return () => {
      // Cleanup
      document.body.classList.remove("rtl");
    };
  }, [i18n.language]);
  
  return <>{children}</>;
}