import { FoodItem, NutritionSearchParams } from './api.types';

// Mock service for nutrition tracking and meal planning
export class NutritionService {
  // Search for food items in the database
  async searchFoodItems(params: NutritionSearchParams): Promise<FoodItem[]> {
    const { query, limit = 10 } = params;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Filter mock data based on search query
    const results = mockFoodItems.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return results.slice(0, limit);
  }

  // Get food item details by ID
  async getFoodItemDetails(foodId: string): Promise<FoodItem | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return mockFoodItems.find(item => item.id === foodId) || null;
  }

  // Get meal recommendations based on dietary preferences and nutritional goals
  async getMealRecommendations(
    preferences: string[],
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    calorieTarget?: number
  ): Promise<{ mealIdea: string; foodItems: FoodItem[] }[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would use more sophisticated logic and external APIs
    // For now, return mock recommendations
    return mockMealRecommendations[mealType] || [];
  }

  // Track water intake
  async logWaterIntake(amount: number, unit: 'ml' | 'oz'): Promise<{ success: boolean; totalForDay: number }> {
    // In a real app, this would update a database
    console.log(`Logged water intake: ${amount}${unit}`);
    
    // Mock response
    return { 
      success: true, 
      totalForDay: 1200 // Mock total
    };
  }

  // Calculate nutritional needs based on user profile
  calculateDailyNeeds(
    weight: number, // in kg
    height: number, // in cm
    age: number,
    gender: 'male' | 'female' | 'other',
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  ): {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } {
    // This is a simplified calculation - a real app would use more sophisticated formulas
    
    // Base metabolic rate calculation (BMR) using Mifflin-St Jeor Equation
    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Activity multipliers
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,      // Little or no exercise
      light: 1.375,        // Light exercise 1-3 days/week
      moderate: 1.55,      // Moderate exercise 3-5 days/week
      active: 1.725,       // Heavy exercise 6-7 days/week
      very_active: 1.9     // Very heavy exercise, physical job or training twice a day
    };
    
    const calories = Math.round(bmr * activityMultipliers[activityLevel]);
    
    // Macronutrient distribution (simplified)
    const protein = Math.round((calories * 0.3) / 4); // 30% of calories from protein, 4 calories per gram
    const fat = Math.round((calories * 0.25) / 9);    // 25% of calories from fat, 9 calories per gram
    const carbs = Math.round((calories * 0.45) / 4);  // 45% of calories from carbs, 4 calories per gram
    
    return { calories, protein, carbs, fat };
  }
}

// Mock data
const mockFoodItems: FoodItem[] = [
  {
    id: 'food1',
    name: 'Grilled Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: '100',
    servingUnit: 'g',
    image: 'https://example.com/images/grilled-chicken.jpg'
  },
  {
    id: 'food2',
    name: 'Brown Rice',
    calories: 112,
    protein: 2.6,
    carbs: 23.5,
    fat: 0.9,
    servingSize: '100',
    servingUnit: 'g',
    image: 'https://example.com/images/brown-rice.jpg'
  },
  {
    id: 'food3',
    name: 'Avocado',
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    servingSize: '100',
    servingUnit: 'g',
    image: 'https://example.com/images/avocado.jpg'
  },
  {
    id: 'food4',
    name: 'Greek Yogurt',
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    servingSize: '100',
    servingUnit: 'g',
    image: 'https://example.com/images/greek-yogurt.jpg'
  },
  {
    id: 'food5',
    name: 'Salmon Fillet',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 13,
    servingSize: '100',
    servingUnit: 'g',
    image: 'https://example.com/images/salmon.jpg'
  },
  {
    id: 'food6',
    name: 'Spinach',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    servingSize: '100',
    servingUnit: 'g',
    image: 'https://example.com/images/spinach.jpg'
  },
  {
    id: 'food7',
    name: 'Banana',
    calories: 89,
    protein: 1.1,
    carbs: 22.8,
    fat: 0.3,
    servingSize: '100',
    servingUnit: 'g',
    image: 'https://example.com/images/banana.jpg'
  },
  {
    id: 'food8',
    name: 'Almonds',
    calories: 579,
    protein: 21.2,
    carbs: 21.7,
    fat: 49.9,
    servingSize: '100',
    servingUnit: 'g',
    image: 'https://example.com/images/almonds.jpg'
  }
];

const mockMealRecommendations: Record<string, { mealIdea: string; foodItems: FoodItem[] }[]> = {
  breakfast: [
    {
      mealIdea: 'Greek Yogurt with Banana and Almonds',
      foodItems: [
        mockFoodItems.find(item => item.id === 'food4')!,
        mockFoodItems.find(item => item.id === 'food7')!,
        mockFoodItems.find(item => item.id === 'food8')!,
      ]
    },
    {
      mealIdea: 'Spinach and Avocado Toast',
      foodItems: [
        mockFoodItems.find(item => item.id === 'food6')!,
        mockFoodItems.find(item => item.id === 'food3')!,
      ]
    }
  ],
  lunch: [
    {
      mealIdea: 'Chicken and Brown Rice Bowl',
      foodItems: [
        mockFoodItems.find(item => item.id === 'food1')!,
        mockFoodItems.find(item => item.id === 'food2')!,
        mockFoodItems.find(item => item.id === 'food6')!
      ]
    }
  ],
  dinner: [
    {
      mealIdea: 'Grilled Salmon with Vegetables',
      foodItems: [
        mockFoodItems.find(item => item.id === 'food5')!,
        mockFoodItems.find(item => item.id === 'food6')!,
      ]
    }
  ],
  snack: [
    {
      mealIdea: 'Banana with Almonds',
      foodItems: [
        mockFoodItems.find(item => item.id === 'food7')!,
        mockFoodItems.find(item => item.id === 'food8')!
      ]
    }
  ]
};
