import { styled } from 'nativewind';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledAnimatedView = styled(Animated.View);

type NotificationType = 'success' | 'error' | 'info' | 'warning';

type NotificationProps = {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
};

export function Notification({ 
  type, 
  title, 
  message, 
  duration = 3000, 
  onClose 
}: NotificationProps) {
  const [visible, setVisible] = useState(true);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  
  const getIconName = () => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'close-circle';
      case 'warning': return 'warning';
      case 'info': return 'information-circle';
      default: return 'information-circle';
    }
  };
  
  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-blue-500';
    }
  };
  
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    const timer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
        onClose && onClose();
      });
    }, duration);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!visible) return null;
  
  return (
    <StyledAnimatedView 
      className={`absolute top-10 left-4 right-4 rounded-lg shadow-lg ${getBackgroundColor()} p-4 flex-row items-center`}
      style={{ transform: [{ translateY: slideAnim }] }}
    >
      <Ionicons name={getIconName()} size={24} color="white" />
      
      <StyledView className="flex-1 ml-3">
        <StyledText className="text-white font-bold">{title}</StyledText>
        <StyledText className="text-white opacity-90">{message}</StyledText>
      </StyledView>
      
      <StyledTouchableOpacity 
        onPress={() => {
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setVisible(false);
            onClose && onClose();
          });
        }}
      >
        <Ionicons name="close" size={20} color="white" />
      </StyledTouchableOpacity>
    </StyledAnimatedView>
  );
} 