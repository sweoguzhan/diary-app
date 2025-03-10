import { styled } from 'nativewind';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { useVideoStore } from '../../store/videoStore';
import { Button } from '../../components/ui/Button';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import Toast from 'react-native-toast-message';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledVideo = styled(Video);
const StyledScrollView = styled(ScrollView);

export default function NewVideoScreen() {
  const { setSelectedVideoUri } = useVideoStore();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const videoRef = useRef(null);

  const pickVideo = async () => {
    try {
      setLoading(true);
      
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Toast.show({
          type: 'error',
          text1: 'İzin Gerekli',
          text2: 'Galeriye erişim izni vermeniz gerekiyor',
          visibilityTime: 3000,
        });
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedVideo = result.assets[0];
        setSelectedVideo(selectedVideo.uri);
        setSelectedVideoUri(selectedVideo.uri);
        router.push('/new/crop');
      }
    } catch (error) {
      console.error('Video seçme hatası:', error);
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: 'Video seçilirken bir sorun oluştu',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledView className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <StyledScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <StyledView className="items-center mb-8">
       
          <StyledText className="text-gray-600 dark:text-gray-400 text-center">
            Lütfen günlüğünüze eklemek istediğiniz videoyu seçin
          </StyledText>
        </StyledView>
        
        {selectedVideo ? (
          <StyledView className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden mb-6">
            <StyledVideo
              ref={videoRef}
              source={{ uri: selectedVideo }}
              className="w-full h-full"
              resizeMode={ResizeMode.COVER}
              useNativeControls
              isLooping
              shouldPlay
            />
            
            <StyledTouchableOpacity
              onPress={pickVideo}
              className="absolute bottom-4 right-4 bg-white/80 dark:bg-gray-700 p-2 rounded-full"
              disabled={loading}
            >
              <Ionicons name="refresh" size={24} color={isDark ? '#60A5FA' : '#1E3A8A'} />
            </StyledTouchableOpacity>
          </StyledView>
        ) : (
          <StyledTouchableOpacity
            className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 mb-8 items-center justify-center"
            onPress={pickVideo}
            disabled={loading}
            style={{ aspectRatio: 16/9 }}
          >
            <Ionicons 
              name="images-outline" 
              size={64} 
              color={isDark ? '#60A5FA' : '#1E3A8A'} 
            />
            <StyledText className="text-gray-700 dark:text-gray-300 mt-4 text-lg font-medium text-center">
              Galeriden Video Seçin
            </StyledText>
          </StyledTouchableOpacity>
        )}
        
        <Button
          title={selectedVideo ? "Devam Et" : "Video Seçin"}
          onPress={selectedVideo ? () => router.push('/new/crop') : pickVideo}
          isLoading={loading}
          disabled={loading}
          variant="primary"
          className="w-full mt-4"
        />
      </StyledScrollView>
    </StyledView>
  );
} 