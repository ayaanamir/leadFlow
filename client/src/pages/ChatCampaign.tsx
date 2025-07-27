import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Bot, 
  User, 
  ArrowLeft, 
  Target, 
  MapPin, 
  Building, 
  Users,
  Zap,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface CampaignData {
  name?: string;
  description?: string;
  locations?: string[];
  businesses?: string[];
  jobTitles?: string[];
}

export default function ChatCampaign() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI campaign assistant. I'll help you create a lead generation campaign step by step. Let's start with the basics - what would you like to name your campaign?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignData>({});
  const [currentStep, setCurrentStep] = useState<'name' | 'description' | 'locations' | 'businesses' | 'jobTitles' | 'review'>('name');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, type: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = async (response: string) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    addMessage(response, 'bot');
    setIsTyping(false);
  };

  const handleNameStep = async (name: string) => {
    setCampaignData(prev => ({ ...prev, name }));
    setCurrentStep('description');
    await simulateTyping("Great! Now tell me a bit about your campaign goals and target audience. What's the main objective?");
  };

  const handleDescriptionStep = async (description: string) => {
    setCampaignData(prev => ({ ...prev, description }));
    setCurrentStep('locations');
    await simulateTyping("Perfect! Now let's talk about geography. Which locations or areas do you want to target? (You can mention multiple places)");
  };

  const handleLocationsStep = async (locationsText: string) => {
    const locations = locationsText.split(',').map(loc => loc.trim()).filter(Boolean);
    setCampaignData(prev => ({ ...prev, locations }));
    setCurrentStep('businesses');
    await simulateTyping("Excellent! What types of businesses are you looking for? (e.g., SaaS, Construction, Healthcare)");
  };

  const handleBusinessesStep = async (businessesText: string) => {
    const businesses = businessesText.split(',').map(bus => bus.trim()).filter(Boolean);
    setCampaignData(prev => ({ ...prev, businesses }));
    setCurrentStep('jobTitles');
    await simulateTyping("Almost there! What job titles or roles should we focus on? (e.g., CEO, Founder, Marketing Director)");
  };

  const handleJobTitlesStep = async (jobTitlesText: string) => {
    const jobTitles = jobTitlesText.split(',').map(title => title.trim()).filter(Boolean);
    setCampaignData(prev => ({ ...prev, jobTitles }));
    setCurrentStep('review');
    
    const summary = `Perfect! Let me summarize your campaign:

🎯 **${campaignData.name}**
📝 ${campaignData.description}

📍 **Locations:** ${campaignData.locations?.join(', ')}
🏢 **Business Types:** ${campaignData.businesses?.join(', ')}
👥 **Job Titles:** ${jobTitles.join(', ')}

Ready to launch this campaign? I'll trigger the n8n automation to start finding leads!`;

    await simulateTyping(summary);
    await simulateTyping("Type 'launch' to create the campaign and start the automation, or 'edit' to make changes.");
  };

  const handleReviewStep = async (response: string) => {
    if (response.toLowerCase().includes('launch')) {
      await simulateTyping("🚀 Launching your campaign! Triggering n8n automation...");
      
      // Create campaign in sessionStorage
      const id = `camp-${Date.now()}`;
      const campaign = {
        id,
        ...campaignData,
        status: 'created',
        progress: 0
      };
      
      const stored = JSON.parse(sessionStorage.getItem("campaigns") || "[]");
      sessionStorage.setItem("campaigns", JSON.stringify([...stored, campaign]));
      
      toast({
        title: "Campaign Created!",
        description: "Your campaign has been launched and n8n automation is running."
      });
      
      await simulateTyping("✅ Campaign created successfully! Redirecting you to the campaign overview...");
      
      setTimeout(() => {
        navigate(`/campaigns/${id}`);
      }, 2000);
      
    } else if (response.toLowerCase().includes('edit')) {
      setCurrentStep('name');
      await simulateTyping("No problem! Let's start over. What would you like to name your campaign?");
      setCampaignData({});
    } else {
      await simulateTyping("I didn't catch that. Type 'launch' to create the campaign or 'edit' to start over.");
    }
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userInput = inputValue.trim();
    addMessage(userInput, 'user');
    setInputValue("");

    switch (currentStep) {
      case 'name':
        await handleNameStep(userInput);
        break;
      case 'description':
        await handleDescriptionStep(userInput);
        break;
      case 'locations':
        await handleLocationsStep(userInput);
        break;
      case 'businesses':
        await handleBusinessesStep(userInput);
        break;
      case 'jobTitles':
        await handleJobTitlesStep(userInput);
        break;
      case 'review':
        await handleReviewStep(userInput);
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                AI Campaign Assistant
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Let's create your lead generation campaign together
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bot className="w-3 h-3" />
            AI Assistant
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <Card className={`${message.type === 'user' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800'}`}>
                <CardContent className="p-3">
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isTyping}
            className="flex-1"
          />
          <Button 
            onClick={handleSubmit} 
            disabled={!inputValue.trim() || isTyping}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
