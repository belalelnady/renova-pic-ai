'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AITool } from './AIToolSelector';

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed' | 'timeout';

interface PhotoProcessorProps {
  file: File;
  aiTool: AITool;
  onProcessingComplete?: (originalUrl: string, editedUrl: string) => void;
  onProcessingError?: (error: string) => void;
  className?: string;
}

interface ProcessingResult {
  originalUrl: string;
  editedUrl: string;
  processingTime: number;
}

export function PhotoProcessor({
  file,
  aiTool,
  onProcessingComplete,
  onProcessingError,
  className,
}: PhotoProcessorProps) {
  const t = useTranslations('photo');
  const { toast } = useToast();
  
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const simulateAIProcessing = useCallback(async (file: File, tool: AITool): Promise<ProcessingResult> => {
    const startTime = Date.now();
    
    // Simulate different processing times for different tools
    const processingTimes = {
      'visa-photo': 3000,
      'absher': 4000,
      'saudi-look': 5000,
      'baby-photo': 3500,
    };
    
    const totalTime = processingTimes[tool];
    const originalUrl = URL.createObjectURL(file);
    
    return new Promise((resolve, reject) => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 15;
        setProgress(Math.min(currentProgress, 95));
        
        const elapsed = Date.now() - startTime;
        setProcessingTime(Math.floor(elapsed / 1000));
        
        if (elapsed >= totalTime) {
          clearInterval(interval);
          setProgress(100);
          
          // Simulate 5% chance of failure
          if (Math.random() < 0.05) {
            reject(new Error('AI processing failed'));
            return;
          }
          
          // Create a mock edited URL (in real implementation, this would come from the AI service)
          const editedUrl = originalUrl; // For demo purposes, using same URL
          
          resolve({
            originalUrl,
            editedUrl,
            processingTime: Math.floor((Date.now() - startTime) / 1000),
          });
        }
      }, 200);
      
      // Simulate timeout after 60 seconds
      setTimeout(() => {
        if (currentProgress < 100) {
          clearInterval(interval);
          reject(new Error(t('processingTimeout')));
        }
      }, 60000);
    });
  }, [t]);

  const startProcessing = useCallback(async () => {
    setStatus('processing');
    setProgress(0);
    setProcessingTime(0);
    setError(null);
    setResult(null);

    try {
      const result = await simulateAIProcessing(file, aiTool);
      
      setResult(result);
      setStatus('completed');
      
      toast({
        title: t('processed'),
        description: `Photo processed successfully with ${aiTool}`,
      });
      
      onProcessingComplete?.(result.originalUrl, result.editedUrl);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Processing failed';
      setError(errorMessage);
      setStatus('failed');
      
      toast({
        title: t('failed'),
        description: errorMessage,
        variant: 'destructive',
      });
      
      onProcessingError?.(errorMessage);
    }
  }, [file, aiTool, simulateAIProcessing, toast, t, onProcessingComplete, onProcessingError]);

  const retry = useCallback(() => {
    startProcessing();
  }, [startProcessing]);

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
      case 'timeout':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'processing':
        return `${t('processing')} (${processingTime}s)`;
      case 'completed':
        return `${t('processed')} (${result?.processingTime}s)`;
      case 'failed':
        return t('failed');
      case 'timeout':
        return t('processingTimeout');
      default:
        return 'Ready to process';
    }
  };

  return (
    <div className={className}>
      <div className="bg-white border rounded-lg p-6 space-y-4">
        {/* Processing Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-medium text-gray-900">AI Photo Processing</h3>
              <p className="text-sm text-gray-600">{getStatusText()}</p>
            </div>
          </div>
          
          {status === 'idle' && (
            <Button onClick={startProcessing}>
              Start Processing
            </Button>
          )}
          
          {status === 'failed' && (
            <Button onClick={retry} variant="outline">
              {t('retry')}
            </Button>
          )}
        </div>

        {/* File Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">File:</span>
            <span className="font-medium">{file.name}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">AI Tool:</span>
            <span className="font-medium capitalize">{aiTool.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">Size:</span>
            <span className="font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
          </div>
        </div>

        {/* Progress Bar */}
        {status === 'processing' && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Processing... {Math.round(progress)}%</span>
              <span>{processingTime}s elapsed</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {status === 'failed' && error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Display */}
        {status === 'completed' && result && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Photo processed successfully in {result.processingTime} seconds. 
              Ready for before/after comparison.
            </AlertDescription>
          </Alert>
        )}

        {/* Processing Steps Indicator */}
        {status === 'processing' && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Processing Steps:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className={`flex items-center ${progress > 20 ? 'text-green-600' : ''}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${progress > 20 ? 'bg-green-600' : 'bg-gray-300'}`} />
                Uploading to AI service
              </div>
              <div className={`flex items-center ${progress > 50 ? 'text-green-600' : ''}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${progress > 50 ? 'bg-green-600' : 'bg-gray-300'}`} />
                Analyzing image content
              </div>
              <div className={`flex items-center ${progress > 80 ? 'text-green-600' : ''}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${progress > 80 ? 'bg-green-600' : 'bg-gray-300'}`} />
                Applying AI enhancements
              </div>
              <div className={`flex items-center ${progress >= 100 ? 'text-green-600' : ''}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${progress >= 100 ? 'bg-green-600' : 'bg-gray-300'}`} />
                Finalizing processed image
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}