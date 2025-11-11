'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Package, Frame, Copy } from 'lucide-react';
import { EditingSettings } from '@/types';
import { 
  calculatePrintPrice, 
  getPhotoCategoryFromTool, 
  isPortraitCategory, 
  isIdPhotoCategory,
  getAvailablePrintSizes,
  getDefaultEditingSettings,
  PRICING_CONFIG,
  formatPrice,
  type PricingBreakdown
} from '@/lib/pricing';

interface PriceSummaryProps {
  settings: EditingSettings;
}

function PriceSummary({ settings }: PriceSummaryProps) {
  const breakdown = calculatePrintPrice(settings);
  const availableSizes = getAvailablePrintSizes(settings.category);
  const selectedSize = availableSizes.find(s => s.id === settings.size);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Base price ({settings.quantity} × {formatPrice(selectedSize?.basePrice || 0)})</span>
        <span>{formatPrice(breakdown.basePrice)}</span>
      </div>
      
      {breakdown.framePrice > 0 && (
        <div className="flex justify-between text-sm">
          <span>Premium frame</span>
          <span>+{formatPrice(breakdown.framePrice)}</span>
        </div>
      )}
      
      {breakdown.extraPrintSetsPrice > 0 && (
        <div className="flex justify-between text-sm">
          <span>Extra print sets ({settings.extraPrintSets})</span>
          <span>+{formatPrice(breakdown.extraPrintSetsPrice)}</span>
        </div>
      )}
      
      <div className="flex justify-between text-sm border-t pt-2">
        <span>Subtotal</span>
        <span>{formatPrice(breakdown.subtotal)}</span>
      </div>
      
      <div className="flex justify-between text-sm">
        <span>
          Shipping 
          {breakdown.shippingCost === 0 && (
            <span className="text-green-600 ml-1">(Free!)</span>
          )}
        </span>
        <span>{breakdown.shippingCost === 0 ? 'Free' : formatPrice(breakdown.shippingCost)}</span>
      </div>
      
      <div className="flex justify-between text-lg font-bold border-t pt-2">
        <span>Total Price</span>
        <span>{formatPrice(breakdown.totalPrice)}</span>
      </div>
      
      {breakdown.subtotal < PRICING_CONFIG.FREE_SHIPPING_THRESHOLD && (
        <p className="text-xs text-muted-foreground">
          Add {formatPrice(PRICING_CONFIG.FREE_SHIPPING_THRESHOLD - breakdown.subtotal)} more for free shipping
        </p>
      )}
    </div>
  );
}

interface PrintOptionsProps {
  aiTool: string;
  onSettingsChange: (settings: EditingSettings & { totalPrice: number; breakdown: PricingBreakdown }) => void;
  className?: string;
}

export function PrintOptions({ aiTool, onSettingsChange, className }: PrintOptionsProps) {
  const t = useTranslations('photo');
  
  const photoCategory = getPhotoCategoryFromTool(aiTool);
  const availableSizes = getAvailablePrintSizes(photoCategory);
  const defaultSettings = getDefaultEditingSettings(photoCategory);
  
  const [selectedSize, setSelectedSize] = useState<string>(defaultSettings.size);
  const [quantity, setQuantity] = useState<number>(defaultSettings.quantity);
  const [addFrame, setAddFrame] = useState<boolean>(defaultSettings.addFrame || false);
  const [extraPrintSets, setExtraPrintSets] = useState<number>(defaultSettings.extraPrintSets || 0);

  const isPortrait = isPortraitCategory(photoCategory);
  const isIdPhoto = isIdPhotoCategory(photoCategory);

  // Update parent component when settings change
  useEffect(() => {
    const settings: EditingSettings = {
      category: photoCategory,
      size: selectedSize,
      quantity,
      addFrame: isPortrait ? addFrame : undefined,
      extraPrintSets: isIdPhoto ? extraPrintSets : undefined,
    };
    
    const breakdown = calculatePrintPrice(settings);
    
    onSettingsChange({
      ...settings,
      totalPrice: breakdown.totalPrice,
      breakdown
    });
  }, [selectedSize, quantity, addFrame, extraPrintSets, photoCategory, isPortrait, isIdPhoto, onSettingsChange]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + delta));
    setQuantity(newQuantity);
  };

  const handleExtraPrintSetsChange = (delta: number) => {
    const newSets = Math.max(0, Math.min(5, extraPrintSets + delta));
    setExtraPrintSets(newSets);
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Print Customization
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize your print options and see live pricing
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Photo Category Badge */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Photo Type:</Label>
            <Badge variant="secondary" className="capitalize">
              {photoCategory.replace('-', ' ')}
            </Badge>
          </div>

          {/* Print Size Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Print Size</Label>
            <RadioGroup
              value={selectedSize}
              onValueChange={setSelectedSize}
              className="grid grid-cols-1 gap-3"
            >
              {availableSizes.map((size) => (
                <div key={size.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={size.id} id={size.id} />
                  <Label
                    htmlFor={size.id}
                    className="flex-1 flex items-center justify-between cursor-pointer p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">{size.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {size.dimensions} • {size.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatPrice(size.basePrice)}</div>
                      <div className="text-xs text-muted-foreground">per print</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Quantity Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Quantity</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold">{quantity}</div>
                <div className="text-xs text-muted-foreground">prints</div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Maximum 10 prints per order
            </p>
          </div>

          {/* Conditional Options */}
          {isPortrait && (
            <div className="space-y-3">
              <Label className="text-base font-medium">Frame Options</Label>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id="add-frame"
                  checked={addFrame}
                  onCheckedChange={(checked) => setAddFrame(checked as boolean)}
                />
                <Label htmlFor="add-frame" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Frame className="w-4 h-4" />
                      <span>Add Premium Frame</span>
                    </div>
                    <span className="font-medium">+{formatPrice(PRICING_CONFIG.FRAME_PRICE)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    High-quality wooden frame with glass protection
                  </p>
                </Label>
              </div>
            </div>
          )}

          {isIdPhoto && (
            <div className="space-y-3">
              <Label className="text-base font-medium">Extra Print Sets</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleExtraPrintSetsChange(-1)}
                  disabled={extraPrintSets <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold">{extraPrintSets}</div>
                  <div className="text-xs text-muted-foreground">extra sets</div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleExtraPrintSetsChange(1)}
                  disabled={extraPrintSets >= 5}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-blue-50">
                <Copy className="w-4 h-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Extra sets include 4 additional prints each
                  </p>
                  <p className="text-xs text-blue-700">
                    Perfect for ID documents and official applications
                  </p>
                </div>
                <span className="font-medium text-blue-900">
                  +{formatPrice(PRICING_CONFIG.EXTRA_PRINT_SET_PRICE)} each
                </span>
              </div>
            </div>
          )}

          {/* Price Summary */}
          <div className="border-t pt-4">
            <PriceSummary
              settings={{
                category: photoCategory,
                size: selectedSize,
                quantity,
                addFrame: isPortrait ? addFrame : undefined,
                extraPrintSets: isIdPhoto ? extraPrintSets : undefined,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}