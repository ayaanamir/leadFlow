import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { EmailAlerts } from "@/components/dashboard/EmailAlerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Construction, Mail, Target } from "lucide-react";
import type { Campaign as CampaignType } from "@shared/schema";

export default function Dashboard() {
  const { data: metrics } = useQuery({
    queryKey: ["/api/analytics/metrics"],
  });

  const { data: campaigns = [] } = useQuery<CampaignType[]>({
    queryKey: ["/api/campaigns"],
  });

  const recentCampaigns = campaigns.slice(0, 3);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      created: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      scraped: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      researched: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      complete: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    };
    return colors[status as keyof typeof colors] || colors.created;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value={metrics?.totalLeads || 0}
          icon={Users}
          change="+12%"
          changeType="positive"
          color="blue"
        />
        <MetricCard
          title="Active Campaigns"
          value={metrics?.activeCampaigns || 0}
          icon={Construction}
          change="+2"
          changeType="positive"
          color="green"
        />
        <MetricCard
          title="Response Rate"
          value="24.3%"
          icon={Mail}
          change="+3.2%"
          changeType="positive"
          color="yellow"
        />
        <MetricCard
          title="Qualified Leads"
          value={metrics?.qualifiedLeads || 0}
          icon={Target}
          change="+18"
          changeType="positive"
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Alerts */}
        <EmailAlerts />

        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentCampaigns.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <Construction className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No campaigns yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {recentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {campaign.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {campaign.leadCount || 0} leads • Created {formatDate(campaign.createdAt)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <Progress value={campaign.progress || 0} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
