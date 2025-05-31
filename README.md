
# Charity Connect 🤝

Charity Connect is a full-stack web application designed to connect individuals who need help with those who can offer assistance, and to celebrate successful collaborations as achievements. It features a dynamic feed, user profiles, settings, internationalization (English & Arabic), and an AI-powered chat assistant (using Google Gemini) to help users create posts.

## ✨ Key Features

*   **Post Management:**
    *   Create posts for "Help Needed," "Help Offered."
    *   View posts in a filterable feed (by type, location, tags).
    *   Create "Achievement" posts, often linked to original help requests.
    *   Image uploads for posts.
    *   Markdown support for rich text in post descriptions.
*   **AI Chat Assistant (Google Gemini):**
    *   Guides users to create "Help Needed" or "Help Offered" posts through conversation.
    *   Extracts post details (title, description, location, contact, tags) from chat.
    *   Generates a preview for user review and editing before submission.
    *   Manages Gemini API key securely via local storage.
    *   Responds in the user's detected language (English/Arabic).
*   **User Interaction:**
    *   Like posts.
    *   Reply to posts with Markdown support.
    *   Delete own posts.
*   **User Profiles:**
    *   View and edit profile information (name, bio with Markdown, location).
    *   Upload and change profile pictures.
    *   View user's own posts and achievements.
*   **Internationalization (i18n):**
    *   Full support for English (LTR) and Arabic (RTL).
    *   Dynamic language switching.
*   **Theming:**
    *   Light, Dark, and System-preference themes.
*   **Settings:**
    *   Manage language and theme preferences.
    *   Toggle notification preferences (placeholder).
    *   Toggle profile visibility (placeholder).
*   **Mock Data:**
    *   Import/clear sample Arabic data for demonstration and testing.
*   **Responsive Design:**
    *   Built with Tailwind CSS for adaptability across devices.
*   **Toasts/Notifications:**
    *   User-friendly feedback using Sonner, with Markdown support.

## 🚀 Tech Stack

*   **Frontend:**
    *   React (with TypeScript)
    *   Vite (Build Tool)
    *   Tailwind CSS (Styling)
    *   `react-i18next` (Internationalization)
    *   `react-markdown` (Markdown Rendering)
    *   `sonner` (Toast Notifications)
*   **Backend & Database:**
    *   Convex (Full-stack TypeScript development platform)
*   **AI:**
    *   Google Gemini API (`@google/genai`)

## 📋 Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn
*   A Convex account ([convex.dev](https://convex.dev/))
*   A Google Gemini API Key ([ai.google.dev](https://ai.google.dev/)) - *This is entered by the user in the app's Chat section, not as an environment variable for the app build.*

## ⚙️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Convex:**
    *   Install the Convex CLI if you haven't already:
        ```bash
        npm install -g convex
        ```
    *   Log in to your Convex account:
        ```bash
        npx convex login
        ```
    *   Initialize Convex for this project (if not already done):
        ```bash
        npx convex init
        ```
    *   This will create a `convex.json` file and link your project to a Convex backend.

4.  **Configure Environment Variables:**
    *   Create a `.env.local` file in the root of your project.
    *   Add your Convex deployment URL:
        ```env
        VITE_CONVEX_URL=https://your-deployment-name.convex.cloud
        ```
    *   To enable password and/or anonymous authentication with `@convex-dev/auth`, you'll typically set these in your Convex dashboard environment variables (not in `.env.local` for the Vite client, but in the Convex backend settings):
        *   `CONVEX_AUTH_PASSWORD_ENABLED="true"`
        *   `CONVEX_AUTH_ANONYMOUS_ENABLED="true"`
        (Refer to `@convex-dev/auth` documentation for the most up-to-date setup).

5.  **Deploy Convex Functions & Schema:**
    ```bash
    npx convex deploy
    ```
    Or, to run Convex in development mode with hot-reloading for backend changes:
    ```bash
    npx convex dev
    ```
    This command will also provide you with the `VITE_CONVEX_URL` if you don't have it yet.

## ධ Running the Application

1.  **Start the Convex backend development server (if not already running from setup):**
    ```bash
    npx convex dev
    ```
    Keep this running in a separate terminal.

2.  **Start the Vite frontend development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

3.  Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## 🤖 Using the AI Chat Assistant

The AI Chat Assistant uses the Google Gemini API. To use this feature:
1.  Navigate to the "AI Chat" tab in the application.
2.  You will be prompted to enter your Google Gemini API Key.
3.  Obtain your API key from [Google AI Studio](https://ai.google.dev/).
4.  Paste the key into the input field in the app and save. The key is stored locally in your browser's local storage.


## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details (if one exists, otherwise assume MIT or add one).
