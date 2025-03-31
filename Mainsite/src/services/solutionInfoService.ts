import { toast } from "sonner";
import { Solution } from './diseaseDetectionService';

// The base URL for API calls
const API_BASE_URL = 'http://localhost:5500';

// Function to fetch all solutions from database
export const getAllSolutions = async (): Promise<Solution[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/solutions`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching solutions:", error);
    toast.error("Failed to fetch solution information from database.");
    return [];
  }
};

// Function to fetch a single solution by ID
export const getSolutionById = async (id: number): Promise<Solution | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/solutions/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching solution:", error);
    toast.error("Failed to fetch solution information.");
    return null;
  }
};

// Function to add or update a solution in the database
export const saveSolution = async (solution: Omit<Solution, 'id'> & { id?: number }): Promise<Solution | null> => {
  try {
    const method = solution.id ? 'PUT' : 'POST';
    const url = solution.id ? `${API_BASE_URL}/api/solutions/${solution.id}` : `${API_BASE_URL}/api/solutions`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(solution),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const savedSolution = await response.json();
    toast.success(`Solution ${solution.disease} ${solution.id ? 'updated' : 'added'} successfully!`);
    return savedSolution;
  } catch (error) {
    console.error("Error saving solution:", error);
    toast.error("Failed to save solution information. Please try again.");
    return null;
  }
};

// Function to delete a solution from the database
export const deleteSolution = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/solutions/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    toast.success("Solution deleted successfully!");
    return true;
  } catch (error) {
    console.error("Error deleting solution:", error);
    toast.error("Failed to delete solution. Please try again.");
    return false;
  }
};

// Function to get solution by disease name
export const getSolutionByDisease = async (disease: string): Promise<Solution | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/solutions/disease/${disease}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        // If no solution exists, return null (not an error)
        return null;
      }
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching solution by disease:", error);
    return null;
  }
};

// Function to test database connection
export const testDbConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/test`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
};
