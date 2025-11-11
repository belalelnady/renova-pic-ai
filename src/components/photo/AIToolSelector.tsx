'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type AITool = 'visa-photo' | 'absher' | 'saudi-look' | 'baby-photo';

interface AIToolOption {
  id: AITool;
  name: string;
  description: string;
  category: string;
  previewImage?: string;
  features: string[];
}

interface AIToolSelectorProps {
  onToolSelect: (tool: AITool) => void;
  selectedTool?: AITool;
  disabled?: boolean;
  className?: string;
}

export function AIToolSelector({
  onToolSelect,
  selectedTool,
  disabled = false,
  className,
}: AIToolSelectorProps) {
  const t = useTranslations('photo');
  
  const aiTools: AIToolOption[] = [
    {
      id: 'visa-photo',
      name: t('visaPhoto'),
      description: 'Professional visa and passport photo editing with background removal and sizing',
      category: 'Official Documents',
      features: ['Background removal', 'Standard sizing', 'Professional lighting'],
    },
    {
      id: 'absher',
      name: t('absherPhoto'),
      description: 'Specialized photo editing for Saudi Absher platform requirements',
      category: 'Government Services',
      features: ['Absher compliance', 'Proper dimensions', 'Quality enhancement'],
    },
    {
      id: 'saudi-look',
      name: t('saudiLook'),
      description: 'Traditional Saudi styling and cultural appearance enhancement',
      category: 'Cultural Enhancement',
      features: ['Traditional styling', 'Cultural authenticity', 'Enhanced appearance'],
    },
    {
      id: 'baby-photo',
      name: t('babyPhoto'),
      description: 'Gentle photo enhancement specifically designed for baby and children photos',
      category: 'Family & Children',
      features: ['Gentle enhancement', 'Skin smoothing', 'Natural colors'],
    },
  ];

  const handleToolSelect = (tool: AITool) => {
    if (!disabled) {
      onToolSelect(tool);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">{t('selectTool')}</h2>
        <p className="text-gray-600">{t('toolDescription')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiTools.map((tool) => (
          <Card
            key={tool.id}
            className={cn(
              'cursor-pointer transition-all duration-200 hover:shadow-md',
              selectedTool === tool.id
                ? 'ring-2 ring-primary border-primary'
                : 'hover:border-gray-300',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => handleToolSelect(tool.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {tool.category}
                  </Badge>
                </div>
                {selectedTool === tool.id && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <CardDescription className="text-sm mb-4">
                {tool.description}
              </CardDescription>
              
              {/* Preview placeholder - in real implementation, this would show actual preview images */}
              <div className="bg-gray-100 rounded-lg h-32 mb-4 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Preview Image</span>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Features:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTool && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">
                {aiTools.find(tool => tool.id === selectedTool)?.name} Selected
              </h3>
              <p className="text-sm text-blue-700">
                Ready to process your photo with this AI tool
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}