import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type VideoCategory = 'family' | 'friends' | 'travel' | 'events' | 'memories' | 'other';

const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

export interface Video {
  id: string;
  name: string;
  description?: string;
  uri: string;
  thumbnailUri: string;
  createdAt: string | Date;
  category: VideoCategory;
}

interface VideoState {
  videos: Video[];
  selectedVideoUri: string | null;
  cropStartTime: number;
  cropEndTime: number;
  
  // Actions
  addVideo: (video: Omit<Video, 'id' | 'createdAt'>) => void;
  updateVideo: (id: string, data: Partial<Omit<Video, 'id' | 'createdAt' | 'uri' | 'thumbnailUri'>>) => void;
  deleteVideo: (id: string) => void;
  setSelectedVideoUri: (uri: string) => void;
  setCropStartTime: (time: number) => void;
  setCropEndTime: (time: number) => void;
  clearSelectedVideo: () => void;
}

export const useVideoStore = create<VideoState>()(
  persist(
    (set) => ({
      videos: [],
      selectedVideoUri: null,
      cropStartTime: 0,
      cropEndTime: 0,
      
      addVideo: (video) => {
        set((state) => ({
          videos: [
            {
              ...video,
              id: generateId(),
              createdAt: new Date().toISOString(),
            },
            ...state.videos,
          ],
        }));
      },
      
      updateVideo: (id, data) => set((state) => ({
        videos: state.videos.map((video) =>
          video.id === id ? { ...video, ...data } : video
        ),
      })),
      
      deleteVideo: (id) => set((state) => ({
        videos: state.videos.filter((video) => video.id !== id),
      })),
      
      setSelectedVideoUri: (uri) => set({
        selectedVideoUri: uri,
      }),
      
      setCropStartTime: (time) => set({
        cropStartTime: time,
      }),
      
      setCropEndTime: (time) => set({
        cropEndTime: time,
      }),
      
      clearSelectedVideo: () => set({
        selectedVideoUri: null,
        cropStartTime: 0,
        cropEndTime: 0,
      }),
    }),
    {
      name: 'video-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ videos: state.videos }),
    }
  )
); 