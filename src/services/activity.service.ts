import { WorkoutTemplate, Exercise, VitalSigns, WearableDevice } from './api.types';

// Mock service for activity tracking, exercise, productivity monitoring
export class ActivityService {
  // Get workout templates by category
  async getWorkoutTemplates(
    category?: 'cardio' | 'strength' | 'flexibility' | 'balance' | 'sport'
  ): Promise<WorkoutTemplate[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (category) {
      return mockWorkouts.filter(workout => workout.category === category);
    }
    
    return mockWorkouts;
  }
  
  // Get workout template details
  async getWorkoutDetails(workoutId: string): Promise<WorkoutTemplate | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockWorkouts.find(workout => workout.id === workoutId) || null;
  }
  
  // Track completed workout
  async logCompletedWorkout(
    workoutId: string,
    duration: number,
    exercises: { id: string; setsCompleted?: number; repsCompleted?: number }[]
  ): Promise<{ success: boolean; message?: string }> {
    // In a real app, this would update a database
    console.log(`Logged completed workout: ${workoutId}`, { duration, exercises });
    
    return { success: true };
  }
  
  // Track work/study session
  async logWorkSession(
    description: string,
    startTime: number,
    endTime: number,
    category: 'work' | 'study' | 'creative' | 'other',
    productivityRating?: number
  ): Promise<{ success: boolean; message?: string }> {
    // In a real app, this would update a database
    const duration = endTime - startTime;
    console.log(`Logged work session: ${description}`, { duration, category, productivityRating });
    
    return { success: true };
  }
  
  // Connect to wearable device
  async connectWearableDevice(
    deviceType: 'smartwatch' | 'fitness-tracker' | 'smart-ring' | 'other',
    deviceName: string,
    connectionParams: any
  ): Promise<{ success: boolean; device?: WearableDevice; message?: string }> {
    // In a real app, this would handle Bluetooth or API connections
    console.log(`Connecting to ${deviceType}: ${deviceName}`);
    
    // Mock successful connection
    const device: WearableDevice = {
      id: `dev-${Date.now()}`,
      name: deviceName,
      type: deviceType,
      connectedAt: Date.now(),
      lastSyncAt: Date.now(),
      batteryLevel: 75
    };
    
    return { success: true, device };
  }
  
  // Get latest vital signs
  async getVitalSigns(): Promise<VitalSigns> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In a real app, this would fetch data from connected devices
    const mockVitals: VitalSigns = {
      timestamp: Date.now(),
      heartRate: Math.floor(Math.random() * 30) + 60, // 60-90 bpm
      bloodOxygen: Math.floor(Math.random() * 6) + 94, // 94-99%
      steps: Math.floor(Math.random() * 5000) + 2000, // 2000-7000 steps
      caloriesBurned: Math.floor(Math.random() * 500) + 800, // 800-1300 calories
      sleepHours: Math.floor(Math.random() * 4) + 5 // 5-9 hours
    };
    
    return mockVitals;
  }
  
  // Get activity summary for date range
  async getActivitySummary(
    startDate: number,
    endDate: number
  ): Promise<{
    totalSteps: number;
    totalCaloriesBurned: number;
    averageHeartRate: number;
    workoutMinutes: number;
    activeMinutes: number;
  }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // In a real app, this would calculate based on stored user data
    return {
      totalSteps: 32500,
      totalCaloriesBurned: 3200,
      averageHeartRate: 72,
      workoutMinutes: 120,
      activeMinutes: 280
    };
  }
}

// Mock data
const mockExercises: Exercise[] = [
  {
    id: 'ex1',
    name: 'Push-ups',
    sets: 3,
    reps: 15,
    restPeriod: 60,
    instructions: 'Keep your body straight and lower until your chest nearly touches the floor',
    video: 'https://example.com/videos/pushups'
  },
  {
    id: 'ex2',
    name: 'Squats',
    sets: 3,
    reps: 20,
    restPeriod: 60,
    instructions: 'Stand with feet shoulder-width apart and lower as if sitting in a chair',
    video: 'https://example.com/videos/squats'
  },
  {
    id: 'ex3',
    name: 'Plank',
    duration: 60,
    sets: 3,
    restPeriod: 30,
    instructions: 'Maintain a straight line from head to heels while supporting your weight on forearms and toes',
    video: 'https://example.com/videos/plank'
  },
  {
    id: 'ex4',
    name: 'Jogging',
    duration: 1200, // 20 minutes in seconds
    instructions: 'Maintain a comfortable pace that allows you to still speak',
    video: 'https://example.com/videos/jogging'
  },
  {
    id: 'ex5',
    name: 'Jumping Jacks',
    duration: 60,
    sets: 3,
    restPeriod: 15,
    instructions: 'Jump while spreading your legs and bringing your arms above your head',
    video: 'https://example.com/videos/jumping-jacks'
  },
  {
    id: 'ex6',
    name: 'Mountain Climbers',
    duration: 30,
    sets: 3,
    restPeriod: 15,
    instructions: 'Start in plank position and alternate bringing knees to chest',
    video: 'https://example.com/videos/mountain-climbers'
  },
  {
    id: 'ex7',
    name: 'Lunges',
    sets: 3,
    reps: 10,
    restPeriod: 30,
    instructions: 'Step forward with one leg and lower your body until both knees are bent at 90 degrees',
    video: 'https://example.com/videos/lunges'
  }
];

const mockWorkouts: WorkoutTemplate[] = [
  {
    id: 'workout1',
    name: 'Morning Quick HIIT',
    duration: 900, // 15 minutes in seconds
    caloriesBurned: 150,
    intensity: 'high',
    category: 'cardio',
    exercises: [
      mockExercises.find(ex => ex.id === 'ex5')!,
      mockExercises.find(ex => ex.id === 'ex6')!,
      mockExercises.find(ex => ex.id === 'ex1')!
    ]
  },
  {
    id: 'workout2',
    name: 'Full Body Strength',
    duration: 1800, // 30 minutes in seconds
    caloriesBurned: 250,
    intensity: 'medium',
    category: 'strength',
    exercises: [
      mockExercises.find(ex => ex.id === 'ex1')!,
      mockExercises.find(ex => ex.id === 'ex2')!,
      mockExercises.find(ex => ex.id === 'ex3')!,
      mockExercises.find(ex => ex.id === 'ex7')!
    ]
  },
  {
    id: 'workout3',
    name: 'Light Cardio Session',
    duration: 1200, // 20 minutes in seconds
    caloriesBurned: 180,
    intensity: 'low',
    category: 'cardio',
    exercises: [
      mockExercises.find(ex => ex.id === 'ex4')!
    ]
  },
  {
    id: 'workout4',
    name: 'Stretching Routine',
    duration: 600, // 10 minutes in seconds
    caloriesBurned: 70,
    intensity: 'low',
    category: 'flexibility',
    exercises: []
  }
];
