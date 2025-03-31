import { toast } from "sonner";

export interface CropInfo {
  id: number;
  name: string;
  category: string;
  season: string;
  waterRequirement: string;
  soilType: string;
  description: string;
  plantingInfo: string;
  careInfo: string;
  harvestingInfo: string;
}

export interface SolutionInfo {
  id: number;
  disease: string;
  organicSolution: string;
  chemicalSolution: string;
}

// The base URL for API calls - update this to your local server
const API_BASE_URL = 'http://localhost:5500';

// Function to fetch all crops from database
export const getAllCrops = async (): Promise<CropInfo[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/crops`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching crops:", error);
    toast.error("Failed to fetch crop information from database.");
    return [];
  }
};

// Function to fetch a single crop by ID
export const getCropById = async (id: number): Promise<CropInfo | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/crops/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching crop:", error);
    toast.error("Failed to fetch crop information.");
    return null;
  }
};

// Function to add or update a crop in the database
export const saveCrop = async (crop: Omit<CropInfo, 'id'> & { id?: number }): Promise<CropInfo | null> => {
  try {
    const method = crop.id ? 'PUT' : 'POST';
    const url = crop.id ? `${API_BASE_URL}/api/crops/${crop.id}` : `${API_BASE_URL}/api/crops`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(crop),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const savedCrop = await response.json();
    toast.success(`Crop ${crop.name} ${crop.id ? 'updated' : 'added'} successfully!`);
    return savedCrop;
  } catch (error) {
    console.error("Error saving crop:", error);
    toast.error("Failed to save crop information. Please try again.");
    return null;
  }
};

// Function to delete a crop from the database
export const deleteCrop = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/crops/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    toast.success("Crop deleted successfully!");
    return true;
  } catch (error) {
    console.error("Error deleting crop:", error);
    toast.error("Failed to delete crop. Please try again.");
    return false;
  }
};

// SOLUTION FUNCTIONS

// Function to fetch all solutions from the database
export const getAllSolutions = async (): Promise<SolutionInfo[]> => {
  try {
    console.log("Fetching solutions...");
    const response = await fetch(`${API_BASE_URL}/api/solutions`);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log("Solutions fetched:", data);
    return data;
  } catch (error) {
    console.error("Error fetching solutions:", error);
    toast.error("Failed to fetch solutions.");
    return [];
  }
};


// Function to fetch a single solution by ID
export const getSolutionById = async (id: number): Promise<SolutionInfo | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/solutions/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching solution:", error);
    toast.error("Failed to fetch solution.");
    return null;
  }
};

// Function to fetch a solution by disease name
export const getSolutionByDisease = async (name: string): Promise<SolutionInfo | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/solutions/disease/${name}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching solution by disease:", error);
    toast.error("No solution found for this disease.");
    return null;
  }
};

// Function to add or update a solution in the database
export const saveSolution = async (solution: Omit<SolutionInfo, 'id'> & { id?: number }): Promise<SolutionInfo | null> => {
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
    toast.success(`Solution for ${solution.disease} ${solution.id ? 'updated' : 'added'} successfully!`);
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
