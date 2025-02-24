import { create } from "zustand";

// Define Project Type
type Project = {
  _id: string;
  name: string;
  description: string;
  image: string;
  projectType: string;
  createdAt: string;
};

// Zustand Store
type ProjectStore = {
  projects: Project[];  // List of projects
  currentProject: Project | null; // Selected project
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project) => void;
  clearCurrentProject: () => void;
};

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  currentProject: null,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  clearCurrentProject: () => set({ currentProject: null }),
}));
