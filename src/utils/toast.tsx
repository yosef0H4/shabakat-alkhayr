import { toast as sonnerToast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import React from 'react';

type ToastOptions = Parameters<typeof sonnerToast>[1];

const MarkdownMessage = ({ children }: { children: string }) => (
  <div className="markdown-content">
    <ReactMarkdown>{children}</ReactMarkdown>
  </div>
);

export const toast = (message: string, options?: ToastOptions) => {
  return sonnerToast(<MarkdownMessage>{message}</MarkdownMessage>, options);
};

toast.success = (message: string, options?: ToastOptions) => {
  return sonnerToast.success(<MarkdownMessage>{message}</MarkdownMessage>, options);
};

toast.error = (message: string, options?: ToastOptions) => {
  return sonnerToast.error(<MarkdownMessage>{message}</MarkdownMessage>, options);
};

toast.info = (message: string, options?: ToastOptions) => {
  return sonnerToast.info(<MarkdownMessage>{message}</MarkdownMessage>, options);
};

toast.warning = (message: string, options?: ToastOptions) => {
  return sonnerToast.warning(<MarkdownMessage>{message}</MarkdownMessage>, options);
};

toast.promise = sonnerToast.promise;
toast.dismiss = sonnerToast.dismiss;
toast.loading = sonnerToast.loading; 