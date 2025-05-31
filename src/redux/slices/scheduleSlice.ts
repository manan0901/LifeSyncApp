import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for tasks and routines
interface Task {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  location: string;
  recurrence?: 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'monthly' | 'none';
}

interface Routine {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  isActive: boolean;
}

interface ScheduleState {
  dailyTasks: Record<string, Task[]>; // Keyed by date in YYYY-MM-DD format
  routines: Routine[];
  currentDate: string; // YYYY-MM-DD format
}

// Define initial state
const initialState: ScheduleState = {
  dailyTasks: {},
  routines: [],
  currentDate: new Date().toISOString().split('T')[0],
};

// Create the schedule slice
const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<{ date: string; task: Task }>) => {
      const { date, task } = action.payload;
      
      // Initialize the date entry if it doesn't exist
      if (!state.dailyTasks[date]) {
        state.dailyTasks[date] = [];
      }
      
      // Add the task to the specified date
      state.dailyTasks[date].push(task);
    },
    updateTask: (state, action: PayloadAction<{ date: string; taskId: string; updates: Partial<Task> }>) => {
      const { date, taskId, updates } = action.payload;
      
      // Find the task in the specified date and update it
      if (state.dailyTasks[date]) {
        const taskIndex = state.dailyTasks[date].findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
          state.dailyTasks[date][taskIndex] = {
            ...state.dailyTasks[date][taskIndex],
            ...updates
          };
        }
      }
    },
    deleteTask: (state, action: PayloadAction<{ date: string; taskId: string }>) => {
      const { date, taskId } = action.payload;
      
      // Remove the task from the specified date
      if (state.dailyTasks[date]) {
        state.dailyTasks[date] = state.dailyTasks[date].filter(task => task.id !== taskId);
      }
    },
    addRoutine: (state, action: PayloadAction<Routine>) => {
      state.routines.push(action.payload);
    },
    updateRoutine: (state, action: PayloadAction<{ routineId: string; updates: Partial<Routine> }>) => {
      const { routineId, updates } = action.payload;
      
      // Find the routine and update it
      const routineIndex = state.routines.findIndex(routine => routine.id === routineId);
      
      if (routineIndex !== -1) {
        state.routines[routineIndex] = {
          ...state.routines[routineIndex],
          ...updates
        };
      }
    },
    deleteRoutine: (state, action: PayloadAction<string>) => {
      // Remove the routine by ID
      state.routines = state.routines.filter(routine => routine.id !== action.payload);
    },
    setCurrentDate: (state, action: PayloadAction<string>) => {
      state.currentDate = action.payload;
    },
    applyRoutineToDate: (state, action: PayloadAction<{ routineId: string; date: string }>) => {
      const { routineId, date } = action.payload;
      
      // Find the routine
      const routine = state.routines.find(r => r.id === routineId);
      
      if (routine) {
        // Initialize the date entry if it doesn't exist
        if (!state.dailyTasks[date]) {
          state.dailyTasks[date] = [];
        }
        
        // Add all tasks from the routine to the specified date
        routine.tasks.forEach(task => {
          state.dailyTasks[date].push({
            ...task,
            id: `${task.id}-${Date.now()}` // Ensure unique ID
          });
        });
      }
    },
    clearSchedule: () => initialState,
  },
});

// Export actions
export const {
  addTask,
  updateTask,
  deleteTask,
  addRoutine,
  updateRoutine,
  deleteRoutine,
  setCurrentDate,
  applyRoutineToDate,
  clearSchedule,
} = scheduleSlice.actions;

// Export reducer
export default scheduleSlice.reducer;
