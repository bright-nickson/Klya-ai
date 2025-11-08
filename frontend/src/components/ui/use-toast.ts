import toast, { Toaster as HotToaster } from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  className?: string;
  style?: React.CSSProperties;
}

export function useToast() {
  return {
    toast: (message: string, options?: ToastOptions) => {
      return toast(message, options);
    },
    success: (message: string, options?: ToastOptions) => {
      return toast.success(message, options);
    },
    error: (message: string, options?: ToastOptions) => {
      return toast.error(message, options);
    },
    loading: (message: string, options?: ToastOptions) => {
      return toast.loading(message, options);
    },
    dismiss: (toastId?: string) => {
      toast.dismiss(toastId);
    },
    Toaster: HotToaster,
  };
}