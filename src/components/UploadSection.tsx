
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface UploadSectionProps {
  onUpload: (image: File) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  hasImage: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onUpload, onAnalyze, isLoading, hasImage }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    setError(null);
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Pass to parent
    onUpload(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <section id="upload" className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-retail-dark mb-2">Upload Store Image</h2>
            <p className="text-gray-600">
              Upload an image of your retail space to check compliance against industry standards
            </p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div
                className={`upload-container ${dragActive ? 'pulse-border' : 'border-gray-300'} ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleButtonClick}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                />
                
                {error && (
                  <div className="text-center text-red-500 mb-4 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>{error}</span>
                  </div>
                )}
                
                {preview ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="max-h-64 object-contain mb-4 rounded-lg" 
                    />
                    <p className="text-sm text-gray-500">Click or drag to upload a different image</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 p-6 rounded-full mb-4">
                      <ImageIcon className="h-12 w-12 text-retail-blue" />
                    </div>
                    <p className="text-lg font-medium mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 10MB)</p>
                  </div>
                )}
              </div>
              
              {hasImage && (
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button 
                    className="w-full bg-retail-blue hover:bg-blue-800 py-6 text-lg"
                    disabled={isLoading}
                    onClick={onAnalyze}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing with Gemini AI...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Upload className="mr-2 h-5 w-5" /> 
                        Analyze Compliance with Gemini AI
                      </span>
                    )}
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
