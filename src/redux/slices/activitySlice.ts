import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for activity tracking
interface Exercise {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
  duration: number; // in minutes
  caloriesBurned: number;
  intensity: 'low' | 'moderate' | 'high';
  notes?: string;
}

interface WorkSession {
  id: string;
  title: string;
  category: 'work' | 'study' | 'focus';
  startTime: string;
  endTime: string;
  productivity: number; // 1-10 scale
  notes?: string;
}

interface MediaConsumption {
  id: string;
  mediaType: 'video' | 'music' | 'reading' | 'social' | 'browsing' | 'gaming' | 'other';
  title: string;
  platform: string;
  duration: number; // in minutes
  startTime: string;
  endTime?: string;
}

interface VitalSigns {
  timestamp: string;
  heartRate?: number; // BPM
  bloodOxygen?: number; // SpO2 percentage
  stressLevel?: number; // 1-10 scale
  steps?: number;
  sleep?: {
    duration: number; // in hours
    quality: number; // 1-10 scale
    startTime: string;
    endTime: string;
  };
}

interface ActivityState {
  exercises: Record<string, Exercise[]>; // Keyed by date in YYYY-MM-DD format
  workSessions: Record<string, WorkSession[]>; // Keyed by date
  mediaConsumption: Record<string, MediaConsumption[]>; // Keyed by date
  vitalSigns: Record<string, VitalSigns[]>; // Keyed by date
  dailySteps: Record<string, number>; // Keyed by date
  connectedDevices: string[]; // IDs or names of connected smartwatches/wearables
}

// Define initial state
const initialState: ActivityState = {
  exercises: {},
  workSessions: {},
  mediaConsumption: {},
  vitalSigns: {},
  dailySteps: {},
  connectedDevices: [],
};

// Create the activity slice
const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    addExercise: (state, action: PayloadAction<{ date: string; exercise: Exercise }>) => {
      const { date, exercise } = action.payload;
      
      // Initialize the date entry if it doesn't exist
      if (!state.exercises[date]) {
        state.exercises[date] = [];
      }
      
      // Add the exercise to the specified date
      state.exercises[date].push(exercise);
    },
    updateExercise: (state, action: PayloadAction<{ date: string; exerciseId: string; updates: Partial<Exercise> }>) => {
      const { date, exerciseId, updates } = action.payload;
      
      if (state.exercises[date]) {
        const index = state.exercises[date].findIndex(ex => ex.id === exerciseId);
        if (index !== -1) {
          state.exercises[date][index] = { ...state.exercises[date][index], ...updates };
        }
      }
    },
    deleteExercise: (state, action: PayloadAction<{ date: string; exerciseId: string }>) => {
      const { date, exerciseId } = action.payload;
      
      if (state.exercises[date]) {
        state.exercises[date] = state.exercises[date].filter(ex => ex.id !== exerciseId);
      }
    },
    addWorkSession: (state, action: PayloadAction<{ date: string; session: WorkSession }>) => {
      const { date, session } = action.payload;
      
      if (!state.workSessions[date]) {
        state.workSessions[date] = [];
      }
      
      state.workSessions[date].push(session);
    },
    updateWorkSession: (state, action: PayloadAction<{ date: string; sessionId: string; updates: Partial<WorkSession> }>) => {
      const { date, sessionId, updates } = action.payload;
      
      if (state.workSessions[date]) {
        const index = state.workSessions[date].findIndex(session => session.id === sessionId);
        if (index !== -1) {
          state.workSessions[date][index] = { ...state.workSessions[date][index], ...updates };
        }
      }
    },
    deleteWorkSession: (state, action: PayloadAction<{ date: string; sessionId: string }>) => {
      const { date, sessionId } = action.payload;
      
      if (state.workSessions[date]) {
        state.workSessions[date] = state.workSessions[date].filter(session => session.id !== sessionId);
      }
    },
    recordMediaConsumption: (state, action: PayloadAction<{ date: string; media: MediaConsumption }>) => {
      const { date, media } = action.payload;
      
      if (!state.mediaConsumption[date]) {
        state.mediaConsumption[date] = [];
      }
      
      state.mediaConsumption[date].push(media);
    },
    updateMediaConsumption: (state, action: PayloadAction<{ date: string; mediaId: string; updates: Partial<MediaConsumption> }>) => {
      const { date, mediaId, updates } = action.payload;
      
      if (state.mediaConsumption[date]) {
        const index = state.mediaConsumption[date].findIndex(m => m.id === mediaId);
        if (index !== -1) {
          state.mediaConsumption[date][index] = { ...state.mediaConsumption[date][index], ...updates };
        }
      }
    },
    recordVitalSigns: (state, action: PayloadAction<{ date: string; vitals: VitalSigns }>) => {
      const { date, vitals } = action.payload;
      
      if (!state.vitalSigns[date]) {
        state.vitalSigns[date] = [];
      }
      
      state.vitalSigns[date].push(vitals);
    },
    updateDailySteps: (state, action: PayloadAction<{ date: string; steps: number }>) => {
      const { date, steps } = action.payload;
      state.dailySteps[date] = steps;
    },
    addConnectedDevice: (state, action: PayloadAction<string>) => {
      if (!state.connectedDevices.includes(action.payload)) {
        state.connectedDevices.push(action.payload);
      }
    },
    removeConnectedDevice: (state, action: PayloadAction<string>) => {
      state.connectedDevices = state.connectedDevices.filter(device => device !== action.payload);
    },
    resetActivityData: () => initialState,
  },
});

// Export actions
export const {
  addExercise,
  updateExercise,
  deleteExercise,
  addWorkSession,
  updateWorkSession,
  deleteWorkSession,
  recordMediaConsumption,
  updateMediaConsumption,
  recordVitalSigns,
  updateDailySteps,
  addConnectedDevice,
  removeConnectedDevice,
  resetActivityData,
} = activitySlice.actions;

// Export reducer
export default activitySlice.reducer;
