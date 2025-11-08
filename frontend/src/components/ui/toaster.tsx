"use client"

import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        duration: 5000,
        className: '!bg-background !text-foreground',
        success: {
          className: '!bg-green-100 !text-green-800 border border-green-200',
          iconTheme: {
            primary: '#10B981',
            secondary: 'white',
          },
        },
        error: {
          className: '!bg-red-100 !text-red-800 border border-red-200',
          iconTheme: {
            primary: '#EF4444',
            secondary: 'white',
          },
        },
      }}
    />
  );
}

export { Toaster as ToastProvider };
