
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getAllSolutions, deleteSolution, Solution } from '@/services/diseaseDetectionService';

const SolutionsManagement = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingSolution, setDeletingSolution] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const data = await getAllSolutions();
      setSolutions(data);
    } catch (error) {
      console.error("Error fetching solutions:", error);
      toast.error("Failed to load disease solutions");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingSolution(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (deletingSolution === null) return;
    
    try {
      const success = await deleteSolution(deletingSolution);
      if (success) {
        setSolutions(solutions.filter(solution => solution.id !== deletingSolution));
        toast.success("Solution deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting solution:", error);
      toast.error("Failed to delete solution");
    } finally {
      setShowDeleteDialog(false);
      setDeletingSolution(null);
    }
  };

  const filteredSolutions = solutions.filter(solution => 
    solution.disease.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by disease..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={() => navigate('/admin/solutions/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add New Solution
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Disease</TableHead>
                <TableHead>Organic Solution (Preview)</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSolutions.length > 0 ? (
                filteredSolutions.map(solution => (
                  <TableRow key={solution.id}>
                    <TableCell className="font-medium">{solution.disease}</TableCell>
                    <TableCell className="truncate max-w-[300px]">
                      {solution.organicSolution.length > 80 
                        ? `${solution.organicSolution.substring(0, 80)}...` 
                        : solution.organicSolution}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigate(`/admin/solutions/edit/${solution.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClick(solution.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No disease solutions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this disease solution? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SolutionsManagement;
