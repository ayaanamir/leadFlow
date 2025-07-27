import { Switch, Route, Link } from "wouter";
import Dashboard from "@/pages/Dashboard";
import Campaigns from "@/pages/Campaigns";
import Leads from "@/pages/Leads";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import ChatCampaign from "@/pages/ChatCampaign";
import ComposeEmail from "@/pages/ComposeEmail";
import CampaignForm from "@/pages/CampaignForm";
import CampaignOverview from "@/pages/CampaignOverview";
import { AppLayout } from "@/components/layout/AppLayout";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Switch>
        {/* Landing page */}
        <Route path="/" component={Landing} />
        
        {/* Login page */}
        <Route path="/login" component={Login} />
        
        {/* Main app routes */}
        <Route path="/dashboard" component={() => (
          <AppLayout>
            <Dashboard />
          </AppLayout>
        )} />
        
        {/* Campaign creation (form style) */}
        <Route path="/campaigns/new" component={() => (
          <AppLayout>
            <CampaignForm />
          </AppLayout>
        )} />

        {/* Campaign overview */}
        <Route path="/campaigns/:id" component={({ params }) => (
          <AppLayout>
            <CampaignOverview id={params.id} />
          </AppLayout>
        )} />

        {/* Compose Email */}
        <Route path="/campaigns/:id/email" component={({ params }) => (
          <AppLayout>
            <ComposeEmail id={params.id} />
          </AppLayout>
        )} />

        <Route path="/campaigns" component={() => (
          <AppLayout>
            <Campaigns />
          </AppLayout>
        )} />
        
        <Route path="/leads" component={() => (
          <AppLayout>
            <Leads />
          </AppLayout>
        )} />
        
        <Route path="/analytics" component={() => (
          <AppLayout>
            <Analytics />
          </AppLayout>
        )} />
        
        <Route path="/settings" component={() => (
          <AppLayout>
            <Settings />
          </AppLayout>
        )} />
        
        <Route path="/chat" component={ChatCampaign} />
        
        {/* Fallback */}
        <Route>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
              <Link href="/" className="text-blue-500 hover:underline">
                Go Home
              </Link>
            </div>
          </div>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
