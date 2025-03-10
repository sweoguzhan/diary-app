import { styled } from 'nativewind';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useVideoStore } from '../../store/videoStore';
import { Button } from '../../components/ui/Button';
import { FormInput } from '../../components/ui/FormInput';
import { videoSchema, VideoForm } from '../../schemas/videoSchemas';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { CategorySelector } from '../../components/ui/CategorySelector';
import { useVideoThumbnail } from '../../hooks/useVideoThumbnail';
import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

export default function MetadataScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isSaving, setIsSaving] = useState(false);
  
  const { 
    selectedVideoUri, 
    cropStartTime, 
    cropEndTime, 
    addVideo, 
    clearSelectedVideo
  } = useVideoStore();
  
  const { generateThumbnail, isLoading } = useVideoThumbnail();
  
  const { control, handleSubmit, formState: { errors } } = useForm<VideoForm>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'family'
    }
  });
  
  const onSubmit = async (data: VideoForm) => {
    if (!selectedVideoUri || isSaving) {
      return;
    }
    
    try {
      setIsSaving(true);
      
      const thumbnailUri = await generateThumbnail(selectedVideoUri, cropStartTime);
      
      addVideo({
        name: data.name,
        description: data.description,
        uri: selectedVideoUri,
        thumbnailUri,
        category: data.category,
        cropStartTime: cropStartTime,
        cropEndTime: cropEndTime
      });
      
      clearSelectedVideo();

      Toast.show({
        text1: 'Video kaydedildi',
        type: 'success',
        visibilityTime: 3000,
        autoHide: true      
      });
      
      try {
        while (router.canGoBack()) {
          router.back();
        }
        
        setTimeout(() => {
          router.push('/');
        }, 100);
      } catch (error) {
        console.error('Navigasyon hatası:', error);
        router.replace('/');
      }
      
    } catch (error) {
      setIsSaving(false);
      Alert.alert(
        "Hata",
        "Video kaydedilirken bir hata oluştu.",
        [{ text: "Tamam" }]
      );
    }
  };
  
  if (!selectedVideoUri) {
    return (
      <StyledView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
        <StyledText className="text-gray-600 dark:text-gray-400">
          Lütfen önce bir video seçin.
        </StyledText>
        <Button
          title="Video Seç"
          onPress={() => router.push('/new')}
          variant="primary"
          className="mt-4"
        />
      </StyledView>
    );
  }
  
  return (
    <StyledView className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <StyledScrollView 
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <FormInput
          control={control}
          name="name"
          label="Video Adı"
          placeholder="Videonuza bir isim verin"
          error={errors.name?.message}
        />
        
        <FormInput
          control={control}
          name="description"
          label="Açıklama"
          placeholder="Videonuz hakkında kısa bir açıklama yazın (isteğe bağlı)"
          multiline
          error={errors.description?.message}
        />
        
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <CategorySelector
              selectedCategory={value}
              onSelectCategory={onChange}
              label="Kategori"
              error={errors.category?.message}
            />
          )}
        />
        
        <StyledView className="mt-8">
          <Button
            title={(isLoading || isSaving) ? "İşleniyor..." : "Kaydet"}
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            disabled={isLoading || isSaving}
          />
          
          {(isLoading || isSaving) && (
            <StyledView className="items-center mt-4">
              <ActivityIndicator size="large" color={isDark ? '#60a5fa' : '#3b82f6'} />
              <StyledText className="text-gray-600 dark:text-gray-400 mt-2">
                {isLoading ? "Video işleniyor..." : "Video kaydediliyor..."}
              </StyledText>
            </StyledView>
          )}
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
} 