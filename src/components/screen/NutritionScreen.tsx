import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Image } from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import Card from '../core/Card';
import Button from '../core/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NutritionService, FoodItem } from '../../services';
import { useSelector } from 'react-redux';

const nutritionService = new NutritionService();

const NutritionScreen: React.FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mealRecommendations, setMealRecommendations] = useState<{mealIdea: string; foodItems: FoodItem[]}[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [waterIntake, setWaterIntake] = useState(0);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  
  // Get user from redux store (for dietary preferences)
  const user = useSelector((state: any) => state.user);
  
  // Calculate nutritional needs based on user profile
  const nutritionalNeeds = user?.profile ? nutritionService.calculateDailyNeeds(
    user.profile.weight,
    user.profile.height,
    user.profile.age,
    user.profile.gender,
    user.profile.activityLevel || 'moderate'
  ) : { calories: 2000, protein: 150, carbs: 225, fat: 55 };
  
  // Load meal recommendations when component mounts or meal type changes
  useEffect(() => {
    loadMealRecommendations();
  }, [selectedMealType]);
  
  const loadMealRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      const preferences = user?.profile?.dietaryPreferences || ['balanced'];
      const recommendations = await nutritionService.getMealRecommendations(
        preferences,
        selectedMealType
      );
      setMealRecommendations(recommendations);
    } catch (error) {
      console.error('Failed to load meal recommendations', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await nutritionService.searchFoodItems({ query: searchQuery });
      setSearchResults(results);
    } catch (error) {
      console.error('Food search error', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleWaterIncrement = async (amount: number) => {
    const newTotal = waterIntake + amount;
    setWaterIntake(newTotal);
    
    // In a production app, we would save this to the backend
    await nutritionService.logWaterIntake(amount, 'ml');
  };

  // Meal type tabs
  const renderMealTypeTabs = () => (
    <View style={styles.mealTypeTabs}>
      {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(type => (
        <TouchableOpacity
          key={type}
          style={[
            styles.mealTypeTab,
            selectedMealType === type && { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => setSelectedMealType(type)}
        >
          <Text
            style={[
              styles.mealTypeText,
              { color: selectedMealType === type ? 'white' : theme.colors.onBackground }
            ]}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  // Render a meal recommendation card
  const renderMealRecommendation = ({ item }: { item: {mealIdea: string; foodItems: FoodItem[]} }) => (
    <Card title={item.mealIdea} icon="food" iconColor="#4CAF50" elevated>
      <View style={styles.mealDetails}>
        <View style={styles.nutritionSummary}>
          <Text style={{ color: theme.colors.onBackground }}>
            {item.foodItems.reduce((sum, food) => sum + food.calories, 0)} calories
          </Text>
          <Text style={{ color: theme.colors.onBackground }}>
            P: {item.foodItems.reduce((sum, food) => sum + food.protein, 0)}g • 
            C: {item.foodItems.reduce((sum, food) => sum + food.carbs, 0)}g • 
            F: {item.foodItems.reduce((sum, food) => sum + food.fat, 0)}g
          </Text>
        </View>
        <Button 
          title="Add to Journal" 
          variant="outline" 
          size="small" 
          onPress={() => console.log('Adding meal to journal:', item.mealIdea)} 
        />
      </View>
      
      <FlatList
        horizontal
        data={item.foodItems}
        keyExtractor={(food) => food.id}        renderItem={({ item: food }) => (
          <View style={styles.foodItemCard}>
            {food.image ? (
              <Image 
                source={{ uri: food.image }} 
                style={styles.foodImage} 
                onError={() => {}}
              />
            ) : (
              <View style={[styles.foodImage, styles.placeholderContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                <MaterialCommunityIcons 
                  name="food" 
                  size={24} 
                  color={theme.colors.onSurfaceVariant} 
                />
              </View>
            )}
            <Text style={[styles.foodItemName, { color: theme.colors.onBackground }]}>{food.name}</Text>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>{food.calories} cal</Text>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </Card>
  );
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
        Nutrition
      </Text>
      
      {/* Daily Nutrition Summary */}
      <Card
        title="Daily Overview"
        subtitle="Nutritional summary"
        icon="food-apple"
        iconColor="#4CAF50"
        elevated
      >
        <View style={styles.nutritionGoalsContainer}>
          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={[styles.goalLabel, { color: theme.colors.onBackground }]}>Calories</Text>
              <Text style={[styles.goalValue, { color: theme.colors.primary }]}>
                1200 / {nutritionalNeeds.calories}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { backgroundColor: theme.colors.primary, width: `${(1200 / nutritionalNeeds.calories) * 100}%` }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={{ color: theme.colors.onBackground }}>Protein</Text>
              <Text style={{ color: theme.colors.primary }}>
                75g / {nutritionalNeeds.protein}g
              </Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { backgroundColor: '#FF5722', width: `${(75 / nutritionalNeeds.protein) * 100}%` }
                  ]} 
                />
              </View>
            </View>
            
            <View style={styles.macroItem}>
              <Text style={{ color: theme.colors.onBackground }}>Carbs</Text>
              <Text style={{ color: theme.colors.primary }}>
                120g / {nutritionalNeeds.carbs}g
              </Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { backgroundColor: '#2196F3', width: `${(120 / nutritionalNeeds.carbs) * 100}%` }
                  ]} 
                />
              </View>
            </View>
            
            <View style={styles.macroItem}>
              <Text style={{ color: theme.colors.onBackground }}>Fat</Text>
              <Text style={{ color: theme.colors.primary }}>
                40g / {nutritionalNeeds.fat}g
              </Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { backgroundColor: '#FFC107', width: `${(40 / nutritionalNeeds.fat) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          </View>
        </View>
      </Card>
      
      {/* Water Tracking */}
      <Card
        title="Water Intake"
        subtitle="Stay hydrated"
        icon="water"
        iconColor="#2196F3"
        elevated
      >
        <View style={styles.waterTrackerContainer}>
          <View style={styles.waterProgress}>
            <View style={styles.waterProgressInner}>
              <Text style={styles.waterAmount}>{waterIntake}ml</Text>
              <Text style={styles.waterGoal}>of 2000ml</Text>
            </View>
          </View>
          <View style={styles.waterButtons}>
            <Button 
              title="+100ml" 
              variant="outline" 
              size="small" 
              onPress={() => handleWaterIncrement(100)}
            />
            <Button 
              title="+250ml" 
              variant="outline" 
              size="small" 
              onPress={() => handleWaterIncrement(250)}
            />
            <Button 
              title="+500ml" 
              variant="outline" 
              size="small" 
              onPress={() => handleWaterIncrement(500)}
            />
          </View>
        </View>
      </Card>
      
      {/* Meal Recommendations */}
      <Card
        title="Meal Ideas"
        subtitle="Personalized recommendations"
        icon="food-variant"
        iconColor="#9C27B0"
        elevated
      >
        {renderMealTypeTabs()}
        
        {isLoadingRecommendations ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : (
          mealRecommendations.length > 0 ? (
            <FlatList
              data={mealRecommendations}
              renderItem={renderMealRecommendation}
              keyExtractor={(item, index) => `meal-${index}`}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              No recommendations available for {selectedMealType}
            </Text>
          )
        )}
      </Card>
      
      {/* Food Search */}
      <Card
        title="Food Database"
        subtitle="Search for nutrition information"
        icon="magnify"
        iconColor="#FF9800"
        elevated
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.searchInput,
              { 
                backgroundColor: theme.colors.surface,
                color: theme.colors.onBackground,
                borderColor: theme.colors.outline
              }
            ]}
            placeholder="Search foods..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity 
            style={[styles.searchButton, { backgroundColor: theme.colors.primary }]} 
            onPress={handleSearch}
          >
            <MaterialCommunityIcons name="magnify" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {isSearching ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (              <TouchableOpacity style={styles.foodSearchResult}>
                {item.image ? (
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.searchResultImage}
                    onError={() => {}}
                  />
                ) : (
                  <View style={[styles.searchResultImage, styles.placeholderContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <MaterialCommunityIcons 
                      name="food" 
                      size={20} 
                      color={theme.colors.onSurfaceVariant} 
                    />
                  </View>
                )}
                <View style={styles.foodSearchResultInfo}>
                  <Text style={[styles.foodSearchResultName, { color: theme.colors.onBackground }]}>
                    {item.name}
                  </Text>
                  <Text style={{ color: theme.colors.onSurfaceVariant }}>
                    {item.calories} cal | {item.servingSize}{item.servingUnit}
                  </Text>
                </View>
                <MaterialCommunityIcons 
                  name="plus-circle" 
                  size={24} 
                  color={theme.colors.primary} 
                />
              </TouchableOpacity>
            )}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : searchQuery.length > 0 && (
          <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
            No results found for "{searchQuery}"
          </Text>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  nutritionGoalsContainer: {
    marginBottom: 16,
  },
  goalItem: {
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  goalLabel: {
    fontWeight: '600',
  },
  goalValue: {
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  macrosContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  waterTrackerContainer: {
    alignItems: 'center',
  },
  waterProgress: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 12,
    borderColor: '#2196F3',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterProgressInner: {
    alignItems: 'center',
  },
  waterAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  waterGoal: {
    fontSize: 14,
    color: '#757575',
  },
  waterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  mealTypeTabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mealTypeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  mealTypeText: {
    fontWeight: '500',
  },
  mealDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nutritionSummary: {
    flex: 1,
  },
  foodItemCard: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  foodItemName: {
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  searchButton: {
    width: 46,
    height: 46,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodSearchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  searchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 16,
  },
  foodSearchResultInfo: {
    flex: 1,
  },
  foodSearchResultName: {
    fontWeight: '500',
    marginBottom: 4,
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
  },
  loader: {
    padding: 20,
  },  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NutritionScreen;
