import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-xl",
  showCloseButton = true,
  closeOnClickOutside = true,
  footer,
}) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in" 
      onClick={closeOnClickOutside ? onClose : undefined}
    >
      <div 
        ref={modalRef}
        className={`bg-white dark:bg-[#253341] rounded-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto shadow-xl animate-slide-up`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-[#38444d]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#2a343d] text-gray-500 dark:text-gray-400"
              aria-label={t('common.close')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="p-4">
          {children}
        </div>
        
        {footer && (
          <div className="p-4 border-t border-gray-200 dark:border-[#38444d]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}; 