// src/components/MockDataToggle.tsx

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface MockDataToggleProps {
  onImportSuccess?: () => void;
}

export function MockDataToggle({ onImportSuccess }: MockDataToggleProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<"default" | "arabic">("default");
  const importMockData = useMutation(api.mockData.importArabicData);
  const clearMockData = useMutation(api.mockData.clearImportedData);
  const dataStatus = useQuery(api.mockData.getDataStatus);

  const handleImportData = async () => {
    try {
      setIsImporting(true);
      await importMockData();
      toast.success("تم استيراد بيانات النموذج العربي بنجاح");
      setActiveLanguage("arabic");
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (error) {
      console.error("Error importing mock data:", error);
      toast.error("فشل استيراد البيانات. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearData = async () => {
    try {
      setIsImporting(true);
      await clearMockData();
      toast.success("تم مسح البيانات بنجاح");
      setActiveLanguage("default");
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (error) {
      console.error("Error clearing mock data:", error);
      toast.error("فشل مسح البيانات. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#253341] border border-gray-200 dark:border-[#38444d] rounded-xl p-4 mb-4 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">بيانات النموذج العربي</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            استيراد أو مسح بيانات النموذج العربي للتطبيق
          </p>
        </div>
        
        {dataStatus ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                activeLanguage === "arabic" ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
              }`}></div>
              <span className="text-sm font-medium">
                {dataStatus.arabicDataCount > 0 
                  ? `${dataStatus.arabicDataCount} منشور عربي` 
                  : "لا توجد بيانات عربية"}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleImportData}
                disabled={isImporting}
                className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                  activeLanguage === "arabic"
                    ? "bg-gray-100 text-gray-700 dark:bg-[#2a343d] dark:text-gray-300"
                    : "bg-primary-500 text-white hover:bg-primary-600"
                } transition-colors disabled:opacity-50`}
              >
                {isImporting ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري الاستيراد...</span>
                  </div>
                ) : (
                  "استيراد البيانات"
                )}
              </button>
              
              {dataStatus.arabicDataCount > 0 && (
                <button
                  onClick={handleClearData}
                  disabled={isImporting}
                  className="px-3 py-1.5 text-sm font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                >
                  مسح البيانات
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-pulse flex space-x-4">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-transform ${showDetails ? "rotate-90" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {showDetails ? "إخفاء التفاصيل" : "عرض التفاصيل"}
        </button>
        
        {showDetails && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-[#1e2732] rounded-lg text-sm">
            <div className="prose dark:prose-invert max-w-none text-sm">
              <ReactMarkdown>
                {`
### البيانات المستوردة تشمل:

- **طلبات المساعدة**: مساعدة في نقل الأثاث، تركيب مكيفات في المساجد، توزيع سلال غذائية، إصلاح منزلي، إلخ
- **عروض المساعدة**: تعليم كبار السن استخدام التقنية، أعمال النجارة، خياطة، نقل ذوي الاحتياجات الخاصة، دروس مجانية
- **إنجازات**: توثيق قصص نجاح المساعدات المقدمة مع الصور
- **تعليقات**: تفاعل المستخدمين مع المنشورات

### كيفية استخدام البيانات:

1. انقر على "استيراد البيانات" لإضافة البيانات العربية إلى التطبيق
2. استعرض المنشورات وتفاعل معها في صفحة التغذية
3. يمكنك مسح البيانات في أي وقت بالنقر على "مسح البيانات"

البيانات محفوظة في قاعدة بيانات Convex الخاصة بتطبيقك، ويمكنك تعديلها أو إضافة المزيد من البيانات.
                `}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}