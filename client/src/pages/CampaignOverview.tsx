import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Users, MapPin, Building, Target, Zap } from "lucide-react";
import { useLocation } from "wouter";

interface Props {
  id: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  locations: string[];
  businesses: string[];
  jobTitles: string[];
  status: string;
  progress: number;
}

export default function CampaignOverview({ id }: Props) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  useEffect(() => {
    const stored: Campaign[] = JSON.parse(sessionStorage.getItem("campaigns") || "[]");
    setCampaign(stored.find(c => c.id === id) || null);
  }, [id]);

  if (!campaign) return <p className="p-6">Campaign not found.</p>;

  const updateStatus = (status: string, progress: number) => {
    const stored: Campaign[] = JSON.parse(sessionStorage.getItem("campaigns") || "[]").map((c: Campaign) => c.id===id? { ...c, status, progress }: c);
    sessionStorage.setItem("campaigns", JSON.stringify(stored));
    setCampaign(prev => prev && { ...prev, status, progress });
  };

  const handleResearch = () => {
    toast({ title: "Research started", description: "n8n workflow triggered." });
    updateStatus("researching", 45);
  };
  const handleEnrich = () => {
    toast({ title: "Enrichment started", description: "Owner enrichment automation triggered." });
    updateStatus("enriched", 90);
  };

  const handleCompose = () => navigate(`/campaigns/${id}/email`);

  const statusColors: Record<string,string> = {
    created:"bg-gray-100 text-gray-800", researching:"bg-yellow-100 text-yellow-800", enriched:"bg-blue-100 text-blue-800" ,completed:"bg-green-100 text-green-800"};

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {campaign.name}
            <Badge className={`${statusColors[campaign.status] || ""}`}>{campaign.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">{campaign.description}</p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-1 flex items-center"><MapPin className="w-4 h-4 mr-1"/>Locations</h4>
              {campaign.locations.join(", ")}
            </div>
            <div>
              <h4 className="font-medium mb-1 flex items-center"><Building className="w-4 h-4 mr-1"/>Businesses</h4>
              {campaign.businesses.join(", ")}
            </div>
            <div>
              <h4 className="font-medium mb-1 flex items-center"><Users className="w-4 h-4 mr-1"/>Job Titles</h4>
              {campaign.jobTitles.join(", ")}
            </div>
          </div>
          <div>
            <Progress value={campaign.progress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">Progress {campaign.progress}%</p>
          </div>
          <div className="flex gap-3 pt-2 flex-wrap">
            <Button onClick={handleResearch}>Run Research</Button>
            <Button variant="outline" onClick={handleEnrich}>Enrich Owners</Button>
            <Button variant="secondary" onClick={handleCompose}>Compose Emails</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 