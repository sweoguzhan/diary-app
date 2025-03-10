import { styled } from 'nativewind';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  label?: string;
  error?: string;
}

export function CategorySelector({ 
  selectedCategory, 
  onSelectCategory,
  label,
  error
}: CategorySelectorProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const categories = [
    { id: 'family', name: 'Aile' },
    { id: 'friends', name: 'Arkadaşlar' },
    { id: 'travel', name: 'Seyahat' },
    { id: 'events', name: 'Etkinlikler' },
    { id: 'memories', name: 'Anılar' },
    { id: 'other', name: 'Diğer' },
  ];
  
  return (
    <StyledView className="mb-4">
      {label && (
        <StyledText className="text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </StyledText>
      )}
      
      <StyledScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="mb-1"
      >
        {categories.map((category) => (
          <StyledTouchableOpacity
            key={category.id}
            className={`mr-2 px-4 py-2 rounded-full ${
              selectedCategory === category.id
                ? 'bg-blue-600 dark:bg-blue-800'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onPress={() => onSelectCategory(category.id)}
          >
            <StyledText
              className={`${
                selectedCategory === category.id
                  ? 'text-white'
                  : 'text-gray-800 dark:text-gray-200'
              }`}
            >
              {category.name}
            </StyledText>
          </StyledTouchableOpacity>
        ))}
      </StyledScrollView>
      
      {error && (
        <StyledText className="text-red-500 text-sm mt-1">
          {error}
        </StyledText>
      )}
    </StyledView>
  );
} 