import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../themes/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../core/Button';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Onboarding content
const slides = [
  {
    key: 'welcome',
    title: 'Welcome to LifeSync',
    description: 'Your personal daily routine tracker that adapts to your lifestyle and helps you achieve your goals.',
    icon: 'home-circle',
    color: '#4C84FF',
  },
  {
    key: 'timeline',
    title: 'Smart Timeline',
    description: 'Manage your daily schedule with ease. Get personalized recommendations based on your routine.',
    icon: 'calendar-clock',
    color: '#FF6B6B',
  },
  {
    key: 'health',
    title: 'Health Monitoring',
    description: 'Track your health metrics, get insights, and improve your overall wellbeing with personalized recommendations.',
    icon: 'heart-pulse',
    color: '#4CAF50',
  },
  {
    key: 'media',
    title: 'Media Integration',
    description: 'Connect with your favorite platforms and get content recommendations that fit your preferences.',
    icon: 'play-circle',
    color: '#7C5295',
  },
];

const OnboardingScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  // State for tracking the current slide index
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Animated value for slide transitions
  const scrollX = useRef(new Animated.Value(0)).current;
  
  // Reference to scroll view for programmatic scrolling
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Handle next button press
  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      // Move to the next slide
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      // Navigate to profile creation on last slide
      navigation.navigate('ProfileCreation' as never);
    }
  };
  
  // Handle skip button press
  const handleSkip = () => {
    navigation.navigate('ProfileCreation' as never);
  };
  
  // Generate dot indicators for the slides
  const renderDots = () => {
    return slides.map((_, index) => {
      // Calculate the opacity based on the current scroll position
      const opacity = scrollX.interpolate({
        inputRange: [(index - 1) * width, index * width, (index + 1) * width],
        outputRange: [0.3, 1, 0.3],
        extrapolate: 'clamp',
      });
      
      // Calculate the size based on the current scroll position
      const size = scrollX.interpolate({
        inputRange: [(index - 1) * width, index * width, (index + 1) * width],
        outputRange: [8, 12, 8],
        extrapolate: 'clamp',
      });
      
      return (
        <Animated.View
          key={`dot-${index}`}
          style={{
            width: size,
            height: size,
            borderRadius: 6,
            backgroundColor: theme.colors.primary,
            marginHorizontal: 5,
            opacity,
          }}
        />
      );
    });
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Animated dots indicator */}
      <View style={styles.dotsContainer}>
        {renderDots()}
      </View>
      
      {/* Skip button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: theme.colors.primary }]}>
            Skip
          </Text>
        </TouchableOpacity>
      )}
      
      {/* Slides */}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          // Update current index on scroll end
          const index = Math.floor(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={styles.scrollView}
      >        {slides.map((slide, index) => (
          <View key={slide.key} style={styles.slide}>
            <View style={styles.imageContainer}>
              {/* Large icon instead of image */}
              <View style={[styles.iconContainer, { backgroundColor: slide.color }]}>
                <MaterialCommunityIcons name={slide.icon as any} color="#FFFFFF" size={120} />
              </View>
            </View>
            
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: theme.colors.onBackground }]}>
                {slide.title}
              </Text>
              <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
                {slide.description}
              </Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
      
      {/* Next/Get Started button */}
      <View style={styles.buttonContainer}>
        <Button
          title={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          size="large"
          fullWidth
          onPress={handleNext}
          icon={
            <MaterialCommunityIcons 
              name={currentIndex === slides.length - 1 ? "rocket-launch" : "arrow-right"} 
              size={24} 
              color="#FFFFFF" 
            />
          }
          iconPosition="right"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 60,
    width: '100%',
    zIndex: 10,
  },
  skipButton: {
    position: 'absolute',
    top: 56,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },  imageContainer: {
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    width: '100%',
  },
});

export default OnboardingScreen;
