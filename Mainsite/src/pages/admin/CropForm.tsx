
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { saveCrop, getCropById, CropInfo } from '@/services/cropInfoService';
import { toast } from "sonner";

const defaultCrop = {
  name: '',
  category: '',
  season: '',
  waterRequirement: '',
  soilType: '',
  description: '',
  plantingInfo: '',
  careInfo: '',
  harvestingInfo: '',
};

const CropForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState<Omit<CropInfo, 'id'> & { id?: number }>(defaultCrop);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const fetchCrop = async () => {
        try {
          setLoading(true);
          const data = await getCropById(Number(id));
          if (data) {
            setCrop(data);
          } else {
            toast.error("Crop not found");
            navigate('/admin/crops');
          }
        } catch (error) {
          console.error("Error fetching crop:", error);
          toast.error("Failed to load crop data");
        } finally {
          setLoading(false);
        }
      };

      fetchCrop();
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCrop(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setCrop(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const savedCrop = await saveCrop(crop);
      if (savedCrop) {
        toast.success(`Crop ${isEditing ? 'updated' : 'added'} successfully`);
        navigate('/admin/crops');
      }
    } catch (error) {
      console.error("Error saving crop:", error);
      toast.error("Failed to save crop information");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading crop information...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Crop' : 'Add New Crop'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Crop Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Rice (धान)"
                value={crop.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={crop.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cereal">Cereal</SelectItem>
                  <SelectItem value="Pulse">Pulse</SelectItem>
                  <SelectItem value="Oilseed">Oilseed</SelectItem>
                  <SelectItem value="Fiber">Fiber</SelectItem>
                  <SelectItem value="Vegetable">Vegetable</SelectItem>
                  <SelectItem value="Fruit">Fruit</SelectItem>
                  <SelectItem value="Cash Crop">Cash Crop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Select
                value={crop.season}
                onValueChange={(value) => handleSelectChange('season', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select growing season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kharif">Kharif</SelectItem>
                  <SelectItem value="Rabi">Rabi</SelectItem>
                  <SelectItem value="Zaid">Zaid</SelectItem>
                  <SelectItem value="Year-round">Year-round</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="waterRequirement">Water Requirement</Label>
              <Select
                value={crop.waterRequirement}
                onValueChange={(value) => handleSelectChange('waterRequirement', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select water requirement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="soilType">Soil Type</Label>
            <Input
              id="soilType"
              name="soilType"
              placeholder="e.g., Loamy soil, Clay soil"
              value={crop.soilType}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide a general description of the crop"
              rows={3}
              value={crop.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="plantingInfo">Planting Information</Label>
            <Textarea
              id="plantingInfo"
              name="plantingInfo"
              placeholder="Instructions for planting this crop"
              rows={3}
              value={crop.plantingInfo}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="careInfo">Care Instructions</Label>
            <Textarea
              id="careInfo"
              name="careInfo"
              placeholder="Details on how to care for this crop"
              rows={3}
              value={crop.careInfo}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="harvestingInfo">Harvesting Guide</Label>
            <Textarea
              id="harvestingInfo"
              name="harvestingInfo"
              placeholder="Information about when and how to harvest"
              rows={3}
              value={crop.harvestingInfo}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => navigate('/admin/crops')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : (isEditing ? 'Update Crop' : 'Add Crop')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CropForm;
