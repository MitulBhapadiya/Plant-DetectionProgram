
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CropInfo from "./pages/CropInfo";
import DiseaseDetection from "./pages/DiseaseDetection";
import Admin from "./pages/Admin";
import Dashboard from "./pages/admin/Dashboard";
import CropsManagement from "./pages/admin/CropsManagement";
import CropForm from "./pages/admin/CropForm";
import SolutionsManagement from "./pages/admin/SolutionsManagement";
import SolutionForm from "./pages/admin/SolutionForm";
import Settings from "./pages/admin/Settings";

function App() {
  const queryClient = new QueryClient();
  
  // Initialize API settings from localStorage if available
  useEffect(() => {
    const savedApiSettings = localStorage.getItem('apiSettings');
    if (savedApiSettings) {
      const settings = JSON.parse(savedApiSettings);
      // You could set these in a global state or context
      console.log("Loaded API settings:", settings);
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/crop-info" element={<CropInfo />} />
            <Route path="/disease-detection" element={<DiseaseDetection />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Admin />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="crops" element={<CropsManagement />} />
              <Route path="crops/new" element={<CropForm />} />
              <Route path="crops/edit/:id" element={<CropForm />} />
              <Route path="solutions" element={<SolutionsManagement />} />
              <Route path="solutions/new" element={<SolutionForm />} />
              <Route path="solutions/edit/:id" element={<SolutionForm />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
