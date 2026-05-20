import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Login, { checkSession, clearSession } from "@/pages/Login";
import { GoogleMapsProvider } from "@/lib/GoogleMapsProvider";

const queryClient = new QueryClient();

function App() {
  const [authed, setAuthed] = useState<boolean>(() => checkSession());

  function handleLogout() {
    clearSession();
    setAuthed(false);
  }

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleMapsProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Switch>
              <Route path="/" component={() => <Dashboard onLogout={handleLogout} />} />
              <Route component={NotFound} />
            </Switch>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </GoogleMapsProvider>
    </QueryClientProvider>
  );
}

export default App;
