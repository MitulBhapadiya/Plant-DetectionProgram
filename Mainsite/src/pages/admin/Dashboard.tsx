
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllCrops } from '@/services/cropInfoService';
import { getAllSolutions } from '@/services/diseaseDetectionService';
import { CheckCircle, XCircle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCrops: 0,
    totalSolutions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    message: 'Checking database connection...'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [crops, solutions] = await Promise.all([
          getAllCrops(),
          getAllSolutions()
        ]);
        
        setStats({
          totalCrops: crops.length,
          totalSolutions: solutions.length,
        });
        
        // If we got data, assume the database is connected
        setDbStatus({
          connected: true,
          message: 'Connected to MySQL database'
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setDbStatus({
          connected: false,
          message: 'Failed to connect to database. Check your API server.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome to Admin Dashboard</h2>
      
      {/* Database Connection Status */}
      <Card className={dbStatus.connected ? "bg-green-50" : "bg-red-50"}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            {dbStatus.connected ? 
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> : 
              <XCircle className="h-5 w-5 text-red-500 mr-2" />}
            Database Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={dbStatus.connected ? "text-green-700" : "text-red-700"}>
            {dbStatus.message}
          </p>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Crops</CardTitle>
            <CardDescription>Number of crops in database</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {loading ? "..." : stats.totalCrops}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Disease Solutions</CardTitle>
            <CardDescription>Total solutions in database</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {loading ? "..." : stats.totalSolutions}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <a href="/admin/crops/new" className="text-primary hover:underline">Add New Crop</a>
          <a href="/admin/solutions/new" className="text-primary hover:underline">Add New Disease Solution</a>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
