import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
// Removed Card import - using custom premium design
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Mail, HelpCircle, CheckCircle } from "lucide-react";
import type { EmailAlert } from "@shared/schema";

const alertIcons = {
  complaint: AlertTriangle,
  question: HelpCircle,
  positive_reply: CheckCircle,
};

const alertColors = {
  complaint: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800",
  question: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800",
  positive_reply: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800",
};

export function EmailAlerts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts = [] } = useQuery<EmailAlert[]>({
    queryKey: ["/api/email-alerts"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await apiRequest("PATCH", `/api/email-alerts/${alertId}/read`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/email-alerts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const urgentAlerts = alerts.filter(alert => !alert.isRead);

  const formatTime = (date: Date) => {
    const now = new Date();
    const alertDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - alertDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
  };

  return (
    <div className="premium-card animate-slide-up">
      <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            Email Alerts
          </h3>
          {urgentAlerts.length > 0 && (
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 text-xs font-medium">
              {urgentAlerts.length} new
            </Badge>
          )}
        </div>
      </div>
      <div className="p-6">
        {urgentAlerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">All caught up!</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
              No urgent alerts at the moment
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {urgentAlerts.slice(0, 5).map((alert) => {
              const Icon = alertIcons[alert.type as keyof typeof alertIcons];
              return (
                <div
                  key={alert.id}
                  className="group p-4 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 cursor-pointer hover:shadow-sm"
                  onClick={() => markAsReadMutation.mutate(alert.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                        alertColors[alert.type as keyof typeof alertColors]
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {alert.subject}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        From: {alert.sender}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                        {formatTime(alert.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
