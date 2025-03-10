import { useState } from 'react';
import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';

interface UseVideoThumbnailResult {
  generateThumbnail: (videoUri: string, timeInSeconds?: number) => Promise<string>;
  isLoading: boolean;
  error: Error | null;
}

export function useVideoThumbnail(): UseVideoThumbnailResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateThumbnail = async (videoUri: string, timeInSeconds = 0): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const timeInMilliseconds = Math.round(timeInSeconds * 1000);
      
      console.log(`Thumbnail oluşturuluyor: ${videoUri}, zaman: ${timeInMilliseconds}ms`);
      
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: timeInMilliseconds,
        quality: 0.7,
      });
      
      console.log(`Thumbnail oluşturuldu: ${uri}`);
      
      setIsLoading(false);
      return uri;
    } catch (error) {
      console.error('Thumbnail oluşturma hatası:', error);
      setError(error instanceof Error ? error : new Error(String(error)));
      setIsLoading(false);
      throw error;
    }
  };

  return {
    generateThumbnail,
    isLoading,
    error,
  };
} 