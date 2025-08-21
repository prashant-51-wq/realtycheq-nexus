import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Services from "./pages/Services";
import Communities from "./pages/Communities";
import Opportunities from "./pages/Opportunities";
import Vendors from "./pages/Vendors";
import Choice from "./pages/Choice";
import Learn from "./pages/Learn";
import Membership from "./pages/Membership";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/browse/:id" element={<div>Property Detail - Coming Soon</div>} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<div>Service Detail - Coming Soon</div>} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/choice" element={<Choice />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
