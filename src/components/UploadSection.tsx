
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface UploadSectionProps {
  onUpload: (image: File) => void;
  isLoading: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onUpload, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
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
              
              <div className="mt-6">
                <Button 
                  className="w-full bg-retail-blue hover:bg-blue-800"
                  disabled={!preview || isLoading}
                  onClick={() => {}}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⚙️</span> 
                      Analyzing Image...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Upload className="mr-2 h-4 w-4" /> 
                      Verify Compliance
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
