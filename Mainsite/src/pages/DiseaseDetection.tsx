import React, { useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import { analyzePlantImage, DiseaseDetectionResult } from '@/services/diseaseDetectionService';
import { toast } from "sonner";

const DiseaseDetection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG)');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setError(null);
    setSelectedFile(file);
    
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select an image to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Call the API service to analyze the image
      const detectionResult = await analyzePlantImage(selectedFile);
      setResult(detectionResult);
      toast.success("Image analysis complete!");
    } catch (err) {
      setError('Failed to analyze the image. Please try again.');
      console.error("Error in disease detection:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary text-center">Plant Disease Recognition</h1>
        
        <div className="max-w-3xl mx-auto">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!result ? (
            <Card>
              <CardHeader>
                <CardTitle>Upload Plant Image</CardTitle>
                <CardDescription>
                  Take a clear photo of the affected plant leaf and upload it for disease analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-2">
                      <div 
                        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${
                          previewUrl ? 'border-primary' : 'border-gray-300'
                        }`}
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        {previewUrl ? (
                          <div className="relative w-full">
                            <img 
                              src={previewUrl} 
                              alt="Preview" 
                              className="mx-auto max-h-64 object-contain rounded-lg" 
                            />
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                resetForm();
                              }}
                              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                            >
                              <X className="h-5 w-5 text-gray-500" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 text-center">
                              Click to upload or drag and drop<br />
                              PNG, JPG (max. 5MB)
                            </p>
                          </>
                        )}
                        <input 
                          id="file-upload" 
                          type="file"
                          accept="image/jpeg, image/png"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button 
                      type="submit" 
                      disabled={isAnalyzing || !selectedFile}
                      className="w-full md:w-auto"
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      Analysis Complete
                    </CardTitle>
                    <CardDescription>
                      Confidence: {result.confidence}%
                    </CardDescription>
                  </div>
                  {previewUrl && (
                    <img 
                      src={previewUrl} 
                      alt="Analyzed leaf" 
                      className="h-16 w-16 object-cover rounded-md" 
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-semibold text-lg text-red-600 mb-2">Detected Disease: {result.disease}</h3>
                  <p className="text-sm text-gray-600">
                    The analysis shows signs of {result.disease} in your plant. Please select a treatment approach below.
                  </p>
                </div>
                
                <Tabs defaultValue="organic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="organic">Organic Solution</TabsTrigger>
                    <TabsTrigger value="chemical">Chemical Solution</TabsTrigger>
                  </TabsList>
                  <TabsContent value="organic" className="p-4 bg-green-50 rounded-md mt-2">
                    <h4 className="font-medium mb-2 text-primary">Recommended Organic Treatment</h4>
                    <p>{result.organicSolution}</p>
                  </TabsContent>
                  <TabsContent value="chemical" className="p-4 bg-blue-50 rounded-md mt-2">
                    <h4 className="font-medium mb-2 text-blue-700">Recommended Chemical Treatment</h4>
                    <p>{result.chemicalSolution}</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetForm}>
                  Analyze Another Image
                </Button>
                <Button>
                  Save Results
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-primary">How It Works</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Take a clear photo of the affected plant leaf</li>
              <li>Upload the image using the form above</li>
              <li>Our AI system will analyze the image to identify the disease</li>
              <li>Review both organic and chemical treatment recommendations</li>
              <li>Apply the preferred solution following the instructions</li>
            </ol>
            <p className="mt-4 text-sm text-gray-500">
              For best results, ensure the photo is clear, well-lit, and focuses on the affected area of the plant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
