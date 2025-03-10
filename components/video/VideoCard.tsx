import { styled } from 'nativewind';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatDate, formatDuration } from '../../utils/formatters';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';

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

type VideoCardProps = {
  id: string;
  name: string;
  description?: string;
  thumbnailUri: string;
  createdAt: string | Date;
  duration?: number;
  category?: string;
};

export function VideoCard({ 
  id, 
  name, 
  description, 
  thumbnailUri, 
  createdAt,
  duration = 0,
  category
}: VideoCardProps) {
  const { colorScheme } = useColorScheme();
  const handlePress = () => {
    router.push(`/video/${id}`);
  };

  const defaultThumbnail = 'https://i.ibb.co/0jZ3Q8Y/video-placeholder.jpg';

  return (
    <StyledTouchableOpacity
      onPress={handlePress}
      className="bg-white-gray-200 dark:bg-gray-800 rounded-xl shadow-md mb-5 overflow-hidden"
      style={{ 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
      }}
    >
      <StyledView className="relative">
        <StyledImage
          source={{ uri: thumbnailUri || defaultThumbnail }}
          className="w-full h-52 bg-gray-200 dark:bg-gray-700"
          resizeMode="cover"
        />
        
        <StyledLinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          className="absolute bottom-0 left-0 right-0 h-24"
        />
        
        <StyledView className="absolute bottom-3 left-3 right-3">
          <StyledText className="text-xl font-bold text-white mb-1 drop-shadow-md">
            {name}
          </StyledText>
          
          <StyledView className="flex-row items-center justify-between">
            <StyledView className="flex-row items-center">
              <Ionicons name="calendar-outline" size={14} color="#FFFFFF" />
              <StyledText className="text-xs text-white ml-1 opacity-90">
                {formatDate(createdAt)}
              </StyledText>
            </StyledView>
            
            {category ? (
              <StyledView className="flex-row items-center">
                <Ionicons name="bookmark-outline" size={14} color="#FFFFFF" />
                <StyledText className="text-xs text-white ml-1 opacity-90">
                  {categories.find(c => c.id === category)?.name || category}
                </StyledText>
              </StyledView>
            ) : (
              <StyledView className="flex-row items-center">
                <Ionicons name="bookmark-outline" size={14} color="#FFFFFF" />
                <StyledText className="text-xs text-white ml-1 opacity-90">
                  Diğer
                </StyledText>
              </StyledView>
            )}
          </StyledView>
        </StyledView>
        
        {duration > 0 && (
          <StyledView className="absolute top-3 right-3 bg-black/70 px-2 py-1 rounded-full">
            <StyledText className="text-white text-xs font-medium">
              {formatDuration(duration)}
            </StyledText>
          </StyledView>
        )}
      </StyledView>
      
      {description ? (
        <StyledView className="p-4">
          <StyledText className="text-gray-700 dark:text-gray-300 text-sm" numberOfLines={2}>
            {description}
          </StyledText>
        </StyledView>
      ) : null}
    </StyledTouchableOpacity>
  );
} 