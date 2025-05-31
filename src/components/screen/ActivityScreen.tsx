import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Modal
} from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import Card from '../core/Card';
import Button from '../core/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityService, WorkoutTemplate, VitalSigns, Exercise } from '../../services';
import { useSelector } from 'react-redux';

const activityService = new ActivityService();

const ActivityScreen: React.FC = () => {
  const { theme } = useTheme();
  const [workouts, setWorkouts] = useState<WorkoutTemplate[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns | null>(null);
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(false);
  const [isLoadingVitals, setIsLoadingVitals] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutTemplate | null>(null);
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [isTrackingWorkSession, setIsTrackingWorkSession] = useState(false);
  const [workSessionStart, setWorkSessionStart] = useState<number | null>(null);
  const [workSessionDescription, setWorkSessionDescription] = useState('Work session');
  const [activitySummary, setActivitySummary] = useState<any>(null);
  
  const user = useSelector((state: any) => state.user);

  // Load workouts and vital signs when component mounts
  useEffect(() => {
    loadWorkouts();
    loadVitalSigns();
    loadActivitySummary();
  }, []);

  // Filter workouts when category changes
  useEffect(() => {
    loadWorkouts(selectedCategory as any);
  }, [selectedCategory]);

  const loadWorkouts = async (category?: 'cardio' | 'strength' | 'flexibility' | 'balance' | 'sport') => {
    setIsLoadingWorkouts(true);
    try {
      const workoutTemplates = await activityService.getWorkoutTemplates(category);
      setWorkouts(workoutTemplates);
    } catch (error) {
      console.error('Failed to load workouts', error);
    } finally {
      setIsLoadingWorkouts(false);
    }
  };

  const loadVitalSigns = async () => {
    setIsLoadingVitals(true);
    try {
      const vitals = await activityService.getVitalSigns();
      setVitalSigns(vitals);
    } catch (error) {
      console.error('Failed to load vital signs', error);
    } finally {
      setIsLoadingVitals(false);
    }
  };

  const loadActivitySummary = async () => {
    try {
      // Get last 7 days of data
      const endDate = Date.now();
      const startDate = endDate - (7 * 24 * 60 * 60 * 1000);
      const summary = await activityService.getActivitySummary(startDate, endDate);
      setActivitySummary(summary);
    } catch (error) {
      console.error('Failed to load activity summary', error);
    }
  };

  const handleStartWorkout = (workout: WorkoutTemplate) => {
    setSelectedWorkout(workout);
    setWorkoutModalVisible(true);
  };

  const handleCloseWorkoutModal = () => {
    setWorkoutModalVisible(false);
    setTimeout(() => setSelectedWorkout(null), 300);
  };

  const handleLogCompletedWorkout = async () => {
    if (!selectedWorkout) return;
    
    try {
      await activityService.logCompletedWorkout(
        selectedWorkout.id,
        selectedWorkout.duration,
        selectedWorkout.exercises.map(ex => ({ id: ex.id }))
      );
      handleCloseWorkoutModal();
      // Refresh vital signs after workout
      setTimeout(loadVitalSigns, 500);
    } catch (error) {
      console.error('Failed to log workout', error);
    }
  };

  const toggleWorkSession = async () => {
    if (isTrackingWorkSession) {
      // End work session
      if (workSessionStart) {
        const endTime = Date.now();
        try {
          await activityService.logWorkSession(
            workSessionDescription,
            workSessionStart,
            endTime,
            'work',
            8 // Mock productivity rating
          );
          setIsTrackingWorkSession(false);
          setWorkSessionStart(null);
          setWorkSessionDescription('Work session');
        } catch (error) {
          console.error('Failed to log work session', error);
        }
      }
    } else {
      // Start work session
      setIsTrackingWorkSession(true);
      setWorkSessionStart(Date.now());
    }
  };

  // Calculate workout duration in minutes and seconds
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  // Render workout categories filter buttons
  const renderCategoryButtons = () => {
    const categories = [
      { name: 'All', value: null },
      { name: 'Cardio', value: 'cardio' },
      { name: 'Strength', value: 'strength' },
      { name: 'Flexibility', value: 'flexibility' },
    ];

    return (
      <View style={styles.categoryFilterContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryButton,
              selectedCategory === category.value && { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setSelectedCategory(category.value)}
          >
            <Text
              style={[
                styles.categoryText,
                { color: selectedCategory === category.value ? 'white' : theme.colors.text },
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Workout modal content
  const renderWorkoutModal = () => {
    if (!selectedWorkout) return null;

    return (
      <Modal
        visible={workoutModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseWorkoutModal}
      >
        <View style={styles.modalOverlay}>
          <View 
            style={[
              styles.modalContent, 
              { backgroundColor: theme.colors.cardBackground }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}
              >
                {selectedWorkout.name}
              </Text>
              <TouchableOpacity onPress={handleCloseWorkoutModal}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.workoutDetails}>
              <View style={styles.workoutStat}>
                <MaterialCommunityIcons name="clock-outline" size={24} color={theme.colors.primary} />
                <Text style={{ color: theme.colors.text }}>
                  {formatDuration(selectedWorkout.duration)}
                </Text>
              </View>
              <View style={styles.workoutStat}>
                <MaterialCommunityIcons name="fire" size={24} color="#FF5722" />
                <Text style={{ color: theme.colors.text }}>
                  {selectedWorkout.caloriesBurned} cal
                </Text>
              </View>
              <View style={styles.workoutStat}>
                <MaterialCommunityIcons 
                  name={selectedWorkout.intensity === 'high' ? 'lightning-bolt' : 
                       (selectedWorkout.intensity === 'medium' ? 'lightning-bolt-outline' : 'weather-sunny')} 
                  size={24} 
                  color="#FFC107" 
                />
                <Text style={{ color: theme.colors.text }}>
                  {selectedWorkout.intensity.charAt(0).toUpperCase() + selectedWorkout.intensity.slice(1)}
                </Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Exercises</Text>
            
            {selectedWorkout.exercises.length > 0 ? (
              <FlatList
                data={selectedWorkout.exercises}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.exerciseItem}>
                    <Text style={[styles.exerciseName, { color: theme.colors.text }]}>
                      {item.name}
                    </Text>
                    <Text style={{ color: theme.colors.textSecondary }}>
                      {item.sets && item.reps ? `${item.sets} sets × ${item.reps} reps` : 
                       item.duration ? `${formatDuration(item.duration)}` : ''}
                    </Text>
                  </View>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                style={styles.exerciseList}
              />
            ) : (
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}
              >
                No specific exercises for this workout.
              </Text>
            )}

            <View style={styles.modalActions}>
              <Button
                title="Start Later"
                variant="outline"
                onPress={handleCloseWorkoutModal}
              />
              <Button
                title="Start Now"
                onPress={handleLogCompletedWorkout}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
        Activity & Health
      </Text>
      
      {/* Health Status */}
      <Card
        title="Health Stats"
        subtitle="Current vital signs"
        icon="heart-pulse"
        iconColor="#F44336"
        elevated
      >
        {isLoadingVitals ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : vitalSigns ? (
          <View style={styles.vitalSignsContainer}>
            <View style={styles.vitalRow}>
              <View style={styles.vitalItem}>
                <MaterialCommunityIcons name="heart" size={28} color="#F44336" />
                <View>
                  <Text style={[styles.vitalValue, { color: theme.colors.text }]}>
                    {vitalSigns.heartRate} bpm
                  </Text>
                  <Text style={[styles.vitalLabel, { color: theme.colors.textSecondary }]}>
                    Heart Rate
                  </Text>
                </View>
              </View>
              
              <View style={styles.vitalItem}>
                <MaterialCommunityIcons name="water-percent" size={28} color="#2196F3" />
                <View>
                  <Text style={[styles.vitalValue, { color: theme.colors.text }]}>
                    {vitalSigns.bloodOxygen}%
                  </Text>
                  <Text style={[styles.vitalLabel, { color: theme.colors.textSecondary }]}>
                    Blood Oxygen
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.vitalRow}>
              <View style={styles.vitalItem}>
                <MaterialCommunityIcons name="shoe-print" size={28} color="#4CAF50" />
                <View>
                  <Text style={[styles.vitalValue, { color: theme.colors.text }]}>
                    {vitalSigns.steps?.toLocaleString()}
                  </Text>
                  <Text style={[styles.vitalLabel, { color: theme.colors.textSecondary }]}>
                    Steps
                  </Text>
                </View>
              </View>
              
              <View style={styles.vitalItem}>
                <MaterialCommunityIcons name="fire" size={28} color="#FF9800" />
                <View>
                  <Text style={[styles.vitalValue, { color: theme.colors.text }]}>
                    {vitalSigns.caloriesBurned?.toLocaleString()} cal
                  </Text>
                  <Text style={[styles.vitalLabel, { color: theme.colors.textSecondary }]}>
                    Calories Burned
                  </Text>
                </View>
              </View>
            </View>
            
            {activitySummary && (
              <View style={styles.activitySummary}>
                <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>
                  7-Day Summary
                </Text>
                <View style={styles.summaryRow}>
                  <Text style={{ color: theme.colors.textSecondary }}>Total Steps:</Text>
                  <Text style={{ color: theme.colors.text, fontWeight: '600' }}>
                    {activitySummary.totalSteps.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={{ color: theme.colors.textSecondary }}>Active Minutes:</Text>
                  <Text style={{ color: theme.colors.text, fontWeight: '600' }}>
                    {activitySummary.activeMinutes}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={{ color: theme.colors.textSecondary }}>Workout Minutes:</Text>
                  <Text style={{ color: theme.colors.text, fontWeight: '600' }}>
                    {activitySummary.workoutMinutes}
                  </Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            Connect to a health device to see your vital signs.
          </Text>
        )}
      </Card>
      
      {/* Workout section */}
      <Card
        title="Workouts"
        subtitle="Exercise recommendations"
        icon="dumbbell"
        iconColor="#9C27B0"
        elevated
      >
        {renderCategoryButtons()}
        
        {isLoadingWorkouts ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : workouts.length > 0 ? (
          <FlatList
            data={workouts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.workoutCard,
                  { backgroundColor: theme.colors.cardBackground }
                ]}
                onPress={() => handleStartWorkout(item)}
              >
                <View style={styles.workoutCardContent}>
                  <Text style={[styles.workoutName, { color: theme.colors.text }]}>
                    {item.name}
                  </Text>
                  <View style={styles.workoutCardDetails}>
                    <View style={styles.workoutDetailItem}>
                      <MaterialCommunityIcons name="clock-outline" size={18} color={theme.colors.primary} />
                      <Text style={{ color: theme.colors.textSecondary }}>
                        {formatDuration(item.duration)}
                      </Text>
                    </View>
                    <View style={styles.workoutDetailItem}>
                      <MaterialCommunityIcons name="fire" size={18} color="#FF5722" />
                      <Text style={{ color: theme.colors.textSecondary }}>
                        {item.caloriesBurned} cal
                      </Text>
                    </View>
                    <View style={styles.workoutDetailItem}>
                      <MaterialCommunityIcons 
                        name={
                          item.category === 'cardio' ? 'run' : 
                          item.category === 'strength' ? 'dumbbell' :
                          item.category === 'flexibility' ? 'yoga' : 'arm-flex'
                        } 
                        size={18} 
                        color="#4CAF50" 
                      />
                      <Text style={{ color: theme.colors.textSecondary }}>
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No workouts found for the selected category.
          </Text>
        )}
      </Card>
      
      {/* Work & Focus */}
      <Card
        title="Work & Focus"
        subtitle="Productivity tracking"
        icon="briefcase"
        iconColor="#673AB7"
        elevated
      >
        <View style={styles.workSessionContainer}>
          {isTrackingWorkSession ? (
            <View style={styles.activeWorkSession}>
              <Text style={[styles.workSessionTitle, { color: theme.colors.text }]}>
                Work Session in Progress
              </Text>
              <Text style={[styles.workSessionTimer, { color: theme.colors.primary }]}>
                {workSessionStart ? Math.floor((Date.now() - workSessionStart) / 60000) : 0} minutes
              </Text>              <Button
                title="End Session"
                onPress={toggleWorkSession}
                variant="secondary"
              />
            </View>
          ) : (
            <View style={styles.startWorkSession}>
              <Text style={[styles.workSessionPrompt, { color: theme.colors.text }]}>
                Ready to focus on work or study?
              </Text>
              <Button
                title="Start Work Session"
                onPress={toggleWorkSession}
                icon="play"
              />
            </View>
          )}
        </View>
        
        <View style={styles.focusTips}>
          <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>Focus Tips:</Text>
          <View style={styles.bulletPointContainer}>
            <View style={styles.bulletPoint}>
              <MaterialCommunityIcons name="circle-small" size={24} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.text }}>Use the Pomodoro technique: 25 min work + 5 min break</Text>
            </View>
            <View style={styles.bulletPoint}>
              <MaterialCommunityIcons name="circle-small" size={24} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.text }}>Stay hydrated during work sessions</Text>
            </View>
            <View style={styles.bulletPoint}>
              <MaterialCommunityIcons name="circle-small" size={24} color={theme.colors.primary} />
              <Text style={{ color: theme.colors.text }}>Take regular stretch breaks</Text>
            </View>
          </View>
        </View>
      </Card>
      
      {renderWorkoutModal()}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  placeholderText: {
    marginBottom: 12,
  },
  bulletPointContainer: {
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vitalSignsContainer: {
    marginBottom: 8,
  },
  vitalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  vitalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vitalValue: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  vitalLabel: {
    fontSize: 12,
    marginLeft: 12,
  },
  activitySummary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryFilterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#E0E0E0',
  },
  categoryText: {
    fontWeight: '500',
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  workoutCardContent: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  workoutCardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
  },
  loader: {
    padding: 20,
  },
  workSessionContainer: {
    marginBottom: 16,
  },
  activeWorkSession: {
    alignItems: 'center',
    padding: 16,
  },
  workSessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  workSessionTimer: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
  },
  startWorkSession: {
    alignItems: 'center',
    padding: 16,
  },
  workSessionPrompt: {
    marginBottom: 16,
    fontSize: 16,
  },
  focusTips: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  workoutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  workoutStat: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  exerciseItem: {
    paddingVertical: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  exerciseList: {
    maxHeight: 250,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default ActivityScreen;
