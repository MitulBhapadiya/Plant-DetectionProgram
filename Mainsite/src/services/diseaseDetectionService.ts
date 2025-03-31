
import { toast } from "sonner";

export interface DiseaseDetectionResult {
  disease: string;
  confidence: number;
  organicSolution: string;
  chemicalSolution: string;
}

export interface Solution {
  id: number;
  disease: string;
  organicSolution: string;
  chemicalSolution: string;
}

// The base URL for API calls - update this to your local server
const API_BASE_URL = 'http://localhost:5500';

// Function to analyze plant image using the Python model
export const analyzePlantImage = async (
  imageFile: File
): Promise<DiseaseDetectionResult> => {
  try {
    // Create form data to send the image
    const formData = new FormData();
    formData.append("file", imageFile);

    // Send the image to your Python model API
    // Replace this URL with the actual endpoint where your Python model is hosted
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Parse the response from your model
    const data = await response.json();
    
    // Fetch solution from the database
    const solution = await fetchSolutionByDisease(data.disease);
    
    // Return the disease detection result
    return {
      disease: data.disease,
      confidence: data.confidence,
      organicSolution: solution?.organicSolution || getDefaultOrganicSolution(data.disease),
      chemicalSolution: solution?.chemicalSolution || getDefaultChemicalSolution(data.disease),
    };
  } catch (error) {
    console.error("Error analyzing plant image:", error);
    toast.error("Failed to analyze image. Please try again.");
    throw error;
  }
};

// Function to fetch solution from database by disease name
export const fetchSolutionByDisease = async (disease: string): Promise<Solution | null> => {
  try {
    // In a real implementation, you would search by disease name
    // For now, we'll get all solutions and filter client-side
    const solutions = await getAllSolutions();
    const matchingSolution = solutions.find(s => s.disease.toLowerCase() === disease.toLowerCase());
    return matchingSolution || null;
  } catch (error) {
    console.error("Error fetching solution:", error);
    return null;
  }
};

// Function to get all solutions from database
export const getAllSolutions = async (): Promise<Solution[]> => {
  try {
    const response = await fetch(`http://localhost:5500/api/solutions`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching solutions:", error);
    toast.error("Failed to fetch solutions from database.");
    return [];
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
    toast.success(`Solution for ${solution.disease} ${solution.id ? 'updated' : 'added'} successfully!`);
    return savedSolution;
  } catch (error) {
    console.error("Error saving solution:", error);
    toast.error("Failed to save solution. Please try again.");
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

// Helper functions to provide default solutions if database doesn't return them
const getDefaultOrganicSolution = (disease: string): string => {
  const organicSolutions: Record<string, string> = {
    "Late Blight": "Mix 1 tablespoon of baking soda, 2.5 tablespoons of vegetable oil, and a few drops of liquid soap in 1 gallon of water. Spray on plants every 7-14 days.",
    "Early Blight": "Apply neem oil spray or a mixture of 2 tablespoons of apple cider vinegar in 1 quart of water.",
    "Powdery Mildew": "Mix 1 tablespoon of baking soda with 1 teaspoon of mild soap and 1 gallon of water. Spray on affected areas.",
    // Add more default organic solutions for other diseases
  };

  return organicSolutions[disease] || 
    "Apply a mixture of neem oil and water according to package instructions. Regularly remove affected leaves and ensure proper plant spacing.";
};

const getDefaultChemicalSolution = (disease: string): string => {
  const chemicalSolutions: Record<string, string> = {
    "Late Blight": "Apply Chlorothalonil or Mancozeb based fungicide according to package instructions. Reapply every 7-10 days during favorable disease conditions.",
    "Early Blight": "Use copper-based fungicides or products containing chlorothalonil. Apply according to product instructions.",
    "Powdery Mildew": "Apply sulfur-based fungicides or myclobutanil according to label instructions.",
    // Add more default chemical solutions for other diseases
  };

  return chemicalSolutions[disease] || 
    "Apply a broad-spectrum fungicide containing copper or sulfur compounds. Follow product instructions for application rates and frequency.";
};
