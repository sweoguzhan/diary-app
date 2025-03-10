import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const queryClient = new QueryClient();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            },
            headerTintColor: isDark ? '#F3F4F6' : '#1E3A8A',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            animation: 'slide_from_right',
            animationDuration: 300,
            presentation: 'card',
            contentStyle: {
              backgroundColor: isDark ? '#111827' : '#F9FAFB',
            },
            headerRight: () => <ThemeToggle className="mr-4" />,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'Video Günlüğüm',
              headerLargeTitle: false,
              headerBackVisible: false,
              animation: 'fade',
            }}
          />
          <Stack.Screen
            name="new/index"
            options={{
              title: 'Yeni Video',
              presentation: 'card',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="new/crop"
            options={{
              title: 'Videoyu Kırp',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="new/metadata"
            options={{
              title: 'Video Bilgileri',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="video/[id]"
            options={{
              title: 'Video Detayı',
              animation: 'fade_from_bottom',
            }}
          />
        </Stack>
        <Toast />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
} 