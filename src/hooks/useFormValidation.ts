"use client"

import { useState, useCallback } from 'react'
import { z } from 'zod'
import { toastUtils } from '@/lib/toast-utils'

interface ValidationError {
  field: string
  message: string
}

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>
  onSubmit: (data: T) => Promise<void> | void
  onError?: (errors: ValidationError[]) => void
  sanitize?: boolean
}

export function useFormValidation<T>({
  schema,
  onSubmit,
  onError,
  sanitize = true
}: UseFormValidationOptions<T>) {
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)



  const validate = useCallback((data: unknown): { success: boolean; data?: T; errors?: ValidationError[] } => {
    try {
      const validatedData = schema.parse(data)
      return { success: true, data: validatedData }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: ValidationError[] = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
        return { success: false, errors: validationErrors }
      }
      return { 
        success: false, 
        errors: [{ field: 'general', message: 'Validation failed' }] 
      }
    }
  }, [schema])

  const handleSubmit = useCallback(async (data: unknown) => {
    setIsSubmitting(true)
    setErrors([])

    const validation = validate(data)
    
    if (!validation.success) {
      setErrors(validation.errors || [])
      onError?.(validation.errors || [])
      
      // Show first error in toast
      if (validation.errors && validation.errors.length > 0) {
        toastUtils.error({ 
          title: 'Validation Error', 
          description: validation.errors[0].message 
        })
      }
      
      setIsSubmitting(false)
      return
    }

    try {
      await onSubmit(validation.data!)
      setErrors([])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submission failed'
      const submitError: ValidationError = { field: 'general', message: errorMessage }
      setErrors([submitError])
      onError?.([submitError])
      toastUtils.error({ title: 'Submission Error', description: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }, [validate, onSubmit, onError, toastUtils])

  const getFieldError = useCallback((fieldName: string): string | undefined => {
    return errors.find(error => error.field === fieldName)?.message
  }, [errors])

  const hasFieldError = useCallback((fieldName: string): boolean => {
    return errors.some(error => error.field === fieldName)
  }, [errors])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => prev.filter(error => error.field !== fieldName))
  }, [])

  return {
    errors,
    isSubmitting,
    validate,
    handleSubmit,
    getFieldError,
    hasFieldError,
    clearErrors,
    clearFieldError
  }
}

// Specific validation hooks for common forms
export function usePhotoUploadValidation(onSubmit: (data: any) => Promise<void>) {
  return useFormValidation({
    schema: z.object({
      file: z.instanceof(File),
      aiTool: z.enum(['visa-photo', 'absher', 'saudi-look', 'baby-photo'])
    }),
    onSubmit
  })
}

export function useShippingAddressValidation(onSubmit: (data: any) => Promise<void>) {
  return useFormValidation({
    schema: z.object({
      fullName: z.string().min(2).max(100),
      addressLine1: z.string().min(5).max(200),
      addressLine2: z.string().max(200).optional(),
      city: z.string().min(2).max(100),
      state: z.string().min(2).max(100),
      postalCode: z.string().min(3).max(20),
      country: z.string().min(2).max(100)
    }),
    onSubmit
  })
}

export function useContactFormValidation(onSubmit: (data: any) => Promise<void>) {
  return useFormValidation({
    schema: z.object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      subject: z.string().min(5).max(200),
      message: z.string().min(10).max(2000)
    }),
    onSubmit
  })
}