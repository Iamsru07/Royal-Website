import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useRestaurant();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-neutral-900/95 text-white border-neutral-800'
                : isError
                ? 'bg-red-900/95 text-white border-red-800'
                : 'bg-neutral-800/95 text-white border-neutral-700'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {isError && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-amber-400 shrink-0" />}
              <span className="text-xs font-medium truncate">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
