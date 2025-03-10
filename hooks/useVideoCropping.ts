import { useMutation } from '@tanstack/react-query';
import { cropVideo, generateThumbnail } from '../services/ffmpeg';

type CropVideoParams = {
  uri: string;
  startTime: number;
  endTime: number;
};

type CropVideoResult = {
  uri: string;
  thumbnailUri: string;
};

export function useVideoCropping() {
  return useMutation<CropVideoResult, Error, CropVideoParams>({
    mutationFn: async ({ uri, startTime, endTime }) => {
      const croppedVideoUri = await cropVideo(uri, startTime, endTime);
      
      const thumbnailUri = await generateThumbnail(croppedVideoUri, 0);
      
      return {
        uri: croppedVideoUri,
        thumbnailUri,
      };
    },
  });
} 