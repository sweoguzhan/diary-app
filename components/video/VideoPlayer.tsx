import { styled } from 'nativewind';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { formatDuration } from '../../utils/formatters';
import { Text } from 'react-native';

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledVideo = styled(Video);

const { width } = Dimensions.get('window');
const StyledText = styled(Text);

type VideoPlayerProps = {
  uri: string;
  thumbnailUri?: string;
  autoPlay?: boolean;
};

export function VideoPlayer({ uri, thumbnailUri, autoPlay = false }: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showControls, setShowControls] = useState(true);
  
  const isPlaybackStatus = (status: AVPlaybackStatus): status is AVPlaybackStatusSuccess => {
    return status.isLoaded === true;
  };
  
  useEffect(() => {
    if (showControls) {
      const timer = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showControls, isPlaying]);
  
  const handlePlayPause = async () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };
  
  const handleVideoPress = () => {
    setShowControls(!showControls);
  };
  
  const handleReplay = async () => {
    if (!videoRef.current) return;
    
    await videoRef.current.replayAsync();
    setIsPlaying(true);
    setShowControls(true);
  };
  
  return (
    <StyledView className="relative">
      <StyledTouchableOpacity
        activeOpacity={1}
        onPress={handleVideoPress}
        className="w-full aspect-video bg-black rounded-lg overflow-hidden"
      >
        <StyledVideo
          ref={videoRef}
          source={{ uri }}
          resizeMode={ResizeMode.CONTAIN}
          className="w-full h-full"
          useNativeControls={false}
          shouldPlay={autoPlay}
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(status)}
        />
        
        {showControls && (
          <StyledView className="absolute inset-0 flex items-center justify-center bg-black/30">
            <StyledTouchableOpacity
              onPress={handlePlayPause}
              className="w-16 h-16 rounded-full bg-white/20 items-center justify-center"
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={32}
                color="white"
              />
            </StyledTouchableOpacity>
            
            {status && isPlaybackStatus(status) && (
              <StyledView className="absolute bottom-4 left-4 right-4">
                <StyledView className="flex-row justify-between mb-2">
                  <StyledText className="text-white text-xs">
                    {formatDuration(status.positionMillis / 1000)}
                  </StyledText>
                  <StyledText className="text-white text-xs">
                    {formatDuration((status.durationMillis ?? 0) / 1000)}
                  </StyledText>
                </StyledView>
                
                <StyledView className="h-1 bg-white/30 rounded-full">
                  <StyledView
                    className="h-1 bg-blue-500 rounded-full"
                    style={{
                      width: `${(status.positionMillis / (status.durationMillis ?? 1)) * 100}%`,
                    }}
                  />
                </StyledView>
              </StyledView>
            )}
          </StyledView>
        )}
      </StyledTouchableOpacity>
    </StyledView>
  );
} 