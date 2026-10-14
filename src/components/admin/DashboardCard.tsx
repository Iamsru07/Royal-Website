import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  accentBg?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-xs flex flex-col justify-between hover:border-neutral-200 transition-all">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold text-neutral-500">{title}</span>
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-2xl font-bold text-neutral-900 tabular-nums font-mono">
          {value}
        </h3>
        {trend && (
          <span
            className={`text-[11px] font-semibold ${
              trendPositive ? 'text-emerald-700' : 'text-neutral-500'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] text-neutral-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
};
