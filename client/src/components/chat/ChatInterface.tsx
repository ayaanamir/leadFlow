import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, ArrowLeft, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { ChatMessage } from "@shared/schema";

interface ChatInterfaceProps {
  campaignId?: string;
}

export function ChatInterface({ campaignId }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/chat", campaignId],
    enabled: !!campaignId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { message: string; campaignId?: string }) => {
      const response = await apiRequest("POST", "/api/chat", messageData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat"] });
      
      if (data.shouldCreateCampaign && data.campaign) {
        toast({
          title: "Campaign Created!",
          description: `Successfully created "${data.campaign.name}"`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessageMutation.mutate({
      message,
      campaignId,
    });
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show initial message if no conversation history
  const displayMessages = messages.length === 0 ? [
    {
      id: "initial",
      role: "assistant",
      content: "Hi there! I'm Lead Generation Joe, your AI assistant. I'm here to help you create a new lead generation campaign. Let's start by understanding what type of prospects you're looking for.\n\nWhat industry or business type are you targeting? For example: \"tech startups\", \"marketing agencies\", \"e-commerce businesses\", etc.",
      createdAt: new Date(),
    }
  ] : messages;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* Chat Header */}
      <div className="border-b border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-3">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Lead Generation Joe
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your AI Campaign Assistant
                </p>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Online
          </Badge>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start ${msg.role === "user" ? "justify-end" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
            
            <div className={`${msg.role === "assistant" ? "ml-3" : "mr-3"} flex-1`}>
              <Card className={`p-4 max-w-2xl ${
                msg.role === "user" 
                  ? "bg-primary text-white ml-auto" 
                  : "bg-gray-100 dark:bg-slate-800"
              }`}>
                <p className={`${
                  msg.role === "user" 
                    ? "text-white" 
                    : "text-gray-900 dark:text-white"
                }`}>
                  {msg.content}
                </p>
              </Card>
              <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                msg.role === "user" ? "text-right mr-4" : "ml-4"
              }`}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>

            {msg.role === "user" && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {sendMessageMutation.isPending && (
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <Card className="p-4 max-w-2xl bg-gray-100 dark:bg-slate-800">
                <p className="text-gray-500 dark:text-gray-400">
                  Lead Generation Joe is thinking...
                </p>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="resize-none"
              rows={3}
              disabled={sendMessageMutation.isPending}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            size="icon"
            className="flex-shrink-0"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
