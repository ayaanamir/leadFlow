import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  Send, 
  ArrowLeft, 
  Mail, 
  User, 
  Building, 
  MapPin, 
  Briefcase,
  Sparkles,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Clock,
  Calendar,
  List,
  Settings
} from "lucide-react";

interface Props { id: string }

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

interface EmailStep {
  id: string;
  name: string;
  subject: string;
  body: string;
  delay: number;
  delayUnit: 'hours' | 'days' | 'weeks';
  conditions?: {
    opened?: boolean;
    clicked?: boolean;
    replied?: boolean;
  };
}

const mergeTags = [
  { tag: '{{firstName}}', label: 'First Name', icon: User },
  { tag: '{{lastName}}', label: 'Last Name', icon: User },
  { tag: '{{company}}', label: 'Company', icon: Building },
  { tag: '{{jobTitle}}', label: 'Job Title', icon: Briefcase },
  { tag: '{{location}}', label: 'Location', icon: MapPin },
  { tag: '{{industry}}', label: 'Industry', icon: Building },
];

const emailTemplates = [
  {
    name: "Initial Outreach",
    subject: "Hi {{firstName}}, quick question about {{company}}",
    body: `Hi {{firstName}},

I noticed your work at {{company}} and was impressed by your role as {{jobTitle}}. 

I'd love to connect and discuss how we might collaborate on some exciting opportunities in the {{industry}} space.

Would you be interested in a brief call next week?

Best regards,
[Your Name]`
  },
  {
    name: "Follow-up",
    subject: "Following up - {{company}}",
    body: `Hi {{firstName}},

I wanted to follow up on my previous email about {{company}}. 

I understand you're busy, so I'll keep this brief. Would you be open to a 15-minute call to discuss potential collaboration opportunities?

If not, no worries at all!

Best regards,
[Your Name]`
  },
  {
    name: "Value Proposition",
    subject: "Quick value-add for {{company}}",
    body: `Hi {{firstName}},

I've been researching {{company}} and noticed some interesting opportunities where we could add value.

Would you be interested in a brief discussion about how we might help {{company}} achieve [specific goal]?

I can share some insights that might be relevant to your current initiatives.

Best regards,
[Your Name]`
  }
];

export default function ComposeEmail({ id }: Props) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [emailSteps, setEmailSteps] = useState<EmailStep[]>([
    {
      id: '1',
      name: 'Initial Outreach',
      subject: '',
      body: '',
      delay: 0,
      delayUnit: 'hours'
    }
  ]);
  const [selectedStep, setSelectedStep] = useState<string>('1');
  const [showPreview, setShowPreview] = useState(false);
  const [campaignType, setCampaignType] = useState<'single' | 'sequence'>('sequence');
  const [previewData, setPreviewData] = useState({
    firstName: "John",
    lastName: "Smith",
    company: "TechCorp Inc",
    jobTitle: "CEO",
    location: "San Francisco, CA",
    industry: "Technology"
  });
  const { toast } = useToast();
  const [, navigate] = useLocation();

  useEffect(() => {
    const stored: Campaign[] = JSON.parse(sessionStorage.getItem("campaigns") || "[]");
    const found = stored.find(c => c.id === id);
    setCampaign(found || null);
  }, [id]);

  const insertMergeTag = (tag: string) => {
    const textarea = document.getElementById('email-body') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentStep = emailSteps.find(step => step.id === selectedStep);
      if (!currentStep) return;

      const newBody = currentStep.body.substring(0, start) + tag + currentStep.body.substring(end);
      updateEmailStep(selectedStep, { body: newBody });
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + tag.length, start + tag.length);
      }, 0);
    }
  };

  const updateEmailStep = (stepId: string, updates: Partial<EmailStep>) => {
    setEmailSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const addEmailStep = () => {
    const newId = (emailSteps.length + 1).toString();
    const newStep: EmailStep = {
      id: newId,
      name: `Step ${newId}`,
      subject: '',
      body: '',
      delay: 3,
      delayUnit: 'days'
    };
    setEmailSteps(prev => [...prev, newStep]);
    setSelectedStep(newId);
  };

  const removeEmailStep = (stepId: string) => {
    if (emailSteps.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "You need at least one email step.",
        variant: "destructive"
      });
      return;
    }
    setEmailSteps(prev => prev.filter(step => step.id !== stepId));
    if (selectedStep === stepId) {
      setSelectedStep(emailSteps[0].id);
    }
  };

  const applyTemplate = (template: typeof emailTemplates[0]) => {
    const currentStep = emailSteps.find(step => step.id === selectedStep);
    if (!currentStep) return;

    updateEmailStep(selectedStep, {
      name: template.name,
      subject: template.subject,
      body: template.body
    });
  };

  const getPreviewText = (text: string) => {
    let preview = text;
    mergeTags.forEach(({ tag }) => {
      const value = previewData[tag.replace(/[{}]/g, '') as keyof typeof previewData] || tag;
      preview = preview.replace(new RegExp(tag.replace(/[{}]/g, '\\{\\{|\\}\\}'), 'g'), value);
    });
    return preview;
  };

  const handleSend = () => {
    const currentStep = emailSteps.find(step => step.id === selectedStep);
    if (!currentStep || !currentStep.subject.trim() || !currentStep.body.trim()) {
      toast({
        title: "Missing Content",
        description: "Please fill in both subject and body for the current step.",
        variant: "destructive"
      });
      return;
    }

    if (campaignType === 'sequence' && emailSteps.length > 1) {
      // Validate all steps
      const invalidSteps = emailSteps.filter(step => !step.subject.trim() || !step.body.trim());
      if (invalidSteps.length > 0) {
        toast({
          title: "Incomplete Sequence",
          description: "Please complete all email steps before sending.",
          variant: "destructive"
        });
        return;
      }
    }

    const campaignData = {
      type: campaignType,
      steps: emailSteps,
      campaignId: id
    };

    // Store email campaign data
    sessionStorage.setItem(`email-campaign-${id}`, JSON.stringify(campaignData));

    toast({ 
      title: "Email Campaign Queued", 
      description: `n8n ${campaignType === 'sequence' ? 'sequence' : 'email'} workflow triggered.` 
    });
    navigate("/leads");
  };

  if (!campaign) return <p className="p-6">Campaign not found.</p>;

  const currentStep = emailSteps.find(step => step.id === selectedStep);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Compose Email Campaign
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {campaign.name}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/campaigns/${id}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Campaign Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Campaign Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Target Locations</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {campaign.locations.map((location, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Business Types</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {campaign.businesses.map((business, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Building className="w-3 h-3 mr-1" />
                      {business}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Job Titles</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {campaign.jobTitles.map((title, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {title}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Type */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Campaign Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="single"
                    name="campaignType"
                    checked={campaignType === 'single'}
                    onChange={() => setCampaignType('single')}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="single">Single Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="sequence"
                    name="campaignType"
                    checked={campaignType === 'sequence'}
                    onChange={() => setCampaignType('sequence')}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="sequence">Email Sequence</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Merge Tags */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Merge Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Click to insert personalization tags
              </p>
              <div className="grid grid-cols-2 gap-2">
                {mergeTags.map(({ tag, label, icon: Icon }) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => insertMergeTag(tag)}
                    className="justify-start text-xs h-8"
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    {label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Steps */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <List className="w-5 h-5 mr-2" />
                  Email Steps
                </span>
                {campaignType === 'sequence' && (
                  <Button size="sm" onClick={addEmailStep}>
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {emailSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedStep === step.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedStep(step.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{step.name}</span>
                      </div>
                      {campaignType === 'sequence' && emailSteps.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeEmailStep(step.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    {step.delay > 0 && (
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {step.delay} {step.delayUnit} delay
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Email Templates */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Quick templates to get started
              </p>
              <div className="space-y-2">
                {emailTemplates.map((template) => (
                  <Button
                    key={template.name}
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate(template)}
                    className="w-full justify-start text-xs"
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Composition */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Email Content - {currentStep?.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="email-subject">Subject Line</Label>
                <Input
                  id="email-subject"
                  value={currentStep?.subject || ''}
                  onChange={(e) => updateEmailStep(selectedStep, { subject: e.target.value })}
                  placeholder="Hi {{firstName}}, quick question about {{company}}"
                  className="mt-1"
                />
                {showPreview && (
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                    <strong>Preview:</strong> {getPreviewText(currentStep?.subject || '')}
                  </div>
                )}
              </div>

              {campaignType === 'sequence' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Delay</Label>
                    <Input
                      type="number"
                      value={currentStep?.delay || 0}
                      onChange={(e) => updateEmailStep(selectedStep, { delay: parseInt(e.target.value) || 0 })}
                      min="0"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Delay Unit</Label>
                    <Select
                      value={currentStep?.delayUnit || 'days'}
                      onValueChange={(value: 'hours' | 'days' | 'weeks') => 
                        updateEmailStep(selectedStep, { delayUnit: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <Label htmlFor="email-body">Email Body</Label>
                <Textarea
                  id="email-body"
                  rows={12}
                  value={currentStep?.body || ''}
                  onChange={(e) => updateEmailStep(selectedStep, { body: e.target.value })}
                  placeholder={`Hi {{firstName}},

I noticed your work at {{company}} and was impressed by your role as {{jobTitle}}. 

I'd love to connect and discuss how we might collaborate on some exciting opportunities in the {{industry}} space.

Would you be interested in a brief call next week?

Best regards,
[Your Name]`}
                  className="mt-1 font-mono text-sm"
                />
                {showPreview && (
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm whitespace-pre-wrap">
                    <strong>Preview:</strong>
                    <div className="mt-1">
                      {getPreviewText(currentStep?.body || '')}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {currentStep?.body.length || 0} characters
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => navigate(`/campaigns/${id}`)}>
                    Save Draft
                  </Button>
                  <Button onClick={handleSend} className="flex items-center">
                    <Send className="w-4 h-4 mr-2" />
                    Send {campaignType === 'sequence' ? 'Sequence' : 'Email'} via n8n
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 