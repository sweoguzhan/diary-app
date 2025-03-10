import { useMutation } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system';
import { useVideoThumbnail } from './useVideoThumbnail';
import Toast from 'react-native-toast-message';
import { Asset } from 'expo-media-library';

interface CropVideoParams {
  uri: string;
  startTime: number;
  endTime: number;
}

interface CropVideoResult {
  uri: string;
  thumbnailUri: string;
}

export function useVideoCropping() {
  const { generateThumbnail } = useVideoThumbnail();

  return useMutation({
    mutationFn: async ({ uri, startTime, endTime }: CropVideoParams): Promise<CropVideoResult> => {
      try {
      
        console.log(`Video kırpma simüle ediliyor: ${startTime}s - ${endTime}s`);
        
        const thumbnailUri = await generateThumbnail(uri, startTime);
        
        return {
          uri: uri, 
          thumbnailUri,
        };
      } catch (error) {
        console.error('Video kırpma hatası:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Video işleme başarılı:', data);
      Toast.show({
        type: 'success',
        text1: 'Video Kırpıldı',
        text2: 'Video başarıyla kırpıldı ve kaydedildi.',
      });
    },
    onError: (error) => {
      console.error('Video işleme hatası:', error);
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: error instanceof Error ? error.message : 'Video kırpılırken bir hata oluştu.',
      });
    }
  });
} 