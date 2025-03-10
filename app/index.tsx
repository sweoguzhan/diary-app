import { styled } from 'nativewind';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useVideoStore } from '../store/videoStore';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../utils/formatters';
import { CategoryFilter } from '../components/ui/CategoryFilter';
import { useState, useMemo } from 'react';
import { useColorScheme } from 'nativewind';
import { AnimatedPage } from '../components/ui/AnimatedPage';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledTextInput = styled(TextInput);

export default function HomeScreen() {
  const { videos } = useVideoStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Filtreleme işlemi
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch = 
        searchQuery === '' || 
        video.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (video.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      
      const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [videos, searchQuery, selectedCategory]);
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  const navigateToNewVideo = () => {
    router.push('/new');
  };
  
  const navigateToVideoDetail = (id: string) => {
    router.push(`/video/${id}`);
  };
  
  return (
    <AnimatedPage animationType="fade">
      <StyledView className="flex-1 bg-white dark:bg-gray-900">
        <StatusBar style={isDark ? 'light' : 'dark'} />
        
        <StyledView className="px-4 pt-4">
          <StyledTextInput
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 mb-4 border border-gray-200 dark:border-gray-700"
            placeholder="Video ara..."
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <CategoryFilter 
            onSelectCategory={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
          
          {filteredVideos.length === 0 ? (
            <StyledView className="flex-1 items-center justify-center py-20">
              <Ionicons name="videocam-outline" size={64} color={isDark ? '#6B7280' : '#9CA3AF'} />
              <StyledText className="text-gray-500 dark:text-gray-400 text-center mt-4 text-lg">
                {searchQuery ? 'Arama sonucu bulunamadı' : 
                  selectedCategory === 'all' 
                    ? 'Henüz video eklenmemiş'
                    : 'Bu kategoride video bulunamadı'}
              </StyledText>
              <StyledText className="text-gray-400 dark:text-gray-500 text-center mt-2">
                {searchQuery ? 'Farklı bir arama terimi deneyin' :
                  selectedCategory === 'all'
                    ? 'Yeni bir video eklemek için + butonuna tıklayın'
                    : 'Farklı bir kategori seçin veya yeni video ekleyin'}
              </StyledText>
            </StyledView>
          ) : (
            <FlatList
              data={filteredVideos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <StyledTouchableOpacity
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4 overflow-hidden"
                  onPress={() => navigateToVideoDetail(item.id)}
                >
                  <StyledImage
                    source={{ uri: item.thumbnailUri || 'https://via.placeholder.com/300x200' }}
                    className="w-full h-40 bg-gray-200 dark:bg-gray-700"
                  />
                  <StyledView className="p-4">
                    <StyledText className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {item.name}
                    </StyledText>
                    {item.description ? (
                      <StyledText className="text-gray-600 dark:text-gray-300 mb-2 text-sm" numberOfLines={2}>
                        {item.description}
                      </StyledText>
                    ) : null}
                    <StyledView className="flex-row justify-between items-center mt-2">
                      <StyledText className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(item.createdAt)}
                      </StyledText>
                      <StyledView className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                        <StyledText className="text-xs text-blue-800 dark:text-blue-300">
                          {item.category === 'family' && 'Aile'}
                          {item.category === 'friends' && 'Arkadaşlar'}
                          {item.category === 'travel' && 'Seyahat'}
                          {item.category === 'events' && 'Etkinlikler'}
                          {item.category === 'memories' && 'Anılar'}
                          {item.category === 'other' && 'Diğer'}
                        </StyledText>
                      </StyledView>
                    </StyledView>
                  </StyledView>
                </StyledTouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          )}
        </StyledView>
        
        <StyledTouchableOpacity
          className="absolute bottom-8 right-8 bg-blue-900 dark:bg-blue-700 w-16 h-16 rounded-full items-center justify-center shadow-lg"
          onPress={navigateToNewVideo}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </StyledTouchableOpacity>
      </StyledView>
    </AnimatedPage>
  );
} 