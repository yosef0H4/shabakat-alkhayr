import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

interface MarkdownGuideProps {
  onClose: () => void;
}

export function MarkdownGuide({ onClose }: MarkdownGuideProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"basics" | "advanced" | "examples">("basics");
  
  // Sample markdown for the preview
  const sampleMarkdown = `# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*

- Bullet point 1
- Bullet point 2
  - Nested bullet point

1. Numbered item 1
2. Numbered item 2

> This is a blockquote

[Link text](https://example.com)

\`\`\`
// Code block
function example() {
  return "Hello world!";
}
\`\`\`

Inline \`code\` example

---

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-[#253341] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-[#38444d]">
          <h2 className="text-xl font-bold">Markdown Guide</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#2a343d] text-gray-500 dark:text-gray-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-[#38444d]">
          <button
            onClick={() => setActiveTab("basics")}
            className={`flex-1 py-2 font-medium text-sm ${
              activeTab === "basics"
                ? "text-primary-500 border-b-2 border-primary-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Basics
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`flex-1 py-2 font-medium text-sm ${
              activeTab === "advanced"
                ? "text-primary-500 border-b-2 border-primary-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Advanced
          </button>
          <button
            onClick={() => setActiveTab("examples")}
            className={`flex-1 py-2 font-medium text-sm ${
              activeTab === "examples"
                ? "text-primary-500 border-b-2 border-primary-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Examples
          </button>
        </div>
        
        <div className="p-4">
          {activeTab === "basics" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Markdown Syntax</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Text Formatting</h4>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-[#2a343d]">
                      <tr>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Syntax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-[#38444d]">
                      <tr>
                        <td className="p-2">Bold</td>
                        <td className="p-2"><code>**Bold Text**</code></td>
                      </tr>
                      <tr>
                        <td className="p-2">Italic</td>
                        <td className="p-2"><code>*Italic Text*</code></td>
                      </tr>
                      <tr>
                        <td className="p-2">Bold & Italic</td>
                        <td className="p-2"><code>***Bold & Italic***</code></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Lists</h4>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-[#2a343d]">
                      <tr>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Syntax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-[#38444d]">
                      <tr>
                        <td className="p-2">Unordered List</td>
                        <td className="p-2">
                          <code>- Item 1</code><br />
                          <code>- Item 2</code>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2">Ordered List</td>
                        <td className="p-2">
                          <code>1. Item 1</code><br />
                          <code>2. Item 2</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Links & Images</h4>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-[#2a343d]">
                      <tr>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Syntax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-[#38444d]">
                      <tr>
                        <td className="p-2">Link</td>
                        <td className="p-2"><code>[Link Text](https://example.com)</code></td>
                      </tr>
                      <tr>
                        <td className="p-2">Image</td>
                        <td className="p-2"><code>![Alt Text](image-url.jpg)</code></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Headings</h4>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-[#2a343d]">
                      <tr>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Syntax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-[#38444d]">
                      <tr>
                        <td className="p-2">Heading 1</td>
                        <td className="p-2"><code># Heading 1</code></td>
                      </tr>
                      <tr>
                        <td className="p-2">Heading 2</td>
                        <td className="p-2"><code>## Heading 2</code></td>
                      </tr>
                      <tr>
                        <td className="p-2">Heading 3</td>
                        <td className="p-2"><code>### Heading 3</code></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "advanced" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Advanced Markdown Features</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Code</h4>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-[#2a343d]">
                      <tr>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Syntax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-[#38444d]">
                      <tr>
                        <td className="p-2">Inline Code</td>
                        <td className="p-2"><code>`code`</code></td>
                      </tr>
                      <tr>
                        <td className="p-2">Code Block</td>
                        <td className="p-2">
                          <pre className="text-xs p-1">```<br/>code block<br/>```</pre>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Blockquotes & Horizontal Rules</h4>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-[#2a343d]">
                      <tr>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Syntax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-[#38444d]">
                      <tr>
                        <td className="p-2">Blockquote</td>
                        <td className="p-2"><code> quoted text</code></td>
                      </tr>
                      <tr>
                        <td className="p-2">Horizontal Rule</td>
                        <td className="p-2"><code>---</code></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Tables</h4>
                  <div className="text-sm">
                    <pre className="bg-gray-50 dark:bg-[#2a343d] p-2 rounded text-xs overflow-x-auto">
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
                    </pre>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Escaping Characters</h4>
                  <p className="text-sm">
                    To display a literal character that would otherwise be used for formatting, use a backslash (\) before the character.
                  </p>
                  <div className="text-sm">
                    <code>\*Not italic\*</code> → *Not italic*
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "examples" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Markdown Example</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Markdown</h4>
                  <pre className="bg-gray-50 dark:bg-[#2a343d] p-3 rounded text-xs overflow-auto max-h-[500px]">
                    {sampleMarkdown}
                  </pre>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Rendered Result</h4>
                  <div className="border border-gray-200 dark:border-[#38444d] rounded-md p-4 overflow-auto max-h-[500px] prose dark:prose-invert max-w-none prose-sm">
                    <ReactMarkdown>{sampleMarkdown}</ReactMarkdown>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Tips for Using Markdown in Posts</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Keep your formatting simple and consistent</li>
                  <li>Use headings to organize longer posts</li>
                  <li>Bold text can highlight important information</li>
                  <li>Lists help to present steps or multiple points clearly</li>
                  <li>Include links rather than pasting long URLs</li>
                  <li>Preview your post before submitting if possible</li>
                </ul>
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-[#38444d] flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-bold transition-colors hover:bg-primary-600"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}