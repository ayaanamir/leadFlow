import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, Mail, Download, Plus, User, Building, MapPin, Star } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  title: string;
  company: string;
  location: string;
  linkedinUrl: string;
  status: "new" | "contacted" | "qualified" | "not_interested";
  source: string;
  createdAt: Date;
  research: {
    companyInfo: string;
    recentPosts: string;
    trustpilotRating: number;
    companyWebsite: string;
    personalEmails: string[];
    workEmails: string[];
  };
}

// Mock lead data based on n8n automation structure
const mockLeads: Lead[] = [
  {
    id: "lead-1",
    name: "Sarah Chen",
    email: "sarah.chen@techstartup.com",
    title: "CEO & Founder", 
    company: "AI Vision Labs",
    location: "San Francisco, CA",
    linkedinUrl: "https://linkedin.com/in/sarahchen",
    status: "qualified",
    source: "Tech Startup Founders - SF Bay Area",
    createdAt: new Date('2024-01-22'),
    research: {
      companyInfo: "AI Vision Labs is a computer vision startup focusing on retail analytics. They've raised $2.5M in seed funding and work with major retail chains.",
      recentPosts: "Recently posted about expanding their team and launching new product features for inventory management.",
      trustpilotRating: 4.2,
      companyWebsite: "https://aivisionlabs.com",
      personalEmails: ["sarah@gmail.com"],
      workEmails: ["sarah.chen@techstartup.com", "s.chen@aivisionlabs.com"]
    }
  },
  {
    id: "lead-2", 
    name: "Michael Rodriguez",
    email: "mrodriguez@ecommplatform.io",
    title: "VP of Marketing",
    company: "Commerce Platform Inc",
    location: "New York, NY",
    linkedinUrl: "https://linkedin.com/in/michaelrodriguez",
    status: "contacted",
    source: "E-commerce Directors - NYC",
    createdAt: new Date('2024-01-20'),
    research: {
      companyInfo: "Commerce Platform Inc provides e-commerce solutions for mid-market retailers. $15M ARR, 150 employees, focusing on omnichannel retail.",
      recentPosts: "Shared insights about Q4 e-commerce trends and holiday shopping behaviors.",
      trustpilotRating: 3.8,
      companyWebsite: "https://commerceplatform.io",
      personalEmails: [],
      workEmails: ["mrodriguez@ecommplatform.io"]
    }
  },
  {
    id: "lead-3",
    name: "Dr. Jennifer Walsh",
    email: "jwalsh@healthtech.com", 
    title: "CTO",
    company: "MedFlow Systems",
    location: "Boston, MA",
    linkedinUrl: "https://linkedin.com/in/drjenniferwalsh",
    status: "new",
    source: "Healthcare IT Leaders - Boston",
    createdAt: new Date('2024-01-25'),
    research: {
      companyInfo: "MedFlow Systems develops EHR integration software for hospitals. Recently acquired by larger healthcare tech company.",
      recentPosts: "Posted about healthcare data interoperability challenges and HIPAA compliance best practices.",
      trustpilotRating: 4.6,
      companyWebsite: "https://medflowsystems.com",
      personalEmails: ["jennifer.walsh@gmail.com"],
      workEmails: ["jwalsh@healthtech.com", "j.walsh@medflow.com"]
    }
  },
  {
    id: "lead-4",
    name: "David Kim",
    email: "dkim@financetech.com",
    title: "CFO",
    company: "FinTech Solutions",
    location: "Chicago, IL", 
    linkedinUrl: "https://linkedin.com/in/davidkim",
    status: "new",
    source: "Financial Services - Chicago",
    createdAt: new Date('2024-01-26'),
    research: {
      companyInfo: "FinTech Solutions provides payment processing and financial analytics for small businesses. Growing rapidly with recent Series A funding.",
      recentPosts: "Recently discussed the impact of new financial regulations on fintech startups.",
      trustpilotRating: 4.1,
      companyWebsite: "https://fintechsolutions.com",
      personalEmails: [],
      workEmails: ["dkim@financetech.com"]
    }
  }
];

const statusColors = {
  new: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  qualified: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  not_interested: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

export function LeadTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  // Local copy of leads so UI can update immediately
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  // Filter leads based on search / status
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = search === "" || 
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase()) ||
      lead.title.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (leadId: string, newStatus: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus as Lead["status"] } : l));

    toast({
      title: "Status Updated",
      description: `Lead status changed to ${newStatus}. n8n will sync this automatically.`,
      duration: 2500,
    });
  };

  const handleBulkEmail = () => {
    toast({
      title: "Bulk Email",
      description: `Preparing to send emails to ${selectedLeads.length} selected leads via n8n automation.`,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Exporting lead data to CSV format.",
    });
  };

  const handleViewResearch = (lead: Lead) => {
    toast({
      title: "Research Details",
      description: `Viewing detailed research for ${lead.name} at ${lead.company}`,
    });
  };

  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads([...selectedLeads, leadId]);
    } else {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search leads..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="not_interested">Not Interested</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              {selectedLeads.length > 0 && (
                <Button onClick={handleBulkEmail} variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Email ({selectedLeads.length})
                </Button>
              )}
              <Button onClick={handleExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredLeads.length} of {leads.length} leads
        </p>
        {selectedLeads.length > 0 && (
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {selectedLeads.length} selected
          </p>
        )}
      </div>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source Campaign</TableHead>
                <TableHead>Research Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {lead.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {lead.title}
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                          {lead.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {lead.company}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {lead.location}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Select
                      value={lead.status}
                      onValueChange={(value) => handleStatusUpdate(lead.id, value)}
                    >
                      <SelectTrigger className="w-[120px] bg-transparent border-none p-0 focus:outline-none">
                        <Badge className={`${statusColors[lead.status]} whitespace-nowrap px-2 py-1`}> 
                          {lead.status.replace('_', ' ')}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="not_interested">Not Interested</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                    {lead.source}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">
                        {lead.research.trustpilotRating}/5
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewResearch(lead)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(lead.linkedinUrl, '_blank')}
                      >
                        <User className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No leads found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {search || statusFilter !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Start by creating a campaign to generate leads."
            }
          </p>
        </div>
      )}
    </div>
  );
}
