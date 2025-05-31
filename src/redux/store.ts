import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from './slices/userSlice';
import scheduleReducer from './slices/scheduleSlice';
import nutritionReducer from './slices/nutritionSlice';
import activityReducer from './slices/activitySlice';
import recommendationReducer from './slices/recommendationSlice';

// Configure persistence
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  // Whitelist specific reducers for persistence
  whitelist: ['user', 'schedule', 'nutrition', 'activity'],
};

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  schedule: scheduleReducer,
  nutrition: nutritionReducer,
  activity: activityReducer,
  recommendation: recommendationReducer,
});

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create the persistor
export const persistor = persistStore(store);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState> & {
  user: {
    profile: {
      name: string;
      gender: string;
      dateOfBirth: string;
      weight: number;
      height: number;
      profession: string;
      bmi?: number;
    };
    preferences: {
      mediaPreferences: string[];
      foodPreferences: string[];
      activityPreferences: string[];
      dietaryRestrictions: string[];
    };
    settings: {
      notifications: boolean;
      darkMode: boolean;
      language: string;
      privacySettings: {
        activityTracking: boolean;
        healthDataSharing: boolean;
      };
    };
    isOnboarded: boolean;
    healthStatus: string;
  };
  schedule: {
    dailyTasks: Record<string, any[]>;
    routines: any[];
    currentDate: string;
  };
  activity: {
    exercises: Record<string, any[]>;
    workSessions: Record<string, any[]>;
    mediaConsumption: Record<string, any[]>;
    vitalSigns: Record<string, any[]>;
    dailySteps: Record<string, number>;
    connectedDevices: string[];
  };
  nutrition: any;
  recommendation: any;
};
export type AppDispatch = typeof store.dispatch;
