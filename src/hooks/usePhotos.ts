import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Photo } from '@/types';

interface UsePhotosOptions {
  aiTool?: string;
  sortBy?: 'newest' | 'oldest' | 'alphabetical';
  search?: string;
}

interface UsePhotosReturn {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  invalidatePhotos: () => void;
}

const fetchPhotos = async (options: UsePhotosOptions): Promise<Photo[]> => {
  const params = new URLSearchParams();
  if (options.aiTool) params.append('aiTool', options.aiTool);
  if (options.sortBy) params.append('sortBy', options.sortBy);
  if (options.search) params.append('search', options.search);

  const response = await fetch(`/api/photos?${params.toString()}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch photos');
  }

  return result.data;
};

export function usePhotos(options: UsePhotosOptions = {}): UsePhotosReturn {
  const queryClient = useQueryClient();
  
  const {
    data: photos = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['photos', options],
    queryFn: () => fetchPhotos(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const invalidatePhotos = () => {
    queryClient.invalidateQueries({ queryKey: ['photos'] });
  };

  return {
    photos,
    loading,
    error: error?.message || null,
    refetch,
    invalidatePhotos,
  };
}