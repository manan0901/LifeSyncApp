import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for user state
interface UserProfile {
  name: string;
  gender: 'male' | 'female' | 'other' | '';
  dateOfBirth: string;
  weight: number;
  height: number;
  profession: string;
  bmi?: number;
}

interface UserPreferences {
  mediaPreferences: string[];
  foodPreferences: string[];
  activityPreferences: string[];
  dietaryRestrictions: string[];
}

interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  privacySettings: {
    activityTracking: boolean;
    healthDataSharing: boolean;
  };
}

interface UserState {
  profile: UserProfile;
  preferences: UserPreferences;
  settings: UserSettings;
  isOnboarded: boolean;
  healthStatus: string;
}

// Define initial state
const initialState: UserState = {
  profile: {
    name: '',
    gender: '',
    dateOfBirth: '',
    weight: 0,
    height: 0,
    profession: '',
    bmi: 0,
  },
  preferences: {
    mediaPreferences: [],
    foodPreferences: [],
    activityPreferences: [],
    dietaryRestrictions: [],
  },
  settings: {
    notifications: true,
    darkMode: false,
    language: 'en',
    privacySettings: {
      activityTracking: true,
      healthDataSharing: false,
    },
  },
  isOnboarded: false,
  healthStatus: 'unknown',
};

// Create the user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
      
      // Calculate BMI if both height and weight are available
      if (state.profile.height > 0 && state.profile.weight > 0) {
        // BMI formula: weight(kg) / (height(m))²
        const heightInMeters = state.profile.height / 100;
        state.profile.bmi = state.profile.weight / (heightInMeters * heightInMeters);
        
        // Update health status based on BMI
        if (state.profile.bmi < 18.5) {
          state.healthStatus = 'underweight';
        } else if (state.profile.bmi >= 18.5 && state.profile.bmi < 25) {
          state.healthStatus = 'normal';
        } else if (state.profile.bmi >= 25 && state.profile.bmi < 30) {
          state.healthStatus = 'overweight';
        } else {
          state.healthStatus = 'obese';
        }
      }
    },
    setPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    updateSettings: (state, action: PayloadAction<Partial<UserSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    completeOnboarding: (state) => {
      state.isOnboarded = true;
    },
    setHealthStatus: (state, action: PayloadAction<string>) => {
      state.healthStatus = action.payload;
    },
    resetUser: () => initialState,
  },
});

// Export actions
export const {
  setProfile,
  setPreferences,
  updateSettings,
  completeOnboarding,
  setHealthStatus,
  resetUser,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
