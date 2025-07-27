import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  BarChart3, 
  Mail, 
  TrendingUp, 
  Target, 
  Plus,
  MessageSquare,
  FileText
} from "lucide-react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  useEffect(() => {
    // Get user info on load
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Try to get user info
    fetch('/api/auth/user', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
      } else {
        // Invalid token, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    })
    .catch(() => {
      localStorage.removeItem('token');
      window.location.href = '/login';
    });
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600">
          Hello {user.user_metadata?.first_name || user.email} 👋
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3%</div>
            <p className="text-xs text-muted-foreground">+3.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.7%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Dialog open={showCampaignModal} onOpenChange={setShowCampaignModal}>
              <DialogTrigger asChild>
                <Button className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Create New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Choose Campaign Style</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Link href="/campaigns/new">
                    <Button variant="outline" className="w-full h-20 flex-col gap-2" onClick={() => setShowCampaignModal(false)}>
                      <FileText className="w-6 h-6" />
                      <span>Form Style</span>
                      <span className="text-xs text-gray-500">Step-by-step form wizard</span>
                    </Button>
                  </Link>
                  <Link href="/chat">
                    <Button variant="outline" className="w-full h-20 flex-col gap-2" onClick={() => setShowCampaignModal(false)}>
                      <MessageSquare className="w-6 h-6" />
                      <span>Chat Style</span>
                      <span className="text-xs text-gray-500">Conversational AI assistant</span>
                    </Button>
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
            <Link href="/analytics">
              <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
              </Button>
            </Link>
            <Link href="/leads">
              <Button variant="outline" className="w-full justify-start">
              <Mail className="w-4 h-4 mr-2" />
              Manage Leads
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Campaign "Tech Startups" created</span>
                <span className="text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>50 new leads imported</span>
                <span className="text-gray-500">4 hours ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Campaign "SaaS Founders" completed</span>
                <span className="text-gray-500">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Message */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <Target className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              🎉 Authentication Working!
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                Your Supabase authentication is working perfectly! User: <strong>{user.email}</strong>
                <br />
                Now you can integrate your n8n automations with this dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
