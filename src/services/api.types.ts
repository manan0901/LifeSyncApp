// API Types for LifeSync App

// Authentication Types
export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  profileComplete: boolean;
}

// Media API Types
export interface MediaContent {
  id: string;
  title: string;
  artist?: string;
  duration?: number;
  thumbnail?: string;
  url: string;
  platform: 'spotify' | 'youtube' | 'other';
  contentType: 'music' | 'video' | 'podcast' | 'news';
}

export interface MediaSearchParams {
  query: string;
  contentType?: 'music' | 'video' | 'podcast' | 'news';
  platform?: 'spotify' | 'youtube' | 'other';
  limit?: number;
}

// Nutrition API Types
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  servingUnit: string;
  image?: string;
}

export interface NutritionSearchParams {
  query: string;
  limit?: number;
}

// Activity API Types
export interface WorkoutTemplate {
  id: string;
  name: string;
  duration: number;
  caloriesBurned: number;
  exercises: Exercise[];
  intensity: 'low' | 'medium' | 'high';
  category: 'cardio' | 'strength' | 'flexibility' | 'balance' | 'sport';
}

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  restPeriod?: number;
  instructions?: string;
  video?: string;
}

// Mindfulness API Types
export interface MeditationSession {
  id: string;
  title: string;
  duration: number;
  type: 'guided' | 'unguided' | 'breathing' | 'body-scan';
  audioUrl?: string;
  imageUrl?: string;
  description?: string;
}

// Health Tracking API Types
export interface VitalSigns {
  timestamp: number;
  heartRate?: number;
  bloodOxygen?: number;
  steps?: number;
  caloriesBurned?: number;
  sleepHours?: number;
}

export interface WearableDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness-tracker' | 'smart-ring' | 'other';
  connectedAt: number;
  lastSyncAt: number;
  batteryLevel?: number;
}

// Recommendation API Types
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'activity' | 'mindfulness' | 'sleep' | 'productivity';
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  imageUrl?: string;
}

// Supabase Database Types
export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  gender?: string;
  date_of_birth?: string;
  weight?: number;
  height?: number;
  occupation?: string;
  preferences?: {
    media?: string[];
    food?: string[];
    activities?: string[];
    themes?: {
      darkMode: boolean;
      color: string;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface ScheduleItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  type: 'task' | 'meal' | 'activity' | 'work' | 'study' | 'leisure' | 'rest';
  completed: boolean;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface MealEntry {
  id: string;
  user_id: string;
  name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_items: {
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    quantity: number;
    unit: string;
  }[];
  total_calories: number;
  date: string;
  time: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityEntry {
  id: string;
  user_id: string;
  type: 'exercise' | 'work' | 'study' | 'leisure' | 'media';
  name: string;
  duration: number; // in minutes
  calories_burned?: number;
  details?: any;
  date: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface HealthDataEntry {
  id: string;
  user_id: string;
  date: string;
  heart_rate?: number[];
  blood_oxygen?: number;
  sleep?: {
    duration: number; // in minutes
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    start_time: string;
    end_time: string;
    deep_sleep: number; // in minutes
    light_sleep: number; // in minutes
    rem_sleep: number; // in minutes
  };
  stress_level?: number; // 1-10 scale
  hydration?: number; // in ml
  steps?: number;
  bmi?: number;
  created_at: string;
  updated_at: string;
}
