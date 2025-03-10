import { ReactNode } from 'react';
import { View } from 'react-native';
import { styled } from 'nativewind';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS,
  Easing
} from 'react-native-reanimated';
import { useEffect } from 'react';

const StyledView = styled(View);
const AnimatedView = Animated.createAnimatedComponent(styled(View));

interface AnimatedPageProps {
  children: ReactNode;
  onAnimationComplete?: () => void;
  animationType?: 'fade' | 'slide' | 'scale';
  duration?: number;
}

export function AnimatedPage({ 
  children, 
  onAnimationComplete, 
  animationType = 'fade',
  duration = 300
}: AnimatedPageProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const scale = useSharedValue(0.9);
  
  useEffect(() => {
    const animations = () => {
      opacity.value = withTiming(1, { 
        duration,
        easing: Easing.out(Easing.cubic)
      });
      
      if (animationType === 'slide' || animationType === 'scale') {
        translateY.value = withTiming(0, { 
          duration,
          easing: Easing.out(Easing.cubic)
        });
      }
      
      if (animationType === 'scale') {
        scale.value = withTiming(1, { 
          duration,
          easing: Easing.out(Easing.cubic)
        }, () => {
          if (onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        });
      } else if (onAnimationComplete) {
        setTimeout(onAnimationComplete, duration);
      }
    };
    
    animations();
    
    return () => {
    };
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    const styles: any = {
      opacity: opacity.value
    };
    
    if (animationType === 'slide' || animationType === 'scale') {
      styles.transform = [{ translateY: translateY.value }];
    }
    
    if (animationType === 'scale') {
      styles.transform = [
        ...(styles.transform || []),
        { scale: scale.value }
      ];
    }
    
    return styles;
  });
  
  return (
    <StyledView className="flex-1">
      <AnimatedView className="flex-1" style={animatedStyle}>
        {children}
      </AnimatedView>
    </StyledView>
  );
} 