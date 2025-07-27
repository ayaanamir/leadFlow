import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Eye, Download, Play, Users, Target, Search } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: string;
  leadCount: number;
  progress: number;
  createdAt: Date;
  searchCriteria: {
    locations: string[];
    businesses: string[];
    jobTitles: string[];
  };
  metrics: {
    scraped: number;
    researched: number;
    qualified: number;
    contacted: number;
  };
}

interface CampaignCardProps {
  campaign: Campaign;
}

const statusColors = {
  created: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  scraping: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  researching: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  active: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  completed: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const { toast } = useToast();

  const handleStartScraping = () => {
    toast({
      title: "Campaign Starting",
      description: `Lead scraping will be triggered via n8n automation for "${campaign.name}"`,
    });
  };

  const handleViewLeads = () => {
    toast({
      title: "View Leads",
      description: `Viewing ${campaign.metrics.scraped} leads from "${campaign.name}"`,
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started", 
      description: `Downloading lead data from "${campaign.name}"`,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || statusColors.created;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white dark:bg-slate-800 shadow-sm hover:shadow-xl">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
              {campaign.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Created {formatDate(campaign.createdAt)}
            </p>
          </div>
          <Badge className={`${getStatusColor(campaign.status)} ml-2 flex-shrink-0`}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
        </div>

        {/* Search Criteria Summary */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Search className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">
              {campaign.searchCriteria.locations.slice(0, 2).join(", ")}
              {campaign.searchCriteria.locations.length > 2 && " +more"}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Target className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">
              {campaign.searchCriteria.jobTitles.slice(0, 2).join(", ")}
              {campaign.searchCriteria.jobTitles.length > 2 && " +more"}
            </span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {campaign.metrics.scraped}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Scraped</div>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {campaign.metrics.qualified}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Qualified</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">{campaign.progress}%</span>
          </div>
          <Progress value={campaign.progress} className="h-2" />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {campaign.status === 'created' && (
            <Button 
              size="sm" 
              onClick={handleStartScraping}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-1" />
              Start
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleViewLeads}
            className="flex-1"
          >
            <Users className="w-4 h-4 mr-1" />
            View Leads
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
