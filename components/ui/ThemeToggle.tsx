import { styled } from 'nativewind';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring
} from 'react-native-reanimated';

const StyledTouchableOpacity = styled(TouchableOpacity);
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const rotation = useSharedValue(isDark ? 180 : 0);
  const scale = useSharedValue(1);
  
  const toggleTheme = () => {
    scale.value = withSpring(0.7, {}, () => {
      scale.value = withSpring(1);
    });
    
    rotation.value = withTiming(isDark ? 0 : 180, { duration: 400 });
    
    toggleColorScheme();
  };
  
  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value }
      ]
    };
  });
  
  return (
    <StyledTouchableOpacity
      onPress={toggleTheme}
      className={`p-2 ${className}`}
      accessibilityLabel={isDark ? 'Aydınlık temaya geç' : 'Karanlık temaya geç'}
    >
      <Animated.View style={iconStyle}>
        <Ionicons 
          name={isDark ? 'sunny' : 'moon'} 
          size={24} 
          color={isDark ? '#fbbf24' : '#4b5563'} 
        />
      </Animated.View>
    </StyledTouchableOpacity>
  );
} 