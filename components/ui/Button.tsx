import { styled } from 'nativewind';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledActivityIndicator = styled(ActivityIndicator);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className = '',
}: ButtonProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          button: `bg-blue-900 dark:bg-blue-700 ${disabled ? 'opacity-50' : ''}`,
          text: 'text-white font-medium',
        };
      case 'secondary':
        return {
          button: `bg-gray-200 dark:bg-gray-700 ${disabled ? 'opacity-50' : ''}`,
          text: 'text-gray-800 dark:text-gray-100 font-medium',
        };
      case 'outline':
        return {
          button: `border border-blue-900 dark:border-blue-700 bg-transparent ${disabled ? 'opacity-50' : ''}`,
          text: 'text-blue-900 dark:text-blue-400 font-medium',
        };
      case 'danger':
        return {
          button: `bg-red-600 dark:bg-red-700 ${disabled ? 'opacity-50' : ''}`,
          text: 'text-white font-medium',
        };
      default:
        return {
          button: `bg-blue-900 dark:bg-blue-700 ${disabled ? 'opacity-50' : ''}`,
          text: 'text-white font-medium',
        };
    }
  };

  const { button, text } = getVariantStyles();

  return (
    <StyledTouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`py-3 px-6 rounded-lg items-center justify-center ${button} ${className}`}
    >
      {isLoading ? (
        <StyledActivityIndicator
          size="small"
          color={variant === 'outline' ? (isDark ? '#93C5FD' : '#1E3A8A') : '#FFFFFF'}
        />
      ) : (
        <StyledText className={`text-base ${text}`}>{title}</StyledText>
      )}
    </StyledTouchableOpacity>
  );
} 