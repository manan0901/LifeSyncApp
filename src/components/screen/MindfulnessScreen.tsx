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
  Modal,
  Animated,
  Easing
} from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import Card from '../core/Card';
import Button from '../core/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MindfulnessService, MeditationSession } from '../../services';

const mindfulnessService = new MindfulnessService();

const MindfulnessScreen: React.FC = () => {
  const { theme } = useTheme();
  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [meditationModalVisible, setMeditationModalVisible] = useState(false);
  const [digitalWellbeing, setDigitalWellbeing] = useState<any>(null);
  const [isLoadingWellbeing, setIsLoadingWellbeing] = useState(false);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [selectedMeditationType, setSelectedMeditationType] = useState<string | null>(null);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingExercise, setBreathingExercise] = useState<any>(null);
  const [breathCount, setBreathCount] = useState(0);
  
  // Animation value for breathing circle
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    loadMeditationSessions();
    loadDigitalWellbeing();
  }, []);

  // Filter meditation sessions when type changes
  useEffect(() => {
    loadMeditationSessions(selectedMeditationType as any);
  }, [selectedMeditationType]);

  // Setup breathing animation
  useEffect(() => {
    if (isBreathingActive && breathingExercise) {
      animateBreathing();
    }
  }, [isBreathingActive, breathCount]);

  const loadMeditationSessions = async (type?: 'guided' | 'unguided' | 'breathing' | 'body-scan') => {
    setIsLoadingSessions(true);
    try {
      const sessions = await mindfulnessService.getMeditationSessions(type);
      setMeditationSessions(sessions);
    } catch (error) {
      console.error('Failed to load meditation sessions', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const loadDigitalWellbeing = async () => {
    setIsLoadingWellbeing(true);
    try {
      const wellbeingData = await mindfulnessService.getDigitalWellbeing();
      setDigitalWellbeing(wellbeingData);
    } catch (error) {
      console.error('Failed to load digital wellbeing data', error);
    } finally {
      setIsLoadingWellbeing(false);
    }
  };

  const handleStartMeditation = (session: MeditationSession) => {
    setSelectedSession(session);
    setMeditationModalVisible(true);
  };

  const handleCloseMeditationModal = () => {
    setMeditationModalVisible(false);
    setTimeout(() => setSelectedSession(null), 300);
  };

  const handleLogCompletedMeditation = async () => {
    if (!selectedSession) return;
    
    try {
      await mindfulnessService.logCompletedMeditation(
        selectedSession.id,
        selectedSession.duration,
        5, // Mock rating
        currentMood || 'calm'
      );
      handleCloseMeditationModal();
    } catch (error) {
      console.error('Failed to log meditation', error);
    }
  };

  const handleStartBreathing = async (type: 'relaxation' | 'energizing' | 'balance' | 'sleep') => {
    try {
      const exercise = await mindfulnessService.getBreathingExercise(type);
      setBreathingExercise(exercise);
      setIsBreathingActive(true);
      setBreathCount(0);
    } catch (error) {
      console.error('Failed to start breathing exercise', error);
    }
  };

  const handleStopBreathing = () => {
    setIsBreathingActive(false);
    setBreathingExercise(null);
    setBreathCount(0);
    animatedValue.setValue(0);
  };

  // Animated breathing cycle
  const animateBreathing = () => {
    if (!breathingExercise) return;
    
    const { inhaleDuration, holdDuration, exhaleDuration } = breathingExercise;
    const totalDuration = (inhaleDuration + holdDuration + exhaleDuration) * 1000;
    
    Animated.sequence([
      // Inhale
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: inhaleDuration * 1000,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.quad)
      }),
      // Hold
      Animated.delay(holdDuration * 1000),
      // Exhale
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: exhaleDuration * 1000,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.quad)
      })
    ]).start(() => {
      // One breath complete
      const newCount = breathCount + 1;
      setBreathCount(newCount);
      
      if (breathingExercise && newCount < breathingExercise.repetitions) {
        // Continue breathing cycle
        animateBreathing();
      } else {
        // Exercise complete
        handleStopBreathing();
      }
    });
  };

  // Format duration to mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  // Render meditation type filter buttons
  const renderMeditationTypeButtons = () => {
    const types = [
      { name: 'All', value: null },
      { name: 'Guided', value: 'guided' },
      { name: 'Breathing', value: 'breathing' },
      { name: 'Body Scan', value: 'body-scan' },
      { name: 'Silent', value: 'unguided' },
    ];

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.typeFilterScroll}
      >
        <View style={styles.typeFilterContainer}>
          {types.map((type) => (
            <TouchableOpacity
              key={type.name}
              style={[
                styles.typeButton,
                selectedMeditationType === type.value && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setSelectedMeditationType(type.value)}
            >
              <Text
                style={[
                  styles.typeText,
                  { color: selectedMeditationType === type.value ? 'white' : theme.colors.text },
                ]}
              >
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  // Mood selector component
  const renderMoodSelector = () => {
    const moods = [
      { emoji: '😌', name: 'Calm' },
      { emoji: '😊', name: 'Happy' },
      { emoji: '😴', name: 'Tired' },
      { emoji: '😰', name: 'Anxious' },
      { emoji: '😔', name: 'Sad' }
    ];

    return (
      <View style={styles.moodSelectorContainer}>
        <Text style={[styles.moodPrompt, { color: theme.colors.text }]}>How are you feeling today?</Text>
        <View style={styles.moodButtons}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.name}
              style={[
                styles.moodButton,
                currentMood === mood.name.toLowerCase() && { 
                  backgroundColor: theme.colors.cardBackground,
                  borderColor: theme.colors.primary,
                  borderWidth: 2
                },
              ]}
              onPress={() => setCurrentMood(mood.name.toLowerCase())}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={[styles.moodLabel, { color: theme.colors.text }]}>{mood.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {currentMood && (
          <Button 
            title="Log Mood" 
            size="small" 
            onPress={() => {
              mindfulnessService.logMoodEntry(currentMood, 7); // Mock intensity at 7
              // Give feedback to the user
              alert(`Mood logged: ${currentMood}`);
            }}
          />
        )}
      </View>
    );
  };

  // Breathing exercise modal
  const renderBreathingModal = () => {
    if (!isBreathingActive || !breathingExercise) return null;

    // Calculate size based on animation value (0 to 1)
    const circleSize = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 200]
    });

    const opacity = animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.4, 0.8, 0.4]
    });

    return (
      <Modal
        visible={isBreathingActive}
        transparent
        animationType="fade"
        onRequestClose={handleStopBreathing}
      >
        <View style={styles.breathingModalOverlay}>
          <View 
            style={[
              styles.breathingModalContent, 
              { backgroundColor: theme.colors.cardBackground }
            ]}
          >
            <Text style={[styles.breathingTitle, { color: theme.colors.text }]}>
              {breathingExercise.name}
            </Text>
            
            <Text style={[styles.breathingInstructions, { color: theme.colors.textSecondary }]}>
              {breathCount < breathingExercise.repetitions ? 'Follow the circle' : 'Practice complete!'}
            </Text>
            
            <View style={styles.breathingCircleContainer}>
              <Animated.View
                style={[
                  styles.breathingCircle,
                  { 
                    width: circleSize, 
                    height: circleSize,
                    opacity,
                    backgroundColor: theme.colors.primary
                  }
                ]}
              />
              <Text style={[styles.breathCounter, { color: theme.colors.text }]}
              >
                {breathCount + 1}/{breathingExercise.repetitions}
              </Text>
            </View>
            
            <Button
              title="End Practice"
              onPress={handleStopBreathing}
              variant="outline"
            />
          </View>
        </View>
      </Modal>
    );
  };
  
  // Meditation session modal
  const renderMeditationModal = () => {
    if (!selectedSession) return null;

    return (
      <Modal
        visible={meditationModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseMeditationModal}
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
                {selectedSession.title}
              </Text>
              <TouchableOpacity onPress={handleCloseMeditationModal}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>            {selectedSession.imageUrl ? (
              <Image
                source={{ uri: selectedSession.imageUrl }}
                style={styles.meditationImage}
                onError={() => {}}
              />
            ) : (
              <View style={[styles.meditationImage, styles.placeholderContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                <MaterialCommunityIcons 
                  name="meditation" 
                  size={48} 
                  color={theme.colors.onSurfaceVariant} 
                />
              </View>
            )}

            <Text style={[styles.meditationDescription, { color: theme.colors.text }]}>
              {selectedSession.description || 'Take a moment to find stillness and presence.'}
            </Text>

            <View style={styles.meditationDetails}>
              <View style={styles.meditationDetailItem}>
                <MaterialCommunityIcons name="clock-outline" size={20} color={theme.colors.primary} />
                <Text style={{ color: theme.colors.text, marginLeft: 4 }}>
                  {formatDuration(selectedSession.duration)}
                </Text>
              </View>
              <View style={styles.meditationDetailItem}>
                <MaterialCommunityIcons 
                  name={
                    selectedSession.type === 'guided' ? 'account-voice' : 
                    selectedSession.type === 'breathing' ? 'weather-windy' :
                    selectedSession.type === 'body-scan' ? 'human-handsup' : 'meditation'
                  } 
                  size={20} 
                  color={theme.colors.primary} 
                />
                <Text style={{ color: theme.colors.text, marginLeft: 4 }}>
                  {selectedSession.type.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Start Later"
                variant="outline"
                onPress={handleCloseMeditationModal}
              />
              <Button
                title="Begin Now"
                onPress={handleLogCompletedMeditation}
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
        Mindfulness & Wellbeing
      </Text>

      {/* Mood Tracking */}
      <Card
        title="Mood Tracking"
        subtitle="Emotional awareness"
        icon="emoticon-outline"
        iconColor="#FF9800"
        elevated
      >
        {renderMoodSelector()}
      </Card>
      
      {/* Breathing Exercises */}
      <Card
        title="Breathing Exercises"
        subtitle="Find your breath"
        icon="weather-windy"
        iconColor="#03A9F4"
        elevated
      >
        <Text style={[styles.sectionDescription, { color: theme.colors.text }]}>
          Breathing exercises can help reduce stress, increase focus, and improve overall wellbeing.
        </Text>
        <View style={styles.breathingButtonsContainer}>
          <TouchableOpacity 
            style={[styles.breathingButton, { backgroundColor: '#03A9F4' }]} 
            onPress={() => handleStartBreathing('relaxation')}
          >
            <MaterialCommunityIcons name="weather-night" size={28} color="white" />
            <Text style={styles.breathingButtonText}>Relaxation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.breathingButton, { backgroundColor: '#FFC107' }]} 
            onPress={() => handleStartBreathing('energizing')}
          >
            <MaterialCommunityIcons name="white-balance-sunny" size={28} color="white" />
            <Text style={styles.breathingButtonText}>Energy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.breathingButton, { backgroundColor: '#4CAF50' }]} 
            onPress={() => handleStartBreathing('sleep')}
          >
            <MaterialCommunityIcons name="power-sleep" size={28} color="white" />
            <Text style={styles.breathingButtonText}>Sleep</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.breathingButton, { backgroundColor: '#9C27B0' }]} 
            onPress={() => handleStartBreathing('balance')}
          >
            <MaterialCommunityIcons name="yoga" size={28} color="white" />
            <Text style={styles.breathingButtonText}>Balance</Text>
          </TouchableOpacity>
        </View>
      </Card>
      
      {/* Meditation */}
      <Card
        title="Meditation Sessions"
        subtitle="Mindful moments"
        icon="meditation"
        iconColor="#8BC34A"
        elevated
      >
        {renderMeditationTypeButtons()}
        
        {isLoadingSessions ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : meditationSessions.length > 0 ? (
          <FlatList
            data={meditationSessions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.meditationCard,
                  { backgroundColor: theme.colors.cardBackground }
                ]}
                onPress={() => handleStartMeditation(item)}
              >                <View style={styles.meditationCardContent}>
                  {item.imageUrl ? (
                    <Image 
                      source={{ uri: item.imageUrl }}
                      style={styles.meditationCardImage}
                      onError={() => {}}
                    />
                  ) : (
                    <View style={[styles.meditationCardImage, styles.placeholderContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                      <MaterialCommunityIcons 
                        name="meditation" 
                        size={32} 
                        color={theme.colors.onSurfaceVariant} 
                      />
                    </View>
                  )}
                  <View style={styles.meditationCardDetails}>
                    <Text style={[styles.meditationName, { color: theme.colors.text }]}>
                      {item.title}
                    </Text>
                    <View style={styles.meditationCardMeta}>
                      <View style={styles.meditationMetaItem}>
                        <MaterialCommunityIcons name="clock-outline" size={14} color={theme.colors.primary} />
                        <Text style={[styles.meditationMetaText, { color: theme.colors.textSecondary }]}>
                          {formatDuration(item.duration)}
                        </Text>
                      </View>
                      <View style={styles.meditationMetaItem}>
                        <MaterialCommunityIcons 
                          name={
                            item.type === 'guided' ? 'account-voice' : 
                            item.type === 'breathing' ? 'weather-windy' :
                            item.type === 'body-scan' ? 'human-handsup' : 'meditation'
                          } 
                          size={14} 
                          color={theme.colors.primary} 
                        />
                        <Text style={[styles.meditationMetaText, { color: theme.colors.textSecondary }]}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <MaterialCommunityIcons name="play-circle-outline" size={32} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No meditation sessions found for the selected type.
          </Text>
        )}
      </Card>
      
      {/* Digital Wellbeing */}
      <Card
        title="Digital Wellbeing"
        subtitle="Maintain a healthy balance"
        icon="cellphone-check"
        iconColor="#00BCD4"
        elevated
      >
        {isLoadingWellbeing ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : digitalWellbeing ? (
          <View style={styles.wellbeingContainer}>
            <View style={styles.wellbeingStat}>
              <Text style={[styles.wellbeingValue, { color: theme.colors.primary }]}>
                {Math.floor(digitalWellbeing.totalScreenTime / 60)}h {digitalWellbeing.totalScreenTime % 60}m
              </Text>
              <Text style={[styles.wellbeingLabel, { color: theme.colors.text }]}>
                Screen Time Today
              </Text>
            </View>
            
            <View style={styles.wellbeingRow}>
              <View style={styles.wellbeingSmallStat}>
                <Text style={[styles.wellbeingSmallValue, { color: theme.colors.text }]}>
                  {digitalWellbeing.unlockCount}
                </Text>
                <Text style={[styles.wellbeingSmallLabel, { color: theme.colors.textSecondary }]}>
                  Unlocks
                </Text>
              </View>
              
              <View style={styles.wellbeingSmallStat}>
                <Text style={[styles.wellbeingSmallValue, { color: theme.colors.text }]}>
                  {digitalWellbeing.notificationCount}
                </Text>
                <Text style={[styles.wellbeingSmallLabel, { color: theme.colors.textSecondary }]}>
                  Notifications
                </Text>
              </View>
            </View>
            
            <Text style={[styles.appUsageTitle, { color: theme.colors.text }]}>
              App Usage
            </Text>
              {digitalWellbeing.appUsageStats.slice(0, 3).map((app: {appName: string, usageMinutes: number}, index: number) => (
              <View key={app.appName + index} style={styles.appUsageItem}>
                <Text style={{ color: theme.colors.text }}>{app.appName}</Text>
                <View style={styles.appUsageBarContainer}>
                  <View 
                    style={[
                      styles.appUsageBar,
                      { 
                        width: `${(app.usageMinutes / digitalWellbeing.totalScreenTime) * 100}%`,
                        backgroundColor: index === 0 ? '#F44336' : (index === 1 ? '#FF9800' : '#4CAF50')
                      }
                    ]}
                  />
                </View>
                <Text style={{ color: theme.colors.textSecondary }}>
                  {app.usageMinutes} min
                </Text>
              </View>
            ))}
            
            <View style={styles.wellbeingTips}>
              <Text style={[styles.wellbeingTipsTitle, { color: theme.colors.text }]}>
                Digital Wellness Tips
              </Text>
              <View style={styles.bulletPointContainer}>
                <View style={styles.bulletPoint}>
                  <MaterialCommunityIcons name="circle-small" size={24} color={theme.colors.primary} />
                  <Text style={{ color: theme.colors.text }}>Take regular screen breaks</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <MaterialCommunityIcons name="circle-small" size={24} color={theme.colors.primary} />
                  <Text style={{ color: theme.colors.text }}>Enable night mode after sunset</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}
          >
            Unable to load digital wellbeing data.
          </Text>
        )}
      </Card>
      
      {renderBreathingModal()}
      {renderMeditationModal()}
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
  sectionDescription: {
    marginBottom: 16,
  },
  typeFilterScroll: {
    marginBottom: 16,
  },
  typeFilterContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  typeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#E0E0E0',
  },
  typeText: {
    fontWeight: '500',
  },
  moodSelectorContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  moodPrompt: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  moodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  moodButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  breathingButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breathingButton: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  breathingButtonText: {
    color: 'white',
    fontWeight: '600',
    marginTop: 8,
  },
  meditationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  meditationCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  meditationCardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  meditationCardDetails: {
    flex: 1,
  },
  meditationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  meditationCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meditationMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  meditationMetaText: {
    fontSize: 12,
    marginLeft: 4,
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
  wellbeingContainer: {
    marginBottom: 8,
  },
  wellbeingStat: {
    alignItems: 'center',
    marginBottom: 20,
  },
  wellbeingValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  wellbeingLabel: {
    fontSize: 14,
  },
  wellbeingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  wellbeingSmallStat: {
    alignItems: 'center',
  },
  wellbeingSmallValue: {
    fontSize: 24,
    fontWeight: '600',
  },
  wellbeingSmallLabel: {
    fontSize: 12,
  },
  appUsageTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  appUsageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appUsageBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  appUsageBar: {
    height: '100%',
    borderRadius: 4,
  },
  wellbeingTips: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(0, 188, 212, 0.1)',
    borderRadius: 8,
  },
  wellbeingTipsTitle: {
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
  meditationImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 16,
  },
  meditationDescription: {
    marginBottom: 16,
    lineHeight: 22,
  },
  meditationDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  meditationDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  breathingModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  breathingModalContent: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  breathingTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  breathingInstructions: {
    marginBottom: 24,
    textAlign: 'center',
  },
  breathingCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    height: 240,
  },
  breathingCircle: {
    borderRadius: 100,
    position: 'absolute',
  },  breathCounter: {
    fontSize: 18,
    fontWeight: '600',
    zIndex: 10,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MindfulnessScreen;
