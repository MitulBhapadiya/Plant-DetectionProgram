
import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Bug, Cloud, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from '@/components/Navbar';
import WeatherWidget from '@/components/WeatherWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-accent py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">किशान मार्गदर्शन</h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Farmer's Guide</h2>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8">
            Helping farmers identify crop diseases and providing solutions for better harvests
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/crop-info">
                <Sprout className="mr-2" size={20} />
                Crop Information
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/disease-detection">
                <Bug className="mr-2" size={20} />
                Disease Recognition
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Weather Widget */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Current Weather</h2>
        <div className="max-w-md mx-auto">
          <WeatherWidget />
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">How We Can Help</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-primary mb-4">
                <Sprout size={48} />
              </div>
              <h3 className="text-xl font-bold mb-2">Crop Information</h3>
              <p className="text-gray-600 mb-4">
                Access detailed information about various crops, including planting techniques, 
                water requirements, ideal seasons, and harvesting tips.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <Link to="/crop-info" className="flex items-center">
                  Learn More <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-primary mb-4">
                <Bug size={48} />
              </div>
              <h3 className="text-xl font-bold mb-2">Disease Recognition</h3>
              <p className="text-gray-600 mb-4">
                Upload photos of plant leaves to identify diseases and get recommendations 
                for both organic and chemical solutions.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <Link to="/disease-detection" className="flex items-center">
                  Try Now <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
