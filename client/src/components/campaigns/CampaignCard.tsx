import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Eye, Download, Play } from "lucide-react";
import type { Campaign } from "@shared/schema";

interface CampaignCardProps {
  campaign: Campaign;
}

const statusColors = {
  created: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  scraped: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  researched: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  complete: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
};

export function CampaignCard({ campaign }: CampaignCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const runScrapingMutation = useMutation({
    mutationFn: async () => {
      // In a real implementation, this would trigger the n8n leadScraping workflow
      const response = await apiRequest("PATCH", `/api/campaigns/${campaign.id}`, {
        status: "scraped",
        progress: 50,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Lead Scraping Started",
        description: "The lead scraping process has been initiated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const runResearchMutation = useMutation({
    mutationFn: async () => {
      // In a real implementation, this would trigger the n8n leadResearch workflow
      const response = await apiRequest("PATCH", `/api/campaigns/${campaign.id}`, {
        status: "researched",
        progress: 75,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Lead Research Started",
        description: "The lead research process has been initiated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {campaign.name}
          </h3>
          <Badge className={statusColors[campaign.status as keyof typeof statusColors]}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Total Leads</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {campaign.leadCount || 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Created</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatDate(campaign.createdAt)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {campaign.progress || 0}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Created</span>
            <span>Scraped</span>
            <span>Researched</span>
            <span>Complete</span>
          </div>
          <Progress value={campaign.progress || 0} className="h-2" />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {campaign.status === "created" && (
            <Button 
              onClick={() => runScrapingMutation.mutate()}
              disabled={runScrapingMutation.isPending}
              className="w-full"
              variant="default"
            >
              <Play className="w-4 h-4 mr-2" />
              {runScrapingMutation.isPending ? "Starting..." : "Run Lead Scraping"}
            </Button>
          )}
          
          {campaign.status === "scraped" && (
            <Button 
              onClick={() => runResearchMutation.mutate()}
              disabled={runResearchMutation.isPending}
              className="w-full"
            >
              <Play className="w-4 h-4 mr-2" />
              {runResearchMutation.isPending ? "Starting..." : "Run Lead Research"}
            </Button>
          )}
          
          {(campaign.status === "researched" || campaign.status === "complete") && (
            <>
              <Button variant="default" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Leads
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
