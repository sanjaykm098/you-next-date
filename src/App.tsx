import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Discover from "./pages/Discover";
import ChatPage from "./pages/Chat";
import Profile from "./pages/Profile";
import MyPlan from "./pages/MyPlan";
import Upgrade from "./pages/Upgrade";
import NotFound from "./pages/NotFound";
import { MobileOnly } from "./components/layout/MobileOnly";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={
            <MobileOnly>
              <Routes>
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/chat/:chatId" element={<ChatPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/my-plan" element={<MyPlan />} />
                <Route path="/upgrade" element={<Upgrade />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MobileOnly>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
