import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { EmailAlerts } from "@/components/dashboard/EmailAlerts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Construction, Mail, Target, MessageCircle, Plus } from "lucide-react";
import { Link } from "wouter";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-300 dark:to-white bg-clip-text text-transparent mb-2">
            Welcome back!
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Here's an overview of your lead generation performance
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Alerts */}
          <EmailAlerts />

          {/* Recent Campaigns */}
          <div className="premium-card animate-slide-up">
            <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Recent Campaigns
              </h3>
            </div>
            <div className="p-6">
              {recentCampaigns.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Construction className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">No campaigns yet</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                    Create your first campaign to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentCampaigns.map((campaign) => (
                    <div key={campaign.id} className="group p-4 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 hover:shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {campaign.name}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {campaign.leadCount || 0} leads • Created {formatDate(campaign.createdAt)}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(campaign.status)} px-3 py-1 text-xs font-medium`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Progress</span>
                          <span className="font-medium text-slate-900 dark:text-white">{campaign.progress || 0}%</span>
                        </div>
                        <Progress value={campaign.progress || 0} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
          <Link href="/campaigns">
            <Button className="button-primary w-14 h-14 rounded-full shadow-2xl hover:shadow-3xl">
              <Plus className="w-6 h-6" />
            </Button>
          </Link>
          <Link href="/chat">
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white w-14 h-14 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
              <MessageCircle className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
