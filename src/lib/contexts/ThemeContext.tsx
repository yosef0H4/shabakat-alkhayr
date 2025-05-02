import React, { createContext, useContext, useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const updateProfile = useMutation(api.auth.updateProfile);

  // Effect to initialize theme from user preferences or localStorage
  useEffect(() => {
    // First try to get from localStorage (for persistence across sessions)
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      // Default to system
      setThemeState("system");
    }
  }, []);

  // Effect to apply theme changes
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("theme", theme);
    
    // Apply theme to HTML element
    const html = document.documentElement;
    
    if (theme === "system") {
      // Check system preference
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(systemPrefersDark);
      
      if (systemPrefersDark) {
        html.classList.add("dark");
        html.classList.remove("light");
        html.classList.add("theme--dark");
        html.classList.remove("theme--light");
      } else {
        html.classList.remove("dark");
        html.classList.add("light");
        html.classList.remove("theme--dark");
        html.classList.add("theme--light");
      }
    } else if (theme === "dark") {
      html.classList.add("dark");
      html.classList.remove("light");
      html.classList.add("theme--dark");
      html.classList.remove("theme--light");
      setIsDarkMode(true);
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
      html.classList.remove("theme--dark");
      html.classList.add("theme--light");
      setIsDarkMode(false);
    }
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        setIsDarkMode(mediaQuery.matches);
        
        const html = document.documentElement;
        if (mediaQuery.matches) {
          html.classList.add("dark");
          html.classList.remove("light");
          html.classList.add("theme--dark");
          html.classList.remove("theme--light");
        } else {
          html.classList.remove("dark");
          html.classList.add("light");
          html.classList.remove("theme--dark");
          html.classList.add("theme--light");
        }
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Function to set theme and save to user profile
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    
    try {
      // Also save to user profile in database if authenticated
      await updateProfile({
        theme: newTheme
      });
    } catch (error) {
      console.error("Failed to save theme to user profile:", error);
      // Continue anyway as it's saved to localStorage
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}; 