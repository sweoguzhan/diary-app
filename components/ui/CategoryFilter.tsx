import { styled } from 'nativewind';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useColorScheme } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

const categories = [
  { id: 'all', name: 'Tümü' },
  { id: 'family', name: 'Aile' },
  { id: 'friends', name: 'Arkadaşlar' },
  { id: 'travel', name: 'Seyahat' },
  { id: 'events', name: 'Etkinlikler' },
  { id: 'memories', name: 'Anılar' },
  { id: 'other', name: 'Diğer' },
];

interface CategoryFilterProps {
  onSelectCategory: (categoryId: string) => void;
  selectedCategory?: string;
}

export function CategoryFilter({ 
  onSelectCategory,
  selectedCategory = 'all'
}: CategoryFilterProps) {
  const [selected, setSelected] = useState(selectedCategory);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const handleSelect = (categoryId: string) => {
    setSelected(categoryId);
    onSelectCategory(categoryId);
  };
  
  return (
    <StyledScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="mb-4"
    >
      <StyledView className="flex-row">
        {categories.map((category) => (
          <StyledTouchableOpacity
            key={category.id}
            onPress={() => handleSelect(category.id)}
            className={`mr-2 px-4 py-2 rounded-full ${
              selected === category.id
                ? isDark ? 'bg-blue-800' : 'bg-blue-900'
                : isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}
          >
            <StyledText
              className={`${
                selected === category.id
                  ? 'text-white font-medium'
                  : isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {category.name}
            </StyledText>
          </StyledTouchableOpacity>
        ))}
      </StyledView>
    </StyledScrollView>
  );
} 