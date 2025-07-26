import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Construction, Mail, Target, Calendar, Clock, Globe } from "lucide-react";
import type { Campaign as CampaignType } from "@shared/schema";

export default function Analytics() {
  const { data: metrics } = useQuery({
    queryKey: ["/api/analytics/metrics"],
  });

  const { data: campaigns = [] } = useQuery<CampaignType[]>({
    queryKey: ["/api/campaigns"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Analytics Header */}
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-300 dark:to-white bg-clip-text text-transparent mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Deep insights into your lead generation performance
          </p>
        </div>

        {/* Performance Metrics */}
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
            title="Conversion Rate"
            value="24.3%"
            icon={TrendingUp}
            change="+3.2%"
            changeType="positive"
            color="green"
          />
          <MetricCard
            title="Avg. Response Time"
            value="2.4h"
            icon={Clock}
            change="-15min"
            changeType="positive"
            color="yellow"
          />
          <MetricCard
            title="Global Reach"
            value="47"
            icon={Globe}
            change="+8"
            changeType="positive"
            color="purple"
          />
        </div>

        {/* Campaign Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="premium-card animate-slide-up">
            <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Campaign Performance
              </h3>
            </div>
            <div className="p-6">
              {campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Construction className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">No campaign data yet</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                    Create campaigns to see analytics
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="p-4 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-slate-900 dark:text-white">{campaign.name}</h4>
                        <Badge className="bg-[#8c52ff]/10 text-[#8c52ff] border-[#8c52ff]/20">
                          {campaign.leadCount || 0} leads
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

          {/* Monthly Stats */}
          <div className="premium-card animate-slide-up">
            <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Monthly Statistics
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-[#8c52ff] mr-3" />
                  <span className="text-slate-700 dark:text-slate-300">This Month</span>
                </div>
                <span className="font-bold text-2xl text-slate-900 dark:text-white">
                  {metrics?.totalLeads || 0}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Lead Quality Score</span>
                  <span className="font-medium text-emerald-600">87%</span>
                </div>
                <Progress value={87} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Response Rate</span>
                  <span className="font-medium text-blue-600">24.3%</span>
                </div>
                <Progress value={24.3} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Conversion Rate</span>
                  <span className="font-medium text-[#8c52ff]">12.8%</span>
                </div>
                <Progress value={12.8} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}