import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for nutrition tracking
interface NutrientInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FoodItem {
  id: string;
  name: string;
  nutrients: NutrientInfo;
  servingSize: string;
  servingWeight: number; // in grams
}

interface Meal {
  id: string;
  name: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  foods: Array<{
    foodId: string;
    portions: number;
    customNutrients?: NutrientInfo;
  }>;
  totalNutrients: NutrientInfo;
}

interface NutritionState {
  foodDatabase: FoodItem[];
  mealHistory: Record<string, Meal[]>; // Keyed by date in YYYY-MM-DD format
  dailyGoals: NutrientInfo;
  dietaryPreferences: {
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
    allergies: string[];
    customRestrictions: string[];
  };
  waterIntake: Record<string, number>; // Keyed by date, value in ml
}

// Define initial state
const initialState: NutritionState = {
  foodDatabase: [],
  mealHistory: {},
  dailyGoals: {
    calories: 2000,
    protein: 50,
    carbs: 275,
    fat: 78,
  },
  dietaryPreferences: {
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isDairyFree: false,
    allergies: [],
    customRestrictions: [],
  },
  waterIntake: {},
};

// Create the nutrition slice
const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    addFoodToDatabase: (state, action: PayloadAction<FoodItem>) => {
      state.foodDatabase.push(action.payload);
    },
    updateFoodInDatabase: (state, action: PayloadAction<FoodItem>) => {
      const index = state.foodDatabase.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.foodDatabase[index] = action.payload;
      }
    },
    deleteFoodFromDatabase: (state, action: PayloadAction<string>) => {
      state.foodDatabase = state.foodDatabase.filter(item => item.id !== action.payload);
    },
    addMeal: (state, action: PayloadAction<{ date: string; meal: Meal }>) => {
      const { date, meal } = action.payload;
      
      // Initialize the date entry if it doesn't exist
      if (!state.mealHistory[date]) {
        state.mealHistory[date] = [];
      }
      
      // Add the meal to the specified date
      state.mealHistory[date].push(meal);
    },
    updateMeal: (state, action: PayloadAction<{ date: string; mealId: string; updates: Partial<Meal> }>) => {
      const { date, mealId, updates } = action.payload;
      
      // Find the meal in the specified date and update it
      if (state.mealHistory[date]) {
        const mealIndex = state.mealHistory[date].findIndex(meal => meal.id === mealId);
        
        if (mealIndex !== -1) {
          state.mealHistory[date][mealIndex] = {
            ...state.mealHistory[date][mealIndex],
            ...updates
          };
        }
      }
    },
    deleteMeal: (state, action: PayloadAction<{ date: string; mealId: string }>) => {
      const { date, mealId } = action.payload;
      
      // Remove the meal from the specified date
      if (state.mealHistory[date]) {
        state.mealHistory[date] = state.mealHistory[date].filter(meal => meal.id !== mealId);
      }
    },
    updateDailyGoals: (state, action: PayloadAction<Partial<NutrientInfo>>) => {
      state.dailyGoals = {
        ...state.dailyGoals,
        ...action.payload
      };
    },
    updateDietaryPreferences: (state, action: PayloadAction<Partial<NutritionState['dietaryPreferences']>>) => {
      state.dietaryPreferences = {
        ...state.dietaryPreferences,
        ...action.payload
      };
    },
    recordWaterIntake: (state, action: PayloadAction<{ date: string; amount: number }>) => {
      const { date, amount } = action.payload;
      
      // Initialize the date entry if it doesn't exist
      if (!state.waterIntake[date]) {
        state.waterIntake[date] = 0;
      }
      
      // Add the water intake to the specified date
      state.waterIntake[date] += amount;
    },
    resetNutritionData: () => initialState,
  },
});

// Export actions
export const {
  addFoodToDatabase,
  updateFoodInDatabase,
  deleteFoodFromDatabase,
  addMeal,
  updateMeal,
  deleteMeal,
  updateDailyGoals,
  updateDietaryPreferences,
  recordWaterIntake,
  resetNutritionData,
} = nutritionSlice.actions;

// Export reducer
export default nutritionSlice.reducer;
