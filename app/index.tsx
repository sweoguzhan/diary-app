import { styled } from 'nativewind';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useVideoStore } from '../store/videoStore';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CategoryFilter } from '../components/ui/CategoryFilter';
import { useState, useMemo, useCallback } from 'react';
import { useColorScheme } from 'nativewind';
import { AnimatedPage } from '../components/ui/AnimatedPage';
import { VideoCard } from '../components/video/VideoCard';
import { Button } from '../components/ui/Button';
import { Video } from '../store/videoStore';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

export default function HomeScreen() {
  const { videos } = useVideoStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [refreshing, setRefreshing] = useState(false);
  
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
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  const renderVideoCard = useCallback(({ item }: { item: Video }) => (
    <VideoCard 
      video={item} 
      onPress={() => navigateToVideoDetail(item.id)} 
    />
  ), [navigateToVideoDetail]);
  
  const EmptyListComponent = useCallback(() => (
    <StyledView className="flex-1 items-center justify-center py-20">
      <Ionicons 
        name="videocam-outline" 
        size={64} 
        color={isDark ? '#6B7280' : '#9CA3AF'} 
      />
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
  ), [isDark, searchQuery, selectedCategory]);
  
  const ItemSeparatorComponent = useCallback(() => (
    <StyledView className="h-4" />
  ), []);
  
  return (
    <AnimatedPage animationType="fade">
      <StyledView className="flex-1 bg-white dark:bg-gray-900">
        <StatusBar style={isDark ? 'light' : 'dark'} />
        
        <StyledView className="px-2 pt-2">
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
          
          <FlatList
            data={filteredVideos}
            keyExtractor={(item) => item.id}
            renderItem={renderVideoCard}
            contentContainerStyle={{ 
              padding: 16,
              paddingBottom: 100,
              flexGrow: 1
            }}
            ListEmptyComponent={EmptyListComponent}
            ItemSeparatorComponent={ItemSeparatorComponent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews={true}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[isDark ? '#60A5FA' : '#1E3A8A']}
                tintColor={isDark ? '#60A5FA' : '#1E3A8A'}
              />
            }
          />
        </StyledView>
        
        <StyledView className="absolute bottom-6 right-6">
          <Button
            title="+"
            onPress={navigateToNewVideo}
            variant="primary"
            className="w-16 h-16 rounded-full"
            textClassName='text-3xl'
          />
        </StyledView>
      </StyledView>
    </AnimatedPage>
  );
} 