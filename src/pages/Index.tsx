
import React, { useState } from 'react';
import Header from '@/components/Header';
import UploadSection from '@/components/UploadSection';
import ResultsSection from '@/components/ResultsSection';
import RulesList from '@/components/RulesList';
import { analyzeImage } from '@/utils/geminiService';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';

interface ComplianceIssue {
  rule: string;
  description: string;
  status: 'pass' | 'fail' | 'warning';
  details?: string;
}

interface ComplianceResult {
  overallStatus: 'compliant' | 'non-compliant' | 'partial';
  score: number;
  issues: ComplianceIssue[];
  summary: string;
}

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [complianceResults, setComplianceResults] = useState<ComplianceResult | null>(null);
  const [currentImage, setCurrentImage] = useState<File | null>(null);

  const handleImageUpload = (image: File) => {
    setCurrentImage(image);
    setHasResults(false);
  };

  const handleAnalyzeImage = async () => {
    if (!currentImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Scroll to results section
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      const results = await analyzeImage(currentImage);
      setComplianceResults(results);
      setHasResults(true);
      
      // Show toast based on compliance status
      if (results.overallStatus === 'compliant') {
        toast.success('Store is fully compliant!');
      } else if (results.overallStatus === 'partial') {
        toast.warning('Store is partially compliant with some issues.');
      } else {
        toast.error('Store is non-compliant with significant issues.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 retail-gradient">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            AI-Powered Retail Compliance
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8 text-blue-50">
            Upload store images to instantly validate compliance with industry standards
          </p>
          <Button 
            className="bg-white text-retail-blue hover:bg-gray-100"
            onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get Started
          </Button>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="flex-grow">
        <UploadSection 
          onUpload={handleImageUpload} 
          isLoading={isAnalyzing} 
        />
        
        {/* Analysis Button Section */}
        {currentImage && !isAnalyzing && (
          <div className="container mx-auto px-4 max-w-3xl -mt-6 mb-12">
            <Button 
              className="w-full bg-retail-blue hover:bg-blue-800 py-6"
              onClick={handleAnalyzeImage}
            >
              Analyze Compliance Now
            </Button>
          </div>
        )}
        
        <ResultsSection 
          isVisible={isAnalyzing || hasResults}
          isLoading={isAnalyzing}
          complianceResults={complianceResults}
        />
        
        <RulesList />
      </div>
      
      {/* Footer */}
      <footer className="bg-retail-dark text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            AI Retail Compliance Validator | Powered by Gemini Flash 2.0
          </p>
          <p className="text-xs mt-2 text-gray-400">
            © {new Date().getFullYear()} Retail Compliance Technologies
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
