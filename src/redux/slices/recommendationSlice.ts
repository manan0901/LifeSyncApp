import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for recommendations
interface ContentRecommendation {
  id: string;
  title: string;
  type: 'video' | 'music' | 'article' | 'book' | 'podcast' | 'activity';
  source: string;
  url?: string;
  thumbnail?: string;
  description?: string;
  confidence: number; // 0-1 scale representing ML confidence
  tags: string[];
}

interface ScheduleRecommendation {
  id: string;
  title: string;
  description?: string;
  suggestedTime: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  reason: string;
  confidence: number; // 0-1 scale
}

interface HealthRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'exercise' | 'nutrition' | 'rest' | 'hydration' | 'mental';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action?: string;
  confidence: number; // 0-1 scale
}

interface RecommendationState {
  contentRecommendations: ContentRecommendation[];
  scheduleRecommendations: ScheduleRecommendation[];
  healthRecommendations: HealthRecommendation[];
  dismissedRecommendations: string[]; // IDs of dismissed recommendations
  lastUpdated: string; // ISO timestamp
}

// Define initial state
const initialState: RecommendationState = {
  contentRecommendations: [],
  scheduleRecommendations: [],
  healthRecommendations: [],
  dismissedRecommendations: [],
  lastUpdated: new Date().toISOString(),
};

// Create the recommendation slice
const recommendationSlice = createSlice({
  name: 'recommendation',
  initialState,
  reducers: {
    setContentRecommendations: (state, action: PayloadAction<ContentRecommendation[]>) => {
      // Filter out any recommendations that have been dismissed
      state.contentRecommendations = action.payload.filter(
        rec => !state.dismissedRecommendations.includes(rec.id)
      );
      state.lastUpdated = new Date().toISOString();
    },
    addContentRecommendation: (state, action: PayloadAction<ContentRecommendation>) => {
      if (!state.dismissedRecommendations.includes(action.payload.id)) {
        state.contentRecommendations.push(action.payload);
        state.lastUpdated = new Date().toISOString();
      }
    },
    setScheduleRecommendations: (state, action: PayloadAction<ScheduleRecommendation[]>) => {
      state.scheduleRecommendations = action.payload.filter(
        rec => !state.dismissedRecommendations.includes(rec.id)
      );
      state.lastUpdated = new Date().toISOString();
    },
    addScheduleRecommendation: (state, action: PayloadAction<ScheduleRecommendation>) => {
      if (!state.dismissedRecommendations.includes(action.payload.id)) {
        state.scheduleRecommendations.push(action.payload);
        state.lastUpdated = new Date().toISOString();
      }
    },
    setHealthRecommendations: (state, action: PayloadAction<HealthRecommendation[]>) => {
      state.healthRecommendations = action.payload.filter(
        rec => !state.dismissedRecommendations.includes(rec.id)
      );
      state.lastUpdated = new Date().toISOString();
    },
    addHealthRecommendation: (state, action: PayloadAction<HealthRecommendation>) => {
      if (!state.dismissedRecommendations.includes(action.payload.id)) {
        state.healthRecommendations.push(action.payload);
        state.lastUpdated = new Date().toISOString();
      }
    },
    dismissRecommendation: (state, action: PayloadAction<string>) => {
      state.dismissedRecommendations.push(action.payload);
      
      // Remove the recommendation from all lists
      state.contentRecommendations = state.contentRecommendations.filter(
        rec => rec.id !== action.payload
      );
      state.scheduleRecommendations = state.scheduleRecommendations.filter(
        rec => rec.id !== action.payload
      );
      state.healthRecommendations = state.healthRecommendations.filter(
        rec => rec.id !== action.payload
      );
      
      state.lastUpdated = new Date().toISOString();
    },
    clearAllRecommendations: (state) => {
      state.contentRecommendations = [];
      state.scheduleRecommendations = [];
      state.healthRecommendations = [];
      state.lastUpdated = new Date().toISOString();
    },
    resetRecommendations: () => initialState,
  },
});

// Export actions
export const {
  setContentRecommendations,
  addContentRecommendation,
  setScheduleRecommendations,
  addScheduleRecommendation,
  setHealthRecommendations,
  addHealthRecommendation,
  dismissRecommendation,
  clearAllRecommendations,
  resetRecommendations,
} = recommendationSlice.actions;

// Export reducer
export default recommendationSlice.reducer;
