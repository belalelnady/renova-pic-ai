'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin } from 'lucide-react';
import { 
  shippingAddressSchema, 
  type ShippingAddressFormData, 
  COUNTRIES,
  validatePostalCodeForCountry 
} from '@/lib/validations';

interface CheckoutFormProps {
  onSubmit: (data: ShippingAddressFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export function CheckoutForm({ onSubmit, loading = false, error }: CheckoutFormProps) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'SA', // Default to Saudi Arabia
    },
  });

  const selectedCountry = watch('country');
  const postalCode = watch('postalCode');

  // Validate postal code when country or postal code changes
  const handlePostalCodeValidation = (value: string) => {
    if (value && selectedCountry) {
      const isValid = validatePostalCodeForCountry(value, selectedCountry);
      if (!isValid) {
        return 'Invalid postal code format for selected country';
      }
    }
    return true;
  };

  const onFormSubmit = async (data: ShippingAddressFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {t('checkout.shippingAddress')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="required">
              {t('checkout.fullName')}
            </Label>
            <Input
              id="fullName"
              {...register('fullName')}
              placeholder={t('checkout.fullNamePlaceholder')}
              disabled={isLoading}
              className={errors.fullName ? 'border-destructive' : ''}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          {/* Address Line 1 */}
          <div className="space-y-2">
            <Label htmlFor="addressLine1" className="required">
              {t('checkout.addressLine1')}
            </Label>
            <Input
              id="addressLine1"
              {...register('addressLine1')}
              placeholder={t('checkout.addressLine1Placeholder')}
              disabled={isLoading}
              className={errors.addressLine1 ? 'border-destructive' : ''}
            />
            {errors.addressLine1 && (
              <p className="text-sm text-destructive">{errors.addressLine1.message}</p>
            )}
          </div>

          {/* Address Line 2 (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="addressLine2">
              {t('checkout.addressLine2')}
            </Label>
            <Input
              id="addressLine2"
              {...register('addressLine2')}
              placeholder={t('checkout.addressLine2Placeholder')}
              disabled={isLoading}
            />
            {errors.addressLine2 && (
              <p className="text-sm text-destructive">{errors.addressLine2.message}</p>
            )}
          </div>

          {/* City and State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="required">
                {t('checkout.city')}
              </Label>
              <Input
                id="city"
                {...register('city')}
                placeholder={t('checkout.cityPlaceholder')}
                disabled={isLoading}
                className={errors.city ? 'border-destructive' : ''}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="required">
                {t('checkout.state')}
              </Label>
              <Input
                id="state"
                {...register('state')}
                placeholder={t('checkout.statePlaceholder')}
                disabled={isLoading}
                className={errors.state ? 'border-destructive' : ''}
              />
              {errors.state && (
                <p className="text-sm text-destructive">{errors.state.message}</p>
              )}
            </div>
          </div>

          {/* Postal Code and Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode" className="required">
                {t('checkout.postalCode')}
              </Label>
              <Input
                id="postalCode"
                {...register('postalCode', {
                  validate: handlePostalCodeValidation,
                })}
                placeholder={t('checkout.postalCodePlaceholder')}
                disabled={isLoading}
                className={errors.postalCode ? 'border-destructive' : ''}
                onChange={(e) => {
                  setValue('postalCode', e.target.value);
                  if (selectedCountry) {
                    trigger('postalCode');
                  }
                }}
              />
              {errors.postalCode && (
                <p className="text-sm text-destructive">{errors.postalCode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="required">
                {t('checkout.country')}
              </Label>
              <Select
                value={selectedCountry}
                onValueChange={(value) => {
                  setValue('country', value);
                  // Re-validate postal code when country changes
                  if (postalCode) {
                    trigger('postalCode');
                  }
                }}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.country ? 'border-destructive' : ''}>
                  <SelectValue placeholder={t('checkout.selectCountry')} />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex items-center gap-2">
                        <span>{country.name}</span>
                        <span className="text-muted-foreground text-sm">
                          ({country.nameAr})
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-sm text-destructive">{errors.country.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              size="lg"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('checkout.continueToPayment')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}