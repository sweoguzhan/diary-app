import { router } from 'expo-router';

export function navigateToHome() {
  // Mevcut ekranı kapat ve ana sayfaya git
  router.navigate('/');
  
  setTimeout(() => {
    router.setParams({});
  }, 100);
} 