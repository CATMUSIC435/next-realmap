import { create } from 'zustand';

interface MapStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  
  isSheetOpen: boolean;
  setIsSheetOpen: (isOpen: boolean) => void;
  
  selectedProject: any | null;
  setSelectedProject: (project: any | null) => void;
  
  highlightedId: number | string | null;
  setHighlightedId: (id: number | string | null) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  isSidebarOpen: true,
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  isSheetOpen: false,
  setIsSheetOpen: (isOpen) => set({ isSheetOpen: isOpen }),
  
  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),
  
  highlightedId: null,
  setHighlightedId: (id) => set({ highlightedId: id }),
}));
