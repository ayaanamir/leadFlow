import { useState } from "react";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { Button } from "@/components/ui/button";
import { Plus, Construction } from "lucide-react";
import { Link } from "wouter";

// Mock campaign data based on n8n automation structure
const mockCampaigns = [
  {
    id: "camp-1",
    name: "Tech Startup Founders - SF Bay Area",
    status: "active",
    leadCount: 247,
    progress: 78,
    createdAt: new Date('2024-01-15'),
    searchCriteria: {
      locations: ["San Francisco", "Palo Alto", "Mountain View"],
      businesses: ["Software", "SaaS", "AI/ML"],
      jobTitles: ["CEO", "Founder", "Co-Founder"]
    },
    metrics: {
      scraped: 247,
      researched: 192,
      qualified: 45,
      contacted: 23
    }
  },
  {
    id: "camp-2", 
    name: "E-commerce Directors - NYC",
    status: "completed",
    leadCount: 156,
    progress: 100,
    createdAt: new Date('2024-01-10'),
    searchCriteria: {
      locations: ["New York", "Brooklyn", "Manhattan"],
      businesses: ["E-commerce", "Retail", "Consumer Goods"],
      jobTitles: ["Director", "VP Marketing", "Head of Growth"]
    },
    metrics: {
      scraped: 156,
      researched: 156,
      qualified: 34,
      contacted: 34
    }
  },
  {
    id: "camp-3",
    name: "Healthcare IT Leaders - Boston", 
    status: "researching",
    leadCount: 89,
    progress: 45,
    createdAt: new Date('2024-01-20'),
    searchCriteria: {
      locations: ["Boston", "Cambridge", "Somerville"],
      businesses: ["Healthcare", "Medical Technology", "Biotech"],
      jobTitles: ["CTO", "IT Director", "VP Technology"]
    },
    metrics: {
      scraped: 89,
      researched: 40,
      qualified: 0,
      contacted: 0
    }
  },
  {
    id: "camp-4",
    name: "Financial Services - Chicago",
    status: "scraping", 
    leadCount: 23,
    progress: 12,
    createdAt: new Date('2024-01-25'),
    searchCriteria: {
      locations: ["Chicago", "Evanston", "Oak Park"],
      businesses: ["Financial Services", "FinTech", "Banking"],
      jobTitles: ["CFO", "Finance Director", "VP Finance"]
    },
    metrics: {
      scraped: 23,
      researched: 0,
      qualified: 0,
      contacted: 0
    }
  }
];

export default function Campaigns() {
  const [campaigns] = useState(mockCampaigns);
  const [isLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lead Generation Campaigns
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
            Lead Generation Campaigns
          </h1>
          <Link href="/chat">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
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
            Create your first campaign to start generating leads with n8n automation.
          </p>
          <Link href="/chat">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Campaign
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
          Lead Generation Campaigns
        </h1>
        <Link href="/chat">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
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
