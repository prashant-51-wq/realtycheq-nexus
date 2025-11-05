import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Browse from "./pages/Browse";
import PropertyDetail from "./pages/PropertyDetail";
import PropertyList from "./pages/PropertyList";
import RequirementsFunnel from "./pages/RequirementsFunnel";
import Services from "./pages/Services";
import FreeConsultation from "./pages/FreeConsultation";
import Communities from "./pages/Communities";
import Opportunities from "./pages/Opportunities";
import OpportunityNew from "./pages/OpportunityNew";
import OpportunityDetail from "./pages/OpportunityDetail";
import Vendors from "./pages/Vendors";
import VendorDetail from "./pages/VendorDetail";
import Choice from "./pages/Choice";
import Learn from "./pages/Learn";
import Membership from "./pages/Membership";
import Dashboard from "./pages/Dashboard";
import Blog from "./pages/Blog";
import HousePlans from "./pages/HousePlans";
import AIConsultant from "./pages/AIConsultant";
import VendorOnboarding from "./pages/VendorOnboarding";
import PlotsMarketplace from "./pages/PlotsMarketplace";
import CommunityManagement from "./pages/CommunityManagement";
import BlogAdmin from "./pages/BlogAdmin";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import HowItWorks from "./pages/HowItWorks";
import TrustSafety from "./pages/TrustSafety";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import ChatWidget from "./components/chat/ChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/services" element={<Services />} />
            <Route path="/free-consultation" element={<FreeConsultation />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/browse/:id" element={<PropertyDetail />} />
            <Route path="/list-property" element={<PropertyList />} />
            <Route path="/requirements" element={<RequirementsFunnel />} />
            <Route path="/requirements-funnel" element={<RequirementsFunnel />} />
            <Route path="/services/:slug" element={<div>Service Detail - Coming Soon</div>} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/opportunities/new" element={<OpportunityNew />} />
            <Route path="/opportunities/:id" element={<OpportunityDetail />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/vendors/:id" element={<VendorDetail />} />
            <Route path="/choice" element={<Choice />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/house-plans" element={<HousePlans />} />
            <Route path="/ai-consultant" element={<AIConsultant />} />
            <Route path="/vendor-onboarding" element={<VendorOnboarding />} />
            <Route path="/plots" element={<PlotsMarketplace />} />
            <Route path="/community-management" element={<CommunityManagement />} />
            <Route path="/blog-admin" element={<BlogAdmin />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/trust-safety" element={<TrustSafety />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatWidget />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
