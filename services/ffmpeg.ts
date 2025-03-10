import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system';

export async function cropVideo(
  inputUri: string,
  startTime: number,
  endTime: number
): Promise<string> {
  const outputUri = `${FileSystem.cacheDirectory}cropped_${Date.now()}.mp4`;
  const duration = endTime - startTime;
  
  console.log(`Video kırpma başlatılıyor: ${startTime}s - ${endTime}s, süre: ${duration}s`);
  
  const command = `-ss ${startTime} -i "${inputUri}" -t ${duration} -c:v copy -c:a copy "${outputUri}"`;
  
  try {
    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();
    
    if (ReturnCode.isSuccess(returnCode)) {
      console.log('Video kırpma başarılı:', outputUri);
      return outputUri;
    } else {
      const logs = await session.getLogs();
      console.error('Video kırpma başarısız. Loglar:', logs);
      throw new Error('Video kırpma işlemi başarısız oldu');
    }
  } catch (error) {
    console.error('FFmpeg hatası:', error);
    throw error;
  }
}

export async function generateThumbnail(
  videoUri: string,
  time: number = 0
): Promise<string> {
  console.log(`Thumbnail oluşturma simüle ediliyor: ${videoUri}, zaman: ${time}s`);
  return videoUri;
} 