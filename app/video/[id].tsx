import { styled } from 'nativewind';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { useVideoStore } from '../../store/videoStore';
import { formatDate } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';
import Toast from 'react-native-toast-message';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '../../components/ui/FormInput';
import { videoEditSchema, VideoEditForm } from '../../schemas/videoSchemas';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  Easing
} from 'react-native-reanimated';
import { VideoPlayer } from '../../components/video/VideoPlayer';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledVideo = styled(Video);
const StyledScrollView = styled(ScrollView);
const AnimatedView = Animated.createAnimatedComponent(styled(View));

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams();
  const { videos, updateVideo, deleteVideo } = useVideoStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const video = videos.find(v => v.id === id);
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { control, handleSubmit, formState: { errors, isDirty }, reset } = useForm<VideoEditForm>({
    resolver: zodResolver(videoEditSchema),
    defaultValues: {
      name: video?.name || '',
      description: video?.description || ''
    }
  });
  
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const translateY = useSharedValue(50);
  
  useEffect(() => {
    if (video) {
      reset({
        name: video.name,
        description: video.description || ''
      });
    }
    
    opacity.value = withTiming(1, { duration: 500 });
    scale.value = withSpring(1, { damping: 12 });
    translateY.value = withTiming(0, { 
      duration: 400,
      easing: Easing.out(Easing.cubic)
    });
  }, [video, reset]);
  


  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value }
      ]
    };
  });
  

  
  if (!video) {
    return (
      <StyledView className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <StyledText className="text-gray-900 dark:text-white text-lg">
          Video bulunamadı
        </StyledText>
      </StyledView>
    );
  }

  const onSubmit = (data: VideoEditForm) => {
    updateVideo(video.id, {
      name: data.name,
      description: data.description,
    });
    Toast.show({
      type: 'success',
      text1: 'Video güncellendi',
      text2: 'Video başarıyla güncellendi',
      visibilityTime: 3000,
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Videoyu Sil',
      'Bu videoyu silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            deleteVideo(video.id);
            router.back();
            
            Toast.show({
              type: 'success',
              text1: 'Video silindi',
              text2: 'Video başarıyla silindi',
              visibilityTime: 3000,
            });
          },
        },
      ]
    );
  };

  return (
    <AnimatedView className="flex-1 bg-white dark:bg-gray-900" style={containerStyle}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <VideoPlayer
        uri={video.uri}
        startTime={video.cropStartTime || 0}
        endTime={video.cropEndTime || undefined}
        className="mb-4"
      />
      
    
      
      <StyledView className="p-6">
        <FormInput
          control={control}
          name="name"
          label="İsim"
          error={errors.name?.message}
        />
        
        <FormInput
          control={control}
          name="description"
          label="Açıklama"
          multiline
          error={errors.description?.message}
        />
        
        <StyledText className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          {formatDate(video.createdAt)}
        </StyledText>
        
        <StyledView className="flex-row justify-between">
          <Button
            title="Kaydet"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            disabled={!isDirty}
          />
          <Button
            title="Sil"
            onPress={handleDelete}
            variant="danger"
          />
        </StyledView>
      </StyledView>
    </AnimatedView>
  );
}

function formatTime(seconds: number = 0) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
} 