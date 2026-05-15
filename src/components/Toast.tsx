'use client';

export default function Toast({
  message,
  type = 'info',
  onClose,
}: {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}) {
  const bgMap = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    info: 'bg-cosmos-800 text-white',
  };

  const iconMap = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-elevated text-sm font-medium toast-enter cursor-pointer flex items-center gap-2.5 ${bgMap[type]}`}
      onClick={onClose}
    >
      <span>{iconMap[type]}</span>
      <span>{message}</span>
    </div>
  );
}

// Toast hook
import { useCallback, useState } from 'react';

export interface ToastData {
  message: string;
  type: 'success' | 'error' | 'info';
}

export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((data: ToastData) => {
    setToast(data);
    setTimeout(() => setToast(null), 4000);
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  return { toast, showToast, clearToast };
}
