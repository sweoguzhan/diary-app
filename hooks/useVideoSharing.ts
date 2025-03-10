import { useState } from 'react';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import Toast from 'react-native-toast-message';

export function useVideoSharing() {
  const [isSharing, setIsSharing] = useState(false);
  
  const shareVideo = async (uri: string, title: string) => {
    try {
      setIsSharing(true);
      
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        Toast.show({
          type: 'error',
          text1: 'Paylaşım kullanılamıyor',
          text2: 'Paylaşım bu cihazda kullanılamıyor',
          visibilityTime: 4000,
        });
        return;
      }
      
      await Sharing.shareAsync(uri, {
        dialogTitle: title,
        mimeType: 'video/mp4',
        UTI: 'public.movie'
      });
      
      Toast.show({
        type: 'success',
        text1: 'Video paylaşıldı',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error('Video paylaşım hatası:', error);
      Toast.show({
        type: 'error',
        text1: 'Paylaşım hatası',
        text2: 'Video paylaşılırken bir sorun oluştu',
        visibilityTime: 4000,
      });
    } finally {
      setIsSharing(false);
    }
  };
  
  const saveVideoToGallery = async (uri: string) => {
    try {
      setIsSharing(true);
      
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'İzin gerekiyor',
          text2: 'Galeriye kaydetmek için izin gerekiyor',
          visibilityTime: 4000,
        });
        return;
      }
      
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Video Günlüğüm', asset, false);
      
      Toast.show({
        type: 'success',
        text1: 'Video kaydedildi',
        text2: 'Video galeriye başarıyla kaydedildi',
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error('Video kaydetme hatası:', error);
      Toast.show({
        type: 'error',
        text1: 'Kaydetme hatası',
        text2: 'Video galeriye kaydedilirken bir sorun oluştu',
        visibilityTime: 4000,
      });
    } finally {
      setIsSharing(false);
    }
  };
  
  return {
    isSharing,
    shareVideo,
    saveVideoToGallery
  };
} 