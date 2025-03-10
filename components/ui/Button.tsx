import { styled } from 'nativewind';
import { TouchableOpacity, Text, ActivityIndicator, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useColorScheme } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className = '',
  textClassName = '',
  style,
  textStyle
}: ButtonProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 dark:bg-blue-700';
      case 'secondary':
        return 'bg-gray-600 dark:bg-gray-700';
      case 'danger':
        return 'bg-red-600 dark:bg-red-700';
      case 'outline':
        return 'bg-transparent border border-gray-300 dark:border-gray-600';
      default:
        return 'bg-blue-600 dark:bg-blue-700';
    }
  };
  
  const getTextStyle = () => {
    if (variant === 'outline') {
      return 'text-gray-800 dark:text-white';
    }
    return 'text-white';
  };
  
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`py-3 px-6 rounded-lg ${getButtonStyle()} ${disabled ? 'opacity-50' : ''} ${className}`}
      style={style}
    >
      {isLoading ? (
        <ActivityIndicator color={isDark ? '#FFFFFF' : '#FFFFFF'} />
      ) : (
        <StyledText 
          className={`text-center font-medium ${getTextStyle()} ${textClassName}`}
          style={textStyle}
        >
          {title}
        </StyledText>
      )}
    </StyledTouchableOpacity>
  );
} 