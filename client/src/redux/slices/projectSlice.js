import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/projectService';

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      return await projectService.getProjects(filters);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectDetails = createAsyncThunk(
  'projects/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      return await projectService.getProjectById(id);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch project details');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, { rejectWithValue }) => {
    try {
      return await projectService.createProject(projectData);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create project');
    }
  }
);

export const fetchMyProjects = createAsyncThunk(
  'projects/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      return await projectService.getMyProjects();
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch your projects');
    }
  }
);

const initialState = {
  projects: [],
  myProjects: [],
  currentProject: null,
  pagination: {
    total: 0,
    pages: 1,
    page: 1,
    limit: 10,
  },
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects;
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Details
      .addCase(fetchProjectDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload.project;
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload.project);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Projects
      .addCase(fetchMyProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.myProjects = action.payload.projects;
      })
      .addCase(fetchMyProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
