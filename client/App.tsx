import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// CHANGE 1: Import HashRouter instead of BrowserRouter
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Wildcard from "./pages/Wildcard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* CHANGE 2: Use HashRouter here */}
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/wildcard" element={<Wildcard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
