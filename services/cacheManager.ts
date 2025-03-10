import * as FileSystem from 'expo-file-system';

const CACHE_FOLDER = `${FileSystem.cacheDirectory}video-diary/`;

export const initializeCache = async () => {
  const dirInfo = await FileSystem.getInfoAsync(CACHE_FOLDER);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_FOLDER, { intermediates: true });
  }
};

export const getCacheSize = async (): Promise<number> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_FOLDER);
    if (!dirInfo.exists) return 0;
    
    const result = await FileSystem.readDirectoryAsync(CACHE_FOLDER);
    let totalSize = 0;
    
    for (const file of result) {
      const fileInfo = await FileSystem.getInfoAsync(`${CACHE_FOLDER}${file}`);
      if (fileInfo.exists && fileInfo.size) {
        totalSize += fileInfo.size;
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('Önbellek boyutu hesaplanırken hata:', error);
    return 0;
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_FOLDER);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(CACHE_FOLDER);
      await FileSystem.makeDirectoryAsync(CACHE_FOLDER, { intermediates: true });
    }
  } catch (error) {
    console.error('Önbellek temizlenirken hata:', error);
  }
};

export const manageCacheSize = async (maxSize: number = 100 * 1024 * 1024): Promise<void> => {
  try {
    const currentSize = await getCacheSize();
    if (currentSize > maxSize) {
      await clearCache();
    }
  } catch (error) {
    console.error('Önbellek yönetilirken hata:', error);
  }
}; 