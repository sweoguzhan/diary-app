import { styled } from 'nativewind';
import { View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { useRef, useState, useEffect } from 'react';
import { useVideoStore } from '../../store/videoStore';
import { Button } from '../../components/ui/Button';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import Toast from 'react-native-toast-message';
import Slider from '@react-native-community/slider';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledVideo = styled(Video);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledSlider = styled(Slider);

const MAX_DURATION = 5;

export default function VideoCropScreen() {
  const videoRef = useRef<Video>(null);
  const { selectedVideoUri, setCropStartTime, setCropEndTime } = useVideoStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(MAX_DURATION);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  useEffect(() => {
    if (!selectedVideoUri) {
      router.replace('/new');
    }
  }, [selectedVideoUri]);
  
  useEffect(() => {
    if (duration > 0) {
      setEndTime(Math.min(duration, startTime + MAX_DURATION));
    }
  }, [duration, startTime]);
  
  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis / 1000);
      setPosition(status.positionMillis / 1000);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        videoRef.current?.setPositionAsync(startTime * 1000);
      }
      
      if (status.positionMillis / 1000 > endTime) {
        videoRef.current?.pauseAsync();
        setIsPlaying(false);
        videoRef.current?.setPositionAsync(startTime * 1000);
      }
    }
  };
  
  const togglePlayPause = async () => {
    if (isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.setPositionAsync(startTime * 1000);
      await videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleStartTimeChange = (value: number) => {
    const newStartTime = Math.min(value, duration - 0.1);
    setStartTime(newStartTime);
    
    if (newStartTime > endTime - MAX_DURATION) {
      setEndTime(Math.min(newStartTime + MAX_DURATION, duration));
    }
    
    videoRef.current?.setPositionAsync(newStartTime * 1000);
    setPosition(newStartTime);
  };
  
  const handleEndTimeChange = (value: number) => {
    const newEndTime = Math.max(value, 0.1);
    setEndTime(newEndTime);
    
    if (newEndTime < startTime + MAX_DURATION && newEndTime - MAX_DURATION >= 0) {
      setStartTime(Math.max(newEndTime - MAX_DURATION, 0));
    }
  };
  
  const handlePositionChange = (value: number) => {
    setPosition(value);
    videoRef.current?.setPositionAsync(value * 1000);
  };
  
  const handleNext = () => {
    const selectedDuration = endTime - startTime;
    
    if (selectedDuration > MAX_DURATION) {
      Toast.show({
        type: 'error',
        text1: 'Süre Sınırı Aşıldı',
        text2: `Maksimum ${MAX_DURATION} saniyelik bir aralık seçebilirsiniz.`,
        visibilityTime: 3000,
      });
      return;
    }
    
    setCropStartTime(startTime);
    setCropEndTime(endTime);
    
    router.navigate('/new/metadata');
  };
  
  if (!selectedVideoUri) {
    return null;
  }
  
  return (
    <StyledView className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <StyledScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <StyledView className="p-4">
          <StyledText className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
            Videoyu Kırp
          </StyledText>
          
          <StyledText className="text-gray-600 dark:text-gray-400 mb-6 text-center">
            5 saniyelik bir segment seçin
          </StyledText>
        </StyledView>
        
        <StyledView className="items-center mb-6 relative">
          <StyledVideo
            ref={videoRef}
            source={{ uri: selectedVideoUri }}
            resizeMode={ResizeMode.CONTAIN}
            className="w-full h-64 bg-black"
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            useNativeControls={false}
          />
          
          {!isPlaying && (
            <StyledTouchableOpacity
              className="absolute inset-0 items-center justify-center"
              onPress={togglePlayPause}
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}
            >
              <StyledView className="bg-black/50 rounded-full p-4">
                <Ionicons name="play" size={32} color="#FFFFFF" />
              </StyledView>
            </StyledTouchableOpacity>
          )}
        </StyledView>
        
        <StyledView className="px-6">
         
          
          <StyledView className="mb-4">
            <StyledText className="text-gray-700 dark:text-gray-300 mb-2">
              Başlangıç Zamanı: {formatTime(startTime)}
            </StyledText>
            <StyledSlider
              value={startTime}
              minimumValue={0}
              maximumValue={duration}
              step={0.1}
              onValueChange={handleStartTimeChange}
              minimumTrackTintColor={isDark ? '#3b82f6' : '#2563eb'}
              maximumTrackTintColor={isDark ? '#374151' : '#d1d5db'}
              thumbTintColor={isDark ? '#60a5fa' : '#3b82f6'}
            />
          </StyledView>
          
          <StyledView className="mb-8">
            <StyledText className="text-gray-700 dark:text-gray-300 mb-2">
              Bitiş Zamanı: {formatTime(endTime)}
            </StyledText>
            <StyledSlider
              value={endTime}
              minimumValue={0}
              maximumValue={duration}
              step={0.1}
              onValueChange={handleEndTimeChange}
              minimumTrackTintColor={isDark ? '#3b82f6' : '#2563eb'}
              maximumTrackTintColor={isDark ? '#374151' : '#d1d5db'}
              thumbTintColor={isDark ? '#60a5fa' : '#3b82f6'}
            />
          </StyledView>
          
          <StyledText className="text-gray-600 dark:text-gray-400 mb-6 text-center">
            Seçilen süre: {formatTime(endTime - startTime)} / {formatTime(MAX_DURATION)}
          </StyledText>
          
          <Button
            title="Devam Et"
            onPress={handleNext}
            variant="primary"
            className="mb-4"
          />
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
} 