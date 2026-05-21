import { create } from 'zustand';
import * as THREE from 'three';

interface ProjectData {
  id: string;
  name: string;
  pos: THREE.Vector3;
}

interface AppState {
  cameraTarget: THREE.Vector3 | null;
  setCameraTarget: (target: THREE.Vector3 | null) => void;
  projects: ProjectData[];
  setProjects: (projects: ProjectData[]) => void;
}

export const useStore = create<AppState>((set) => ({
  cameraTarget: null,
  setCameraTarget: (target) => set({ cameraTarget: target }),
  projects: [],
  setProjects: (projects) => set({ projects }),
}));
