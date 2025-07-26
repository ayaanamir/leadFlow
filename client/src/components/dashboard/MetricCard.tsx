import { Card, CardContent } from "@/components/ui/card";
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
  blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  green: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  yellow: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
  purple: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
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
    positive: "text-green-600 dark:text-green-400",
    negative: "text-red-600 dark:text-red-400",
    neutral: "text-gray-500 dark:text-gray-400",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
        </div>
        {change && (
          <div className="mt-2 flex items-center text-sm">
            <span className={`font-medium ${changeColors[changeType]}`}>
              {change}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">
              from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
