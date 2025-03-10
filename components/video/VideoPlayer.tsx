import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import { View, TouchableOpacity, Dimensions, Text } from 'react-native';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledVideo = styled(Video);
const StyledText = styled(Text);

interface VideoPlayerProps {
  uri: string;
  startTime?: number;
  endTime?: number;
  className?: string;
}

export const VideoPlayer = memo(({ 
  uri, 
  startTime = 0, 
  endTime, 
  className = '' 
}: VideoPlayerProps) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(startTime);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const handleVideoLoad = useCallback(() => {
    if (startTime > 0) {
      videoRef.current?.setPositionAsync(startTime * 1000);
    }
    setIsLoaded(true);
  }, [startTime]);
  
  const checkPosition = useCallback(async () => {
    if (!videoRef.current || !isLoaded) return;
    
    try {
      const status = await videoRef.current.getStatusAsync();
      if (!status.isLoaded) return;
      
      const currentPosition = status.positionMillis / 1000;
      setPosition(currentPosition);
      
      if (currentPosition < startTime) {
        videoRef.current.setPositionAsync(startTime * 1000);
      } else if (endTime && currentPosition > endTime) {
        videoRef.current.setPositionAsync(startTime * 1000);
      }
    } catch (error) {
      console.log('Video pozisyonu kontrol edilirken hata:', error);
    }
  }, [startTime, endTime, isLoaded]);
  
  useEffect(() => {
    const interval = setInterval(checkPosition, 500);
    return () => clearInterval(interval);
  }, [checkPosition]);
  
  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    
    setIsPlaying(status.isPlaying);
    
    if (status.didJustFinish) {
      videoRef.current?.setPositionAsync(startTime * 1000);
      if (status.isPlaying) {
        videoRef.current?.playAsync();
      }
    }
    
    if (endTime && status.positionMillis / 1000 > endTime) {
      videoRef.current?.setPositionAsync(startTime * 1000);
    }
  }, [startTime, endTime]);
  
  return (
    <StyledView className={`w-full ${className}`}>
      <StyledVideo
        ref={videoRef}
        source={{ uri }}
        resizeMode={ResizeMode.CONTAIN}
        className="w-full h-64 bg-black"
        onLoad={handleVideoLoad}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        useNativeControls
        shouldPlay
        progressUpdateIntervalMillis={500}
      />
      
      {(startTime > 0 || endTime) && (
        <StyledView className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-b-lg">
          <StyledText className="text-xs text-blue-800 dark:text-blue-300 text-center">
            Kırpılmış video: {formatTime(startTime)} - {formatTime(endTime || 0)}
          </StyledText>
        </StyledView>
      )}
    </StyledView>
  );
});

function formatTime(seconds: number = 0) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
} 

