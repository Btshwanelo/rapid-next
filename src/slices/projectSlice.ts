import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Project {
  _id: string;
  name: string;
  description: string;
  image: string;
  projectType: string;
  createdAt: string;
}

interface ProjectState {
  currentProject: Project | null;
}

const initialState: ProjectState = {
  currentProject: null,
};

const projectSlice = createSlice({
  name: "currentProject",
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    updateCurrentProject: (state, action: PayloadAction<Partial<Project>>) => {
      if (state.currentProject) {
        state.currentProject = { ...state.currentProject, ...action.payload };
      }
    },
  },
});

export const { setCurrentProject, clearCurrentProject, updateCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
