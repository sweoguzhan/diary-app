import React, { memo } from 'react';
import { styled } from 'nativewind';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatDate, formatDuration } from '../../utils/formatters';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import { Video } from '../../store/videoStore';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledLinearGradient = styled(LinearGradient);

const categories = [
  { id: 'family', name: 'Aile' },
  { id: 'friends', name: 'Arkadaşlar' },
  { id: 'travel', name: 'Seyahat' },
  { id: 'events', name: 'Etkinlikler' },
  { id: 'memories', name: 'Anılar' },
  { id: 'other', name: 'Diğer' },
];

interface VideoCardProps {
  video: Video;
  onPress: () => void;
}

export const VideoCard = memo(({ video, onPress }: VideoCardProps) => {
  const { colorScheme } = useColorScheme();

  const getCategoryIcon = () => {
    switch (video.category) {
      case 'family':
        return 'people-outline';
      case 'friends':
        return 'people-circle-outline';
      case 'travel':
        return 'airplane-outline';
      case 'events':
        return 'calendar-outline';
      case 'memories':
        return 'heart-outline';
      default:
        return 'videocam-outline';
    }
  };

  const defaultThumbnail = 'https://i.ibb.co/0jZ3Q8Y/video-placeholder.jpg';

  return (
    <StyledTouchableOpacity
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <StyledView className="relative">
        <StyledImage
          source={{ uri: video.thumbnailUri || defaultThumbnail }}
          className="w-full h-48 bg-gray-200 dark:bg-gray-700"
          resizeMode="cover"
        />
        
        <StyledView className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded-md">
          <StyledView className="flex-row items-center">
            <Ionicons name={getCategoryIcon()} size={14} color="#FFFFFF" />
            <StyledText className="text-white text-xs ml-1 capitalize">
              {video.category}
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
      
      <StyledView className="p-3">
        <StyledText className="text-gray-900 dark:text-white font-medium text-lg mb-1" numberOfLines={1}>
          {video.name}
        </StyledText>
        
        {video.description ? (
          <StyledText className="text-gray-600 dark:text-gray-400 text-sm mb-2" numberOfLines={2}>
            {video.description}
          </StyledText>
        ) : null}
        
        <StyledText className="text-gray-500 dark:text-gray-500 text-xs">
          {formatDate(video.createdAt)}
        </StyledText>
      </StyledView>
    </StyledTouchableOpacity>
  );
}); 