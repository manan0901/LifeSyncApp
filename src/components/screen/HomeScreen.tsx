import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../redux/store';
import { useTheme } from '../../themes/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HealthDashboard from '../feature/HealthDashboard';
import Card from '../core/Card';
import Button from '../core/Button';
import { RecommendationService, Recommendation } from '../../services';

const recommendationService = new RecommendationService();

// Define Task interface with optional location property
interface Task {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  isCompleted: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  location: string;
  [key: string]: any; // Allow for additional properties
}

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  const { profile } = useSelector((state: RootState) => state.user);
  const currentDate = useSelector((state: RootState) => state.schedule.currentDate);
  const tasks = useSelector((state: RootState) => 
    state.schedule.dailyTasks[currentDate] || []
  );
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [vitalSigns, setVitalSigns] = useState<any>(null);
  const [isLoadingVitalSigns, setIsLoadingVitalSigns] = useState(false);
  const [weeklyInsights, setWeeklyInsights] = useState<any>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Update greeting based on time of day
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, [currentTime]);
    // Load recommendations and health data when component mounts or profile changes
  useEffect(() => {
    loadRecommendations();
    loadVitalSigns();
    loadWeeklyInsights();
  }, [profile]);

  const loadRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      const recommendationsData = await recommendationService.getRecommendations();
      setRecommendations(recommendationsData);
    } catch (error) {
      console.error('Failed to load recommendations', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };
    const loadVitalSigns = async () => {
    setIsLoadingVitalSigns(true);
    try {
      // We'll use the vital signs from Redux state now
      setIsLoadingVitalSigns(false);
    } catch (error) {
      console.error('Failed to load vital signs', error);
      setIsLoadingVitalSigns(false);
    }
  };
  
  const loadWeeklyInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const insights = await recommendationService.getWeeklyInsights();
      setWeeklyInsights(insights);
    } catch (error) {
      console.error('Failed to load weekly insights', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };
  // Handle recommendation action
  const handleRecommendationAction = (recommendation: Recommendation) => {
    const navigationMap: Record<string, string> = {
      '/activity': 'Activity',
      '/nutrition': 'Nutrition',
      '/mindfulness': 'Mindfulness',
      '/mindfulness/breathing': 'Mindfulness',
      '/timeline': 'Timeline',
      '/settings/sleep': 'Settings'
    };
    
    if (recommendation.actionUrl && navigationMap[recommendation.actionUrl]) {
      navigation.navigate(navigationMap[recommendation.actionUrl] as never);
      
      // Mark recommendation as implemented
      recommendationService.updateRecommendationStatus(recommendation.id, 'implemented')
        .then(() => {
          // Refresh recommendations after marking as implemented
          loadRecommendations();
        });
    }
  };
  
  // Dismiss a recommendation
  const dismissRecommendation = (recommendationId: string) => {
    recommendationService.updateRecommendationStatus(recommendationId, 'dismissed')
      .then(() => {
        // Refresh recommendations after dismissing
        loadRecommendations();
      });
  };
  
  // Save a recommendation for later
  const saveRecommendation = (recommendationId: string) => {
    recommendationService.updateRecommendationStatus(recommendationId, 'saved')
      .then(() => {
        // Refresh recommendations after saving
        loadRecommendations();
      });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get pending tasks for today
  const pendingTasks = tasks.filter(task => !task.completed);

  // Navigate to the Timeline screen
  const goToTimeline = () => {
    navigation.navigate('Timeline' as never);
  };
    // Render a recommendation card
  const renderRecommendation = ({ item }: { item: Recommendation }) => (
    <View style={[styles.recommendationCard, { backgroundColor: theme.colors.cardBackground }]}>
      <TouchableOpacity 
        style={styles.recommendationCardContent}
        onPress={() => handleRecommendationAction(item)}
      >
        <View style={[
          styles.priorityIndicator, 
          { backgroundColor: item.priority === 'high' ? '#F44336' : 
                            item.priority === 'medium' ? '#FF9800' : '#4CAF50' }
        ]} />
        <View style={styles.recommendationDetails}>
          <Text style={[styles.recommendationTitle, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.recommendationDescription, { color: theme.colors.textSecondary }]}>
            {item.description}
          </Text>
          <View style={styles.recommendationCategory}>
            <MaterialCommunityIcons 
              name={
                item.category === 'activity' ? 'run' : 
                item.category === 'nutrition' ? 'food-apple' :
                item.category === 'mindfulness' ? 'meditation' :
                item.category === 'sleep' ? 'power-sleep' : 'chart-timeline-variant'
              } 
              size={14} 
              color={theme.colors.primary}
            />
            <Text style={[styles.categoryText, { color: theme.colors.primary }]}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
      
      {/* Actions for recommendation */}
      <View style={styles.recommendationActions}>
        <TouchableOpacity 
          style={styles.recommendationAction} 
          onPress={() => dismissRecommendation(item.id)}
        >
          <MaterialCommunityIcons name="close" size={16} color={theme.colors.error} />
          <Text style={[styles.actionText, { color: theme.colors.error }]}>Dismiss</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.recommendationAction} 
          onPress={() => saveRecommendation(item.id)}
        >
          <MaterialCommunityIcons name="bookmark-outline" size={16} color={theme.colors.primary} />
          <Text style={[styles.actionText, { color: theme.colors.primary }]}>Save</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.recommendationAction} 
          onPress={() => handleRecommendationAction(item)}
        >
          <MaterialCommunityIcons name="check" size={16} color={theme.colors.success} />
          <Text style={[styles.actionText, { color: theme.colors.success }]}>Do It</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.colors.text }]}>
            {greeting}, {profile.name || 'there'}!
          </Text>
          <Text style={[styles.date, { color: theme.colors.placeholder }]}>
            {formatDate(currentTime)}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.profileButton}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.avatarText}>
              {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Today's Tasks Summary */}
      <Card
        title="Today's Schedule"
        subtitle={`${pendingTasks.length} pending tasks`}
        icon="calendar-today"
        elevated
        onPress={goToTimeline}
      >
        {pendingTasks.length > 0 ? (
          <View>
            {pendingTasks.slice(0, 3).map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskTime}>
                  <Text style={[styles.taskTimeText, { color: theme.colors.placeholder }]}>
                    {task.startTime}
                  </Text>
                </View>
                
                <View style={[
                  styles.taskIndicator, 
                  { backgroundColor: task.category === 'work' ? '#F44336' : 
                                    task.category === 'personal' ? '#4CAF50' : 
                                    task.category === 'health' ? '#2196F3' : 
                                    '#FF9800' }
                ]} />
                
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, { color: theme.colors.text }]}>
                    {task.title}
                  </Text>                  {/* Display location if available */}
                  {task.location && (
                    <Text style={[styles.taskDetail, { color: theme.colors.outline }]}>
                      <MaterialCommunityIcons name="map-marker" size={12} color={theme.colors.outline} />{' '}
                      {task.location}
                    </Text>
                  )}
                </View>
              </View>
            ))}
            
            {pendingTasks.length > 3 && (
              <Text style={[styles.moreTasks, { color: theme.colors.primary }]}>
                + {pendingTasks.length - 3} more tasks
              </Text>
            )}
            
            <Button 
              title="View Full Schedule" 
              variant="outline" 
              onPress={goToTimeline}
              size="small"
            />
          </View>
        ) : (
          <View style={styles.emptyTasks}>
            <Text style={[styles.emptyText, { color: theme.colors.placeholder }]}>
              No tasks scheduled for today
            </Text>
            <Button 
              title="Add Task" 
              variant="outline" 
              onPress={goToTimeline}
              size="small"
            />
          </View>
        )}
      </Card>
        {/* Health Status Dashboard */}
      <HealthDashboard />
      
      
      {/* Personalized Recommendations */}
      <Card
        title="Recommended for You"
        subtitle="Personalized suggestions"
        icon="lightbulb-on"
        iconColor="#FF9800"
        elevated
      >
        {isLoadingRecommendations ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : recommendations.length > 0 ? (
          <FlatList
            data={recommendations.slice(0, 3)}
            renderItem={renderRecommendation}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <View style={styles.emptyRecommendations}>
            <Text style={[styles.emptyText, { color: theme.colors.placeholder }]}>
              Complete your profile to get personalized recommendations
            </Text>
          </View>
        )}
      </Card>
      
      {/* Weekly Insights */}
      <Card
        title="Weekly Insights"
        subtitle="Your progress summary"
        icon="chart-line"
        iconColor="#4CAF50"
        elevated
      >
        {isLoadingInsights ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : weeklyInsights ? (
          <View style={styles.insightsContainer}>
            <View style={styles.streakContainer}>
              <View style={[styles.streakCircle, { borderColor: theme.colors.primary }]}>
                <Text style={[styles.streakNumber, { color: theme.colors.primary }]}>
                  {weeklyInsights.streakCount}
                </Text>
                <Text style={{ color: theme.colors.textSecondary }}>days</Text>
              </View>
              <Text style={[styles.streakLabel, { color: theme.colors.text }]}>Current Streak</Text>
            </View>
            
            <View style={styles.insightsList}>
              <View style={styles.insightItem}>
                <MaterialCommunityIcons name="calendar-star" size={20} color="#673AB7" />
                <Text style={[styles.insightText, { color: theme.colors.text }]}>
                  Most active day: <Text style={{ fontWeight: '700' }}>{weeklyInsights.mostActiveDay}</Text>
                </Text>
              </View>
              
              <View style={styles.insightItem}>
                <MaterialCommunityIcons name="sleep" size={20} color="#2196F3" />
                <Text style={[styles.insightText, { color: theme.colors.text }]}>
                  Average sleep: <Text style={{ fontWeight: '700' }}>{weeklyInsights.averageSleepHours} hours</Text>
                </Text>
              </View>
              
              <View style={styles.insightItem}>
                <MaterialCommunityIcons name="food-apple" size={20} color="#4CAF50" />
                <Text style={[styles.insightText, { color: theme.colors.text }]}>
                  Nutrition balance: <Text style={{ fontWeight: '700' }}>{weeklyInsights.nutritionBalance.replace('_', ' ')}</Text>
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyInsights}>
            <Text style={[styles.emptyText, { color: theme.colors.placeholder }]}>
              Use the app for a week to see your insights
            </Text>
          </View>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  taskTime: {
    width: 50,
    marginRight: 12,
  },
  taskTimeText: {
    fontSize: 12,
  },
  taskIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontWeight: '500',
    marginBottom: 4,
  },
  taskDetail: {
    fontSize: 12,
  },
  moreTasks: {
    textAlign: 'center',
    marginVertical: 12,
  },
  emptyTasks: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  loader: {
    padding: 20,
  },
  emptyHealth: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendationCardContent: {
    flex: 1,
    flexDirection: 'row',
  },
  priorityIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  recommendationDetails: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  recommendationCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  emptyRecommendations: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  insightsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakContainer: {
    alignItems: 'center',
    marginRight: 24,
  },
  streakCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: '700',
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  insightsList: {
    flex: 1,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightText: {
    marginLeft: 8,
  },  emptyInsights: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  recommendationActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 8,
    marginTop: 8,
  },
  recommendationAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  actionText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default HomeScreen;
