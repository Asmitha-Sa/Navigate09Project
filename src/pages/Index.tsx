
import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, useAuth } from '@clerk/clerk-react';
import Header from '@/components/Header';
import UploadSection from '@/components/UploadSection';
import ResultsSection from '@/components/ResultsSection';
import RulesList from '@/components/RulesList';
import PdfReport from '@/components/PdfReport';
import ComplianceScore from '@/components/ComplianceScore';
import { analyzeImage } from '@/utils/geminiService';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
  const { isLoaded, userId } = useAuth();
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

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <motion.section 
        className="py-16 retail-gradient"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            AI-Powered Retail Compliance
          </motion.h1>
          <motion.p 
            className="text-xl max-w-2xl mx-auto mb-8 text-blue-50"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Upload store images to instantly validate compliance with industry standards
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SignedOut>
              <SignInButton>
                <Button 
                  className="bg-white text-retail-blue hover:bg-gray-100 mr-4"
                >
                  Sign In to Get Started
                </Button>
              </SignInButton>
            </SignedOut>
            
            <Button 
              className="bg-white text-retail-blue hover:bg-gray-100"
              onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Main Content */}
      <div className="flex-grow">
        <SignedIn>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVariants}>
              <UploadSection 
                onUpload={handleImageUpload} 
                isLoading={isAnalyzing} 
              />
            </motion.div>
            
            {/* Analysis Button Section */}
            {currentImage && !isAnalyzing && (
              <motion.div 
                className="container mx-auto px-4 max-w-3xl -mt-6 mb-12"
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    className="w-full bg-retail-blue hover:bg-blue-800 py-6"
                    onClick={handleAnalyzeImage}
                  >
                    Analyze Compliance Now
                  </Button>
                </motion.div>
              </motion.div>
            )}
            
            <motion.div variants={itemVariants}>
              <ResultsSection 
                isVisible={isAnalyzing || hasResults}
                isLoading={isAnalyzing}
                complianceResults={complianceResults}
              />
              
              {/* Add the compliance score component to the results section */}
              {complianceResults && !isAnalyzing && (
                <div className="container mx-auto px-4 max-w-3xl mb-8">
                  <ComplianceScore 
                    score={complianceResults.score} 
                    status={complianceResults.overallStatus} 
                  />
                  <PdfReport results={complianceResults} />
                </div>
              )}
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <RulesList />
            </motion.div>
          </motion.div>
        </SignedIn>
        
        <SignedOut>
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="bg-gray-50 max-w-lg mx-auto p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Sign In to Access</h2>
              <p className="mb-6 text-gray-600">
                Please sign in to upload and analyze retail compliance images.
              </p>
              <SignInButton>
                <Button className="bg-retail-blue hover:bg-blue-800">
                  Sign In Now
                </Button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>
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
