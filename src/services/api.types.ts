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
