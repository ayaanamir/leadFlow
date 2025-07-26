import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Key, 
  Database,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="p-8 space-y-8 max-w-4xl mx-auto">
        {/* Settings Header */}
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-300 dark:to-white bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Manage your account, preferences, and integrations
          </p>
        </div>

        {/* Profile Settings */}
        <div className="premium-card animate-slide-up">
          <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center">
              <User className="w-5 h-5 text-[#8c52ff] mr-3" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Profile Settings
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8c52ff] to-purple-700 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">
                  {user?.firstName || "User"} {user?.lastName || ""}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{user?.email}</p>
                <Badge className="bg-[#8c52ff]/10 text-[#8c52ff] border-[#8c52ff]/20 mt-1">
                  Pro Plan
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={user?.firstName || ""} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={user?.lastName || ""} className="mt-1" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={user?.email || ""} className="mt-1" disabled readOnly />
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="premium-card animate-slide-up">
          <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-[#8c52ff] mr-3" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Notifications
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Alerts</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Get notified about urgent email responses</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Campaign Updates</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Receive updates when campaigns complete</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Reports</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Get weekly performance summaries</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="premium-card animate-slide-up">
          <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center">
              <Database className="w-5 h-5 text-[#8c52ff] mr-3" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Integrations
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200/50 dark:border-slate-700/50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Label>n8n Workflows</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Connected automation workflows</p>
                </div>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                <span className="text-sm font-medium text-emerald-600">Connected</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-slate-200/50 dark:border-slate-700/50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Label>OpenAI API</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">AI-powered campaign creation</p>
                </div>
              </div>
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
                <span className="text-sm font-medium text-amber-600">Setup Required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="premium-card animate-slide-up">
          <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-[#8c52ff] mr-3" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Security & Privacy
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Data Export</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">Download your data</p>
              </div>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Save Changes */}
        <div className="flex justify-end">
          <Button className="bg-[#8c52ff] hover:bg-[#8c52ff]/90 text-white px-8">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}