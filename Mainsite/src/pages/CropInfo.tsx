
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { getAllCrops, CropInfo as CropInfoType } from '@/services/cropInfoService';
import { toast } from "sonner";

const CropInfo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCrop, setExpandedCrop] = useState<number | null>(null);
  const [crops, setCrops] = useState<CropInfoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const cropData = await getAllCrops();
        setCrops(cropData);
      } catch (error) {
        console.error("Failed to fetch crops:", error);
        toast.error("Failed to load crop information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, []);

  const filteredCrops = crops.filter(crop => 
    crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.season.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled through state
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Crop Information</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <Input 
              type="text"
              placeholder="Search crops by name, category or season..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-primary focus:ring-primary"
            />
            <Button type="submit" className="bg-primary hover:bg-primary-light">
              <Search size={20} />
            </Button>
          </div>
        </form>
        
        {/* Crop List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading crop information...</p>
          ) : filteredCrops.length === 0 ? (
            <p className="text-center text-gray-500">No crops found matching your search</p>
          ) : (
            filteredCrops.map(crop => (
              <Card key={crop.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => setExpandedCrop(expandedCrop === crop.id ? null : crop.id)}
                  >
                    <h3 className="text-xl font-semibold">{crop.name}</h3>
                    <Button variant="ghost">
                      {expandedCrop === crop.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </Button>
                  </div>
                  
                  {expandedCrop === crop.id && (
                    <div className="border-t p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-500">Category</p>
                          <p>{crop.category}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-500">Season</p>
                          <p>{crop.season}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-500">Water Requirement</p>
                          <p>{crop.waterRequirement}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-500">Soil Type</p>
                        <p>{crop.soilType}</p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-500">Description</p>
                        <p>{crop.description}</p>
                      </div>
                      
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="planting">
                          <AccordionTrigger className="text-primary">Planting Information</AccordionTrigger>
                          <AccordionContent>{crop.plantingInfo}</AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="care">
                          <AccordionTrigger className="text-primary">Care Instructions</AccordionTrigger>
                          <AccordionContent>{crop.careInfo}</AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="harvesting">
                          <AccordionTrigger className="text-primary">Harvesting Guide</AccordionTrigger>
                          <AccordionContent>{crop.harvestingInfo}</AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CropInfo;
