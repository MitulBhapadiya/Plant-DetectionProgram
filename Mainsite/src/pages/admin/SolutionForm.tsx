
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { saveSolution, Solution, fetchSolutionByDisease } from '@/services/diseaseDetectionService';
import { toast } from "sonner";

const defaultSolution = {
  disease: '',
  organicSolution: '',
  chemicalSolution: '',
};

const SolutionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solution, setSolution] = useState<Omit<Solution, 'id'> & { id?: number }>(defaultSolution);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const fetchSolution = async () => {
        try {
          setLoading(true);
          // In a real app, you would fetch from an API endpoint like /api/solutions/:id
          // For now, we're using a mock implementation
          const result = await fetch(`/api/solutions/${id}`).then(res => res.json());
          if (result) {
            setSolution(result);
          } else {
            toast.error("Solution not found");
            navigate('/admin/solutions');
          }
        } catch (error) {
          console.error("Error fetching solution:", error);
          toast.error("Failed to load solution data");
        } finally {
          setLoading(false);
        }
      };

      fetchSolution();
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSolution(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const savedSolution = await saveSolution(solution);
      if (savedSolution) {
        toast.success(`Solution ${isEditing ? 'updated' : 'added'} successfully`);
        navigate('/admin/solutions');
      }
    } catch (error) {
      console.error("Error saving solution:", error);
      toast.error("Failed to save disease solution");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading solution information...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Solution' : 'Add New Solution'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="disease">Disease Name</Label>
            <Input
              id="disease"
              name="disease"
              placeholder="e.g., Late Blight, Powdery Mildew"
              value={solution.disease}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="organicSolution">Organic Solution</Label>
            <Textarea
              id="organicSolution"
              name="organicSolution"
              placeholder="Describe organic remedies and treatments"
              rows={5}
              value={solution.organicSolution}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chemicalSolution">Chemical Solution</Label>
            <Textarea
              id="chemicalSolution"
              name="chemicalSolution"
              placeholder="Describe chemical treatments and applications"
              rows={5}
              value={solution.chemicalSolution}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => navigate('/admin/solutions')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : (isEditing ? 'Update Solution' : 'Add Solution')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SolutionForm;
