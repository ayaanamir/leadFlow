import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Campaigns from "@/pages/Campaigns";
import Leads from "@/pages/Leads";
import ChatCampaign from "@/pages/ChatCampaign";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={() => (
            <AppLayout>
              <Dashboard />
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
          <Route path="/chat" component={ChatCampaign} />
          <Route path="/analytics" component={() => (
            <AppLayout>
              <Dashboard />
            </AppLayout>
          )} />
          <Route path="/settings" component={() => (
            <AppLayout>
              <Dashboard />
            </AppLayout>
          )} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="leadflow-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
