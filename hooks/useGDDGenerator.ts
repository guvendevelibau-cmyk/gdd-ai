// hooks/useGDDGenerator.ts
import { useState } from 'react';
import { GDDFormData, GDDResponse, APIError } from '@/types/gdd';

interface UseGDDGeneratorReturn {
  generateGDD: (formData: GDDFormData) => Promise<GDDResponse | null>;
  isLoading: boolean;
  error: string | null;
  progress: number;
}

export function useGDDGenerator(): UseGDDGeneratorReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const generateGDD = async (formData: GDDFormData): Promise<GDDResponse | null> => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const response = await fetch('/api/generate-gdd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData: APIError = await response.json();
        throw new Error(errorData.error || 'GDD oluşturulurken bir hata oluştu.');
      }

      const data: GDDResponse = await response.json();
      setProgress(100);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateGDD,
    isLoading,
    error,
    progress,
  };
}

export default useGDDGenerator;
