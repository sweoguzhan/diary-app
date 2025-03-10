// Basit alternatif çözüm - FFmpeg kullanmadan
export async function cropVideo(
  inputUri: string,
  startTime: number,
  endTime: number
): Promise<string> {
  console.log(`Video kırpma simüle ediliyor: ${startTime}s - ${endTime}s`);
  return inputUri;
}

export async function generateThumbnail(
  videoUri: string,
  time: number = 0
): Promise<string> {
   
  return videoUri;
} 