import { Recommendation } from './api.types';

// Mock service for AI-powered recommendations
export class RecommendationService {
  // Get personalized recommendations for the user
  async getRecommendations(category?: 'nutrition' | 'activity' | 'mindfulness' | 'sleep' | 'productivity'): Promise<Recommendation[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let recommendations = [...mockRecommendations];
    
    if (category) {
      recommendations = recommendations.filter(rec => rec.category === category);
    }
    
    return recommendations;
  }
  
  // Mark recommendation as implemented or dismissed
  async updateRecommendationStatus(
    recommendationId: string,
    status: 'implemented' | 'dismissed' | 'saved'
  ): Promise<{ success: boolean; message?: string }> {
    // In a real app, this would update the recommendation status in the database
    console.log(`Marked recommendation ${recommendationId} as ${status}`);
    
    return { success: true };
  }
  
  // Provide feedback on recommendation quality
  async provideFeedback(
    recommendationId: string,
    helpful: boolean,
    feedback?: string
  ): Promise<{ success: boolean; message?: string }> {
    // In a real app, this would update the recommendation feedback in the database
    // and use it to improve future recommendations
    console.log(`Feedback for recommendation ${recommendationId}: ${helpful ? 'Helpful' : 'Not helpful'}`, feedback);
    
    return { success: true };
  }
  
  // Get weekly insights based on user data
  async getWeeklyInsights(): Promise<{
    mostActiveDay: string;
    averageSleepHours: number;
    nutritionBalance: 'good' | 'fair' | 'needs_improvement';
    topRecommendation: Recommendation;
    streakCount: number;
  }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would analyze actual user data
    return {
      mostActiveDay: 'Wednesday',
      averageSleepHours: 7.2,
      nutritionBalance: 'fair',
      topRecommendation: mockRecommendations[0],
      streakCount: 5
    };
  }
}

// Mock data
const mockRecommendations: Recommendation[] = [
  {
    id: 'rec1',
    title: 'Add a 10-minute walk after lunch',
    description: 'Based on your activity patterns, a short walk after lunch could help with digestion and afternoon energy levels.',
    category: 'activity',
    priority: 'medium',
    actionUrl: '/activity',
    imageUrl: 'https://example.com/images/walk-recommendation.jpg'
  },
  {
    id: 'rec2',
    title: 'Try Greek yogurt for breakfast',
    description: 'Your breakfast choices could use more protein. Greek yogurt with berries is a quick, protein-rich option.',
    category: 'nutrition',
    priority: 'high',
    actionUrl: '/nutrition',
    imageUrl: 'https://example.com/images/yogurt-recommendation.jpg'
  },
  {
    id: 'rec3',
    title: '3-minute breathing exercise for better focus',
    description: 'Your work patterns show decreased productivity in mid-afternoon. A quick breathing session can help reset your focus.',
    category: 'mindfulness',
    priority: 'medium',
    actionUrl: '/mindfulness/breathing',
    imageUrl: 'https://example.com/images/breathing-recommendation.jpg'
  },  {
    id: 'rec4',
    title: 'Consider an earlier bedtime',
    description: "Your sleep data shows you've been getting less than optimal sleep. Try going to bed 30 minutes earlier tonight.",
    category: 'sleep',
    priority: 'high',
    actionUrl: '/settings/sleep',
    imageUrl: 'https://example.com/images/sleep-recommendation.jpg'
  },
  {
    id: 'rec5',
    title: 'Schedule focused work blocks',
    description: 'Your work sessions show frequent interruptions. Try setting aside 50-minute focused work blocks with 10-minute breaks.',
    category: 'productivity',
    priority: 'medium',
    actionUrl: '/timeline',
    imageUrl: 'https://example.com/images/productivity-recommendation.jpg'
  }
];
