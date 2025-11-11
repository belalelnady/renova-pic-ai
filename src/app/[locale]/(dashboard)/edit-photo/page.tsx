'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PhotoUpload } from '@/components/photo/PhotoUpload';
import { AIToolSelector, AITool } from '@/components/photo/AIToolSelector';
import { PhotoProcessor } from '@/components/photo/PhotoProcessor';
import { BeforeAfterSlider } from '@/components/photo/BeforeAfterSlider';
import { PrintOptions } from '@/components/photo/PrintOptions';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { EditingSettings } from '@/types';
import { PricingBreakdown } from '@/lib/pricing';

type EditingStep = 'upload' | 'select-tool' | 'processing' | 'completed' | 'customize';

export default function EditPhoto() {
  const t = useTranslations('navigation');
  const [currentStep, setCurrentStep] = useState<EditingStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [editedUrl, setEditedUrl] = useState<string | null>(null);
  const [printSettings, setPrintSettings] = useState<EditingSettings & { totalPrice: number; breakdown: PricingBreakdown } | null>(null);

  const handleUploadComplete = (file: File, url: string) => {
    setUploadedFile(file);
    setUploadedUrl(url);
    setCurrentStep('select-tool');
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    // Error is already handled by the PhotoUpload component with toast
  };

  const handleToolSelect = (tool: AITool) => {
    setSelectedTool(tool);
  };

  const handleStartProcessing = () => {
    if (selectedTool && uploadedFile) {
      setCurrentStep('processing');
    }
  };

  const handleProcessingComplete = (originalUrl: string, editedUrl: string) => {
    setOriginalUrl(originalUrl);
    setEditedUrl(editedUrl);
    setCurrentStep('completed');
  };

  const handleCustomizeClick = () => {
    setCurrentStep('customize');
  };

  const handlePrintSettingsChange = (settings: EditingSettings & { totalPrice: number; breakdown: PricingBreakdown }) => {
    setPrintSettings(settings);
  };

  const handleAddToCart = async () => {
    if (!printSettings || !editedUrl || !selectedTool) return;
    
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', {
      editedUrl,
      aiTool: selectedTool,
      settings: printSettings
    });
    
    // For now, just show success message
    alert('Photo added to cart! (Cart functionality coming soon)');
  };

  const handleProcessingError = (error: string) => {
    console.error('Processing error:', error);
    // Error is already handled by the PhotoProcessor component with toast
  };

  const handleStartOver = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setUploadedUrl(null);
    setSelectedTool(null);
    setOriginalUrl(null);
    setEditedUrl(null);
    setPrintSettings(null);
  };

  const handleBackToToolSelection = () => {
    setCurrentStep('select-tool');
  };

  const handleBackToCompleted = () => {
    setCurrentStep('completed');
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-start">{t('editPhoto')}</h1>
          
          {/* Back Button */}
          {currentStep !== 'upload' && (
            <Button
              variant="outline"
              onClick={() => {
                if (currentStep === 'select-tool') handleStartOver();
                else if (currentStep === 'processing') handleBackToToolSelection();
                else if (currentStep === 'customize') handleBackToCompleted();
                else handleBackToToolSelection();
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {currentStep === 'select-tool' ? 'Start Over' : 'Back'}
            </Button>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep === 'upload' ? 'bg-primary text-white' : 
              ['select-tool', 'processing', 'completed', 'customize'].includes(currentStep) ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`h-0.5 w-16 ${
              ['select-tool', 'processing', 'completed', 'customize'].includes(currentStep) ? 'bg-green-600' : 'bg-gray-200'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep === 'select-tool' ? 'bg-primary text-white' : 
              ['processing', 'completed', 'customize'].includes(currentStep) ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`h-0.5 w-16 ${
              ['processing', 'completed', 'customize'].includes(currentStep) ? 'bg-green-600' : 'bg-gray-200'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep === 'processing' ? 'bg-primary text-white' : 
              ['completed', 'customize'].includes(currentStep) ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <div className={`h-0.5 w-16 ${
              ['customize'].includes(currentStep) ? 'bg-green-600' : 'bg-gray-200'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep === 'customize' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              4
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Step 1: Photo Upload */}
          {currentStep === 'upload' && (
            <section>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Step 1: Upload Your Photo</h2>
                <p className="text-gray-600">Choose a photo to edit with AI-powered tools</p>
              </div>
              <PhotoUpload
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
              />
            </section>
          )}

          {/* Step 2: AI Tool Selection */}
          {currentStep === 'select-tool' && uploadedFile && (
            <section>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Step 2: Choose AI Tool</h2>
                <p className="text-gray-600">Select the AI editing tool for your photo</p>
              </div>
              
              {/* Show uploaded photo preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      📷
                    </div>
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <AIToolSelector
                onToolSelect={handleToolSelect}
                selectedTool={selectedTool || undefined}
              />

              {selectedTool && (
                <div className="flex justify-center mt-6">
                  <Button onClick={handleStartProcessing} size="lg">
                    Start AI Processing
                  </Button>
                </div>
              )}
            </section>
          )}

          {/* Step 3: Processing */}
          {currentStep === 'processing' && uploadedFile && selectedTool && (
            <section>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Step 3: AI Processing</h2>
                <p className="text-gray-600">Your photo is being processed with AI technology</p>
              </div>
              
              <PhotoProcessor
                file={uploadedFile}
                aiTool={selectedTool}
                onProcessingComplete={handleProcessingComplete}
                onProcessingError={handleProcessingError}
              />
            </section>
          )}

          {/* Step 4: Completed */}
          {currentStep === 'completed' && originalUrl && editedUrl && (
            <section>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Processing Complete!</h2>
                <p className="text-gray-600">Compare your original and edited photos</p>
              </div>
              
              <BeforeAfterSlider
                originalUrl={originalUrl}
                editedUrl={editedUrl}
                originalTitle={uploadedFile?.name || 'Original'}
                editedTitle={`${uploadedFile?.name || 'Photo'} - ${selectedTool?.replace('-', ' ')}`}
                onDownloadOriginal={() => {
                  // Create download link for original
                  const link = document.createElement('a');
                  link.href = originalUrl;
                  link.download = `original-${uploadedFile?.name || 'photo'}`;
                  link.click();
                }}
                onDownloadEdited={() => {
                  // Create download link for edited
                  const link = document.createElement('a');
                  link.href = editedUrl;
                  link.download = `edited-${uploadedFile?.name || 'photo'}`;
                  link.click();
                }}
              />
              
              <div className="mt-8 text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-green-800 mb-2">
                    🎉 Photo Processing Complete!
                  </h3>
                  <p className="text-green-600 mb-4">
                    Your photo has been successfully processed with {selectedTool?.replace('-', ' ')}.
                  </p>
                  <p className="text-sm text-gray-600">
                    Use the comparison tools above to see the difference, then download your edited photo.
                  </p>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <Button onClick={handleStartOver} variant="outline">
                    Edit Another Photo
                  </Button>
                  <Button onClick={handleCustomizeClick} className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Customize & Order
                  </Button>
                </div>
              </div>
            </section>
          )}

          {/* Step 5: Customize Print Options */}
          {currentStep === 'customize' && selectedTool && editedUrl && (
            <section>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Step 4: Customize Your Print</h2>
                <p className="text-gray-600">Choose print options and add to cart</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Photo Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Your Edited Photo</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <img 
                      src={editedUrl} 
                      alt="Edited photo preview"
                      className="w-full h-64 object-contain rounded-lg"
                    />
                    <div className="mt-3 text-center">
                      <p className="text-sm text-gray-600">
                        {uploadedFile?.name} - {selectedTool.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Print Options */}
                <div className="space-y-4">
                  <PrintOptions
                    aiTool={selectedTool}
                    onSettingsChange={handlePrintSettingsChange}
                  />
                  
                  {printSettings && (
                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={handleAddToCart}
                        size="lg"
                        className="w-full flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart - {printSettings.breakdown.totalPrice} SAR
                      </Button>
                      
                      <Button 
                        onClick={handleBackToCompleted}
                        variant="outline"
                        size="lg"
                        className="w-full"
                      >
                        Back to Preview
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}