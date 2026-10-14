import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 my-6 bg-white rounded-2xl border border-neutral-100 shadow-sm max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100/80 flex items-center justify-center text-amber-700 mb-4 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-neutral-900 mb-1.5 font-serif-brand">
        {title}
      </h3>
      <p className="text-sm text-neutral-500 max-w-xs mb-6 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center gap-3">
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-all duration-150 shadow-sm"
          >
            {actionText}
          </button>
        )}
        {secondaryActionText && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="px-4 py-2.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl transition-all duration-150"
          >
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
};
