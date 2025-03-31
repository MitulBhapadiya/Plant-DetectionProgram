
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Database, FileText, Settings, Grid2X2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const Admin = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-md ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b flex items-center justify-between">
          {!collapsed && <h2 className="text-lg font-semibold text-primary">Admin Panel</h2>}
          <Button 
            variant="ghost" 
            size="sm" 
            className={collapsed ? "mx-auto" : ""}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "→" : "←"}
          </Button>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-1">
            <li>
              <Link 
                to="/admin/dashboard" 
                className={`flex items-center p-2 rounded-md hover:bg-gray-100 ${
                  location.pathname === '/admin/dashboard' ? 'bg-gray-100 text-primary' : 'text-gray-700'
                }`}
              >
                <Grid2X2 className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/crops" 
                className={`flex items-center p-2 rounded-md hover:bg-gray-100 ${
                  location.pathname.startsWith('/admin/crops') ? 'bg-gray-100 text-primary' : 'text-gray-700'
                }`}
              >
                <FileText className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Crop Information</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/solutions" 
                className={`flex items-center p-2 rounded-md hover:bg-gray-100 ${
                  location.pathname.startsWith('/admin/solutions') ? 'bg-gray-100 text-primary' : 'text-gray-700'
                }`}
              >
                <Database className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Disease Solutions</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/settings" 
                className={`flex items-center p-2 rounded-md hover:bg-gray-100 ${
                  location.pathname === '/admin/settings' ? 'bg-gray-100 text-primary' : 'text-gray-700'
                }`}
              >
                <Settings className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <Link to="/" className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
            {!collapsed && <span>Exit Admin</span>}
            {collapsed && <span>←</span>}
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-xl font-bold text-primary">
            {location.pathname.includes('/admin/dashboard') && 'Dashboard'}
            {location.pathname.includes('/admin/crops') && 'Manage Crop Information'}
            {location.pathname.includes('/admin/solutions') && 'Manage Disease Solutions'}
            {location.pathname.includes('/admin/settings') && 'Admin Settings'}
          </h1>
        </header>
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin;
