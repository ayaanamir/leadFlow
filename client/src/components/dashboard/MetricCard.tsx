import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  color: "blue" | "green" | "yellow" | "purple";
}

const colorClasses = {
  blue: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50",
  green: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50",
  yellow: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50",
  purple: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50",
};

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = "neutral",
  color 
}: MetricCardProps) {
  const changeColors = {
    positive: "text-emerald-600 dark:text-emerald-400",
    negative: "text-red-500 dark:text-red-400",
    neutral: "text-slate-500 dark:text-slate-400",
  };

  return (
    <div className="metric-card animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change && (
            <div className="flex items-center text-sm">
              <span className={`font-medium ${changeColors[changeType]}`}>
                {change}
              </span>
              <span className="text-slate-500 dark:text-slate-400 ml-1">
                from last month
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]} shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
