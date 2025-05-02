import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export function SignOutButton() {
  const { t } = useTranslation();
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      // Success is handled by the Auth provider
    } catch (error) {
      console.error("Error signing out:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <button
      className="flex items-center justify-center px-3 py-1.5 rounded-full text-sm font-bold text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
      onClick={handleSignOut}
      disabled={isSigningOut}
    >
      {isSigningOut ? (
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <span>{t('auth.signingOut')}</span>
        </div>
      ) : (
        <span>{t('auth.signOut')}</span>
      )}
    </button>
  );
}