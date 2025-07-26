import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  complaint: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20",
  question: "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20",
  positive_reply: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20",
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
          Urgent Email Alerts
          {urgentAlerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {urgentAlerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {urgentAlerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No urgent alerts at the moment</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {urgentAlerts.slice(0, 5).map((alert) => {
              const Icon = alertIcons[alert.type as keyof typeof alertIcons];
              return (
                <div
                  key={alert.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer"
                  onClick={() => markAsReadMutation.mutate(alert.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        alertColors[alert.type as keyof typeof alertColors]
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {alert.subject}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        From: {alert.sender}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatTime(alert.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
