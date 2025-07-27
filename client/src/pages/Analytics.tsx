import { useState } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Construction, Mail, Target, Calendar, Clock, Globe, BarChart3 } from "lucide-react";

// Mock analytics data based on n8n automation metrics
const mockMetrics = {
  totalLeads: 486,
  activeCampaigns: 4,
  qualifiedLeads: 123,
  avgResponseTime: "2.4h",
  conversionRate: 25.3,
  responseRate: 78.2,
  emailDeliveryRate: 94.1,
  trustpilotScore: 4.2
};

const mockCampaigns = [
  {
    id: "camp-1",
    name: "Tech Startup Founders - SF Bay Area",
    status: "active",
    progress: 78,
    leads: 247,
    qualified: 45,
    contacted: 23,
    conversionRate: 28.4,
    lastActivity: "2 hours ago"
  },
  {
    id: "camp-2", 
    name: "E-commerce Directors - NYC",
    status: "completed",
    progress: 100,
    leads: 156,
    qualified: 34,
    contacted: 34,
    conversionRate: 21.8,
    lastActivity: "1 day ago"
  },
  {
    id: "camp-3",
    name: "Healthcare IT Leaders - Boston", 
    status: "researching",
    progress: 45,
    leads: 89,
    qualified: 0,
    contacted: 0,
    conversionRate: 0,
    lastActivity: "3 hours ago"
  }
];

const mockPerformanceData = [
  { period: "Last 7 days", leads: 87, qualified: 19, contacted: 12 },
  { period: "Last 30 days", leads: 298, qualified: 74, contacted: 41 },
  { period: "Last 90 days", leads: 486, qualified: 123, contacted: 78 }
];

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      completed: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      researching: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      scraping: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Analytics Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Deep insights into your n8n lead generation performance
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value={mockMetrics.totalLeads}
          icon={Users}
          change="+12%"
          changeType="positive"
          color="blue"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${mockMetrics.conversionRate}%`}
          icon={TrendingUp}
          change="+3.2%"
          changeType="positive"
          color="green"
        />
        <MetricCard
          title="Avg. Response Time"
          value={mockMetrics.avgResponseTime}
          icon={Clock}
          change="-24min"
          changeType="positive"
          color="yellow"
        />
        <MetricCard
          title="Active Campaigns"
          value={mockMetrics.activeCampaigns}
          icon={Construction}
          change="+1"
          changeType="positive"
          color="purple"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.responseRate}%</div>
            <p className="text-xs text-muted-foreground">+5.4% from last month</p>
            <Progress value={mockMetrics.responseRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Delivery</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.emailDeliveryRate}%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
            <Progress value={mockMetrics.emailDeliveryRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TrustPilot Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.trustpilotScore}/5</div>
            <p className="text-xs text-muted-foreground">Average from research</p>
            <Progress value={mockMetrics.trustpilotScore * 20} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Campaign Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {campaign.name}
                    </h4>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Leads:</span>
                      <span className="font-medium text-gray-900 dark:text-white ml-1">
                        {campaign.leads}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Qualified:</span>
                      <span className="font-medium text-gray-900 dark:text-white ml-1">
                        {campaign.qualified}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Conversion:</span>
                      <span className="font-medium text-gray-900 dark:text-white ml-1">
                        {campaign.conversionRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Last Activity:</span>
                      <span className="font-medium text-gray-900 dark:text-white ml-1">
                        {campaign.lastActivity}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className="text-right mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {campaign.progress}%
                    </span>
                  </div>
                  <Progress value={campaign.progress} className="w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Performance Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPerformanceData.map((period, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="font-medium text-gray-900 dark:text-white">
                  {period.period}
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {period.leads}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">Leads</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600 dark:text-green-400">
                      {period.qualified}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">Qualified</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-blue-600 dark:text-blue-400">
                      {period.contacted}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">Contacted</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-purple-600 dark:text-purple-400">
                      {((period.qualified / period.leads) * 100).toFixed(1)}%
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">Rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* n8n Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-green-600 dark:text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            n8n Automation Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                3
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Workflows
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                247
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Executions Today
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                99.8%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Success Rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}