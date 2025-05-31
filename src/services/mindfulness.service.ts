import { MeditationSession } from './api.types';

// Mock service for mindfulness, meditation, and mental wellbeing
export class MindfulnessService {
  // Get meditation sessions
  async getMeditationSessions(
    type?: 'guided' | 'unguided' | 'breathing' | 'body-scan',
    duration?: number // in seconds, for filtering by max duration
  ): Promise<MeditationSession[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let sessions = [...mockMeditationSessions];
    
    if (type) {
      sessions = sessions.filter(session => session.type === type);
    }
    
    if (duration) {
      sessions = sessions.filter(session => session.duration <= duration);
    }
    
    return sessions;
  }
  
  // Get meditation session details
  async getMeditationSessionDetails(sessionId: string): Promise<MeditationSession | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockMeditationSessions.find(session => session.id === sessionId) || null;
  }
  
  // Log completed meditation session
  async logCompletedMeditation(
    sessionId: string,
    completedDuration: number, // in seconds
    userRating?: number, // 1-5 stars
    mood?: string
  ): Promise<{ success: boolean; message?: string }> {
    // In a real app, this would update a database
    console.log(`Logged meditation session: ${sessionId}`, { completedDuration, userRating, mood });
    
    return { success: true };
  }
  
  // Log mood entry
  async logMoodEntry(
    mood: string,
    intensity: number, // 1-10
    notes?: string
  ): Promise<{ success: boolean; message?: string }> {
    // In a real app, this would update a database
    console.log(`Logged mood entry: ${mood}`, { intensity, notes });
    
    return { success: true };
  }
  
  // Get guided breathing exercise
  async getBreathingExercise(
    type: 'relaxation' | 'energizing' | 'balance' | 'sleep'
  ): Promise<{
    name: string;
    description: string;
    inhaleDuration: number; // in seconds
    holdDuration: number; // in seconds
    exhaleDuration: number; // in seconds
    repetitions: number;
  }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const exercises = {
      relaxation: {
        name: '4-7-8 Breathing',
        description: 'Breathe in for 4 seconds, hold for 7 seconds, exhale for 8 seconds. This pattern helps reduce anxiety and promote relaxation.',
        inhaleDuration: 4,
        holdDuration: 7,
        exhaleDuration: 8,
        repetitions: 5
      },
      energizing: {
        name: 'Energizing Breath',
        description: 'Quick inhalations and exhalations to increase energy and alertness.',
        inhaleDuration: 1,
        holdDuration: 0,
        exhaleDuration: 1,
        repetitions: 20
      },
      balance: {
        name: 'Box Breathing',
        description: 'Equal duration for inhale, hold, exhale, and post-exhale hold. Creates a feeling of balance and centeredness.',
        inhaleDuration: 4,
        holdDuration: 4,
        exhaleDuration: 4,
        repetitions: 10
      },
      sleep: {
        name: 'Sleep Preparation',
        description: 'Gradually lengthening exhales to prepare the body for sleep.',
        inhaleDuration: 4,
        holdDuration: 2,
        exhaleDuration: 6,
        repetitions: 8
      }
    };
    
    return exercises[type] || exercises.relaxation;
  }
  
  // Get screen time statistics
  async getDigitalWellbeing(): Promise<{
    totalScreenTime: number; // in minutes
    appUsageStats: { appName: string; usageMinutes: number }[];
    unlockCount: number;
    notificationCount: number;
  }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, this would connect to system APIs
    return {
      totalScreenTime: 248, // mock: 4 hours 8 minutes
      appUsageStats: [
        { appName: 'Instagram', usageMinutes: 45 },
        { appName: 'YouTube', usageMinutes: 65 },
        { appName: 'Gmail', usageMinutes: 22 },
        { appName: 'Chrome', usageMinutes: 53 },
        { appName: 'WhatsApp', usageMinutes: 38 }
      ],
      unlockCount: 52,
      notificationCount: 87
    };
  }
}

// Mock data
const mockMeditationSessions: MeditationSession[] = [
  {
    id: 'med1',
    title: 'Morning Mindfulness',
    duration: 300, // 5 minutes in seconds
    type: 'guided',
    audioUrl: 'https://example.com/meditations/morning-mindfulness.mp3',
    imageUrl: 'https://example.com/images/morning-mindfulness.jpg',
    description: 'Start your day with clarity and purpose. This short meditation helps you set intentions for the day ahead.'
  },
  {
    id: 'med2',
    title: 'Deep Relaxation',
    duration: 900, // 15 minutes in seconds
    type: 'guided',
    audioUrl: 'https://example.com/meditations/deep-relaxation.mp3',
    imageUrl: 'https://example.com/images/deep-relaxation.jpg',
    description: 'Release tension and find complete relaxation. Perfect for unwinding after a busy day.'
  },
  {
    id: 'med3',
    title: 'Focus Breath',
    duration: 180, // 3 minutes in seconds
    type: 'breathing',
    audioUrl: 'https://example.com/meditations/focus-breath.mp3',
    imageUrl: 'https://example.com/images/focus-breath.jpg',
    description: 'A quick breathing exercise to enhance concentration before important tasks.'
  },
  {
    id: 'med4',
    title: 'Body Awareness Scan',
    duration: 600, // 10 minutes in seconds
    type: 'body-scan',
    audioUrl: 'https://example.com/meditations/body-scan.mp3',
    imageUrl: 'https://example.com/images/body-scan.jpg',
    description: 'Bring awareness to each part of your body, releasing tension and increasing physical mindfulness.'
  },
  {
    id: 'med5',
    title: 'Silent Reflection',
    duration: 300, // 5 minutes in seconds
    type: 'unguided',
    imageUrl: 'https://example.com/images/silent-reflection.jpg',
    description: 'A timer for self-guided meditation without verbal instructions.'
  }
];
