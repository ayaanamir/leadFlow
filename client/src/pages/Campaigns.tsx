import { useQuery } from "@tanstack/react-query";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { Button } from "@/components/ui/button";
import { Plus, Construction } from "lucide-react";
import { Link } from "wouter";
import type { Campaign as CampaignType } from "@shared/schema";

export default function Campaigns() {
  const { data: campaigns = [], isLoading } = useQuery<CampaignType[]>({
    queryKey: ["/api/campaigns"],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Construction Management
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Construction Management
          </h1>
          <Link href="/chat">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Construction
            </Button>
          </Link>
        </div>
        
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Construction className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No campaigns yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Create your first campaign to start generating leads with AI-powered conversations.
          </p>
          <Link href="/chat">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Construction
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Construction Management
        </h1>
        <Link href="/chat">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Construction
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}
