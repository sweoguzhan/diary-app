import { useMutation } from '@tanstack/react-query';
import { cropVideo } from '../services/ffmpeg';
import { useVideoThumbnail } from './useVideoThumbnail';
import Toast from 'react-native-toast-message';

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
        console.log(`Video kırpma başlatılıyor: ${uri}, ${startTime}s - ${endTime}s`);
        
        const croppedVideoUri = await cropVideo(uri, startTime, endTime);
        
        const thumbnailUri = await generateThumbnail(croppedVideoUri, 0);
        
        return {
          uri: croppedVideoUri,
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
        visibilityTime: 3000,
      });
    },
    onError: (error) => {
      console.error('Video işleme hatası:', error);
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: error instanceof Error ? error.message : 'Video kırpılırken bir hata oluştu.',
        visibilityTime: 4000,
      });
    }
  });
} 