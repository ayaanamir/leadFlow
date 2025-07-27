import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Target, 
  MapPin, 
  Building, 
  Users, 
  ArrowLeft, 
  Plus, 
  Trash2,
  Zap,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface CampaignFormData {
  name: string;
  description: string;
  locations: string[];
  businesses: string[];
  jobTitles: string[];
}

export function ChatInterface() {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    description: "",
    locations: [""],
    businesses: [""],
    jobTitles: [""]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const handleInputChange = (field: keyof CampaignFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: 'locations' | 'businesses' | 'jobTitles', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'locations' | 'businesses' | 'jobTitles') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeArrayItem = (field: 'locations' | 'businesses' | 'jobTitles', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate n8n webhook trigger
      const webhookData = {
        campaignName: formData.name,
        description: formData.description,
        searchCriteria: {
          locations: formData.locations.filter(loc => loc.trim()),
          businesses: formData.businesses.filter(bus => bus.trim()),
          jobTitles: formData.jobTitles.filter(job => job.trim())
        },
        timestamp: new Date().toISOString()
      };

      // In a real implementation, this would be a webhook to n8n
      console.log("Triggering n8n workflow with:", webhookData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "🎉 Campaign Created!",
        description: `"${formData.name}" has been created and n8n automation started. Lead scraping will begin shortly.`,
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        locations: [""],
        businesses: [""],
        jobTitles: [""]
      });
      setStep(1);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim() && formData.description.trim();
      case 2:
        return formData.locations.some(loc => loc.trim());
      case 3:
        return formData.businesses.some(bus => bus.trim()) && formData.jobTitles.some(job => job.trim());
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Create New Campaign
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Let's start by giving your campaign a name and description
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Campaign Name</Label>
          <Input
            id="name"
            placeholder="e.g., Tech Startup Founders - SF Bay Area"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your target audience and campaign goals..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <MapPin className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Target Locations
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Specify the geographic areas you want to target
        </p>
      </div>

      <div className="space-y-4">
        <Label>Locations</Label>
        {formData.locations.map((location, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              placeholder="e.g., San Francisco, CA"
              value={location}
              onChange={(e) => handleArrayInputChange('locations', index, e.target.value)}
            />
            {formData.locations.length > 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeArrayItem('locations', index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => addArrayItem('locations')}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Users className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Target Prospects
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Define the business types and job titles you're targeting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label>Business Types</Label>
          {formData.businesses.map((business, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="e.g., Software, SaaS, AI/ML"
                value={business}
                onChange={(e) => handleArrayInputChange('businesses', index, e.target.value)}
              />
              {formData.businesses.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem('businesses', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => addArrayItem('businesses')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Business Type
          </Button>
        </div>

        <div className="space-y-4">
          <Label>Job Titles</Label>
          {formData.jobTitles.map((title, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="e.g., CEO, Founder, CTO"
                value={title}
                onChange={(e) => handleArrayInputChange('jobTitles', index, e.target.value)}
              />
              {formData.jobTitles.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem('jobTitles', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => addArrayItem('jobTitles')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Job Title
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Review & Launch
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review your campaign details before launching the n8n automation
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            {formData.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-500">Description</Label>
            <p className="text-gray-900 dark:text-white">{formData.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Locations</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.locations.filter(loc => loc.trim()).map((location, index) => (
                  <Badge key={index} variant="secondary">
                    <MapPin className="w-3 h-3 mr-1" />
                    {location}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Business Types</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.businesses.filter(bus => bus.trim()).map((business, index) => (
                  <Badge key={index} variant="secondary">
                    <Building className="w-3 h-3 mr-1" />
                    {business}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Job Titles</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.jobTitles.filter(job => job.trim()).map((title, index) => (
                  <Badge key={index} variant="secondary">
                    <Users className="w-3 h-3 mr-1" />
                    {title}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-center">
          <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              n8n Automation Ready
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              This campaign will trigger your n8n workflows for lead scraping, research, and data collection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/campaigns">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Campaign Builder
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Step {step} of 4
                </p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum <= step
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}
                >
                  {stepNum}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>

            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !canProceed()}
              >
                {isSubmitting ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    Launching...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Launch Campaign
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
