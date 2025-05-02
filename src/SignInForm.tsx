import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function SignInForm() {
  const { t } = useTranslation();
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
    formData.set("flow", flow);
    
    try {
      await signIn("password", formData);
      // Success is handled by the Auth provider
    } catch (error) {
      const toastTitle =
        flow === "signIn"
          ? t('errors.signInFailed')
          : t('errors.signUpFailed');
      toast.error(toastTitle);
      setSubmitting(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setSubmitting(true);
    try {
      await signIn("anonymous");
      // Success is handled by the Auth provider
    } catch (error) {
      toast.error(t('errors.signInFailed'));
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      <form
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('auth.email')}
          </label>
          <div className="relative">
            <input
              id="email"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#253341] border border-gray-200 dark:border-[#38444d] rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 dark:text-white"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={submitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('auth.password')}
          </label>
          <div className="relative">
            <input
              id="password"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#253341] border border-gray-200 dark:border-[#38444d] rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 dark:text-white"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={submitting}
            />
          </div>
        </div>

        <button 
          className="w-full mt-2 py-2.5 px-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          type="submit" 
          disabled={submitting}
        >
          {submitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{flow === "signIn" ? "Signing in..." : "Signing up..."}</span>
            </div>
          ) : (
            flow === "signIn" ? t('auth.signIn') : t('auth.signUp')
          )}
        </button>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <span>
            {flow === "signIn"
              ? t('auth.dontHaveAccount')
              : t('auth.alreadyHaveAccount')}
          </span>
          <button
            type="button"
            className="ml-1 text-primary-500 hover:text-primary-600 focus:outline-none focus:underline dark:text-primary-400 dark:hover:text-primary-300"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            disabled={submitting}
          >
            {flow === "signIn" ? t('auth.signUpInstead') : t('auth.signInInstead')}
          </button>
        </div>
      </form>

      <div className="flex items-center">
        <div className="flex-grow h-px bg-gray-200 dark:bg-[#38444d]"></div>
        <span className="px-3 text-sm text-gray-500 dark:text-gray-400">{t('auth.or')}</span>
        <div className="flex-grow h-px bg-gray-200 dark:bg-[#38444d]"></div>
      </div>

      <button 
        className="w-full py-2.5 px-4 flex items-center justify-center gap-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-bold rounded-full transition-colors"
        onClick={handleAnonymousSignIn}
        disabled={submitting}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
        </svg>
        {t('app.signInAnonymously')}
      </button>
    </div>
  );
}