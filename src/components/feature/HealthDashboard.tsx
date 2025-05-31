import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useTheme } from '../../themes/ThemeContext';
import Card from '../core/Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { VictoryPie, VictoryLabel } from 'victory-native';

const HealthDashboard: React.FC = () => {
  const { theme } = useTheme();
  const { profile, healthStatus } = useSelector((state: RootState) => state.user);
  const vitalSigns = useSelector((state: RootState) => {
    const today = new Date().toISOString().split('T')[0];
    return state.activity.vitalSigns[today] || [];
  });
  
  // Get the latest vital signs
  const latestVitals = vitalSigns.length > 0 ? vitalSigns[vitalSigns.length - 1] : null;
  
  // BMI category colors
  const getBmiCategoryColor = () => {
    if (!profile.bmi) return theme.colors.placeholder;
    
    if (profile.bmi < 18.5) return '#64B5F6'; // Underweight - blue
    if (profile.bmi >= 18.5 && profile.bmi < 25) return '#81C784'; // Normal - green
    if (profile.bmi >= 25 && profile.bmi < 30) return '#FFB74D'; // Overweight - orange
    return '#E57373'; // Obese - red
  };
  
  // Format BMI text
  const formatBmi = () => {
    if (!profile.bmi) return 'N/A';
    return profile.bmi.toFixed(1);
  };
  
  // Get BMI category text
  const getBmiCategory = () => {
    if (!profile.bmi) return 'Not available';
    
    if (profile.bmi < 18.5) return 'Underweight';
    if (profile.bmi >= 18.5 && profile.bmi < 25) return 'Normal weight';
    if (profile.bmi >= 25 && profile.bmi < 30) return 'Overweight';
    return 'Obese';
  };
  
  // Function to render health metric
  const renderMetric = (
    icon: string, 
    title: string, 
    value: string | number | undefined, 
    unit?: string,
    color?: string
  ) => (
    <View style={styles.metric}>
      <MaterialCommunityIcons
        name={icon as any}
        size={24}
        color={color || theme.colors.primary}
        style={styles.metricIcon}
      />
      <Text style={[styles.metricTitle, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.metricValue, { color: theme.colors.text }]}>
        {value !== undefined ? `${value}${unit ? ` ${unit}` : ''}` : 'N/A'}
      </Text>
    </View>
  );
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Health Overview</Text>
      
      {/* BMI Card */}
      <Card
        title="Body Mass Index"
        subtitle={`${getBmiCategory()} - ${formatBmi()}`}
        icon="scale-bathroom"
        iconColor={getBmiCategoryColor()}
        elevated
        style={styles.bmiCard}
      >
        <View style={styles.bmiChartContainer}>
          <VictoryPie
            data={[
              { x: 1, y: profile.bmi && profile.bmi < 18.5 ? 100 : 0 },
              { x: 2, y: profile.bmi && profile.bmi >= 18.5 && profile.bmi < 25 ? 100 : 0 },
              { x: 3, y: profile.bmi && profile.bmi >= 25 && profile.bmi < 30 ? 100 : 0 },
              { x: 4, y: profile.bmi && profile.bmi >= 30 ? 100 : 0 },
              { x: 5, y: !profile.bmi ? 100 : 0 }
            ]}
            colorScale={['#64B5F6', '#81C784', '#FFB74D', '#E57373', theme.colors.disabled]}
            innerRadius={70}
            labelComponent={<VictoryLabel text="" />}
            width={200}
            height={200}
            padAngle={2}
          />
          <View style={styles.bmiValueOverlay}>
            <Text style={[styles.bmiValue, { color: getBmiCategoryColor() }]}>{formatBmi()}</Text>
            <Text style={[styles.bmiLabel, { color: theme.colors.text }]}>BMI</Text>
          </View>
        </View>
        
        <View style={styles.bmiLegendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#64B5F6' }]} />
            <Text style={{ color: theme.colors.text }}>Underweight (&lt;18.5)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#81C784' }]} />
            <Text style={{ color: theme.colors.text }}>Normal (18.5-24.9)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFB74D' }]} />
            <Text style={{ color: theme.colors.text }}>Overweight (25-29.9)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#E57373' }]} />
            <Text style={{ color: theme.colors.text }}>Obese (≥30)</Text>
          </View>
        </View>
      </Card>
      
      {/* Vital Signs Card */}
      <Card
        title="Vital Signs"
        subtitle="Current health metrics"
        icon="heart-pulse"
        iconColor="#FF5722"
        elevated
      >
        <View style={styles.vitalsContainer}>
          {renderMetric(
            'heart-pulse', 
            'Heart Rate', 
            latestVitals?.heartRate, 
            'BPM',
            '#E57373'
          )}
          {renderMetric(
            'water-percent', 
            'Blood Oxygen', 
            latestVitals?.bloodOxygen, 
            '%',
            '#64B5F6'
          )}
          {renderMetric(
            'emoticon-outline', 
            'Stress Level', 
            latestVitals?.stressLevel, 
            '/10',
            '#FFB74D'
          )}
          {renderMetric(
            'shoe-print', 
            'Steps Today', 
            latestVitals?.steps,
            '',
            '#81C784'
          )}
        </View>
        
        {latestVitals?.sleep && (
          <View style={styles.sleepContainer}>
            <Text style={[styles.sleepTitle, { color: theme.colors.text }]}>
              Last Night's Sleep
            </Text>
            <View style={styles.sleepDetails}>
              <View style={styles.sleepMetric}>
                <MaterialCommunityIcons
                  name="clock-time-eight"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={{ color: theme.colors.text }}>
                  {latestVitals.sleep.duration} hours
                </Text>
              </View>
              <View style={styles.sleepMetric}>
                <MaterialCommunityIcons
                  name="star"
                  size={20}
                  color="#FFD700"
                />
                <Text style={{ color: theme.colors.text }}>
                  Quality: {latestVitals.sleep.quality}/10
                </Text>
              </View>
            </View>
          </View>
        )}
      </Card>
      
      {/* Quick Actions Card */}
      <Card
        title="Health Actions"
        subtitle="Quick access to health features"
        icon="lightning-bolt"
        iconColor="#FFC107"
        elevated
      >
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.action}>
            <View style={[styles.actionIcon, { backgroundColor: '#E1F5FE' }]}>
              <MaterialCommunityIcons name="cup-water" size={24} color="#03A9F4" />
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              Add Water
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.action}>
            <View style={[styles.actionIcon, { backgroundColor: '#F1F8E9' }]}>
              <MaterialCommunityIcons name="meditation" size={24} color="#8BC34A" />
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              Relax
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.action}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons name="heart-plus" size={24} color="#FF9800" />
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              Add Vitals
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.action}>
            <View style={[styles.actionIcon, { backgroundColor: '#E0F2F1' }]}>
              <MaterialCommunityIcons name="run" size={24} color="#009688" />
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              Exercise
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bmiCard: {
    marginBottom: 16,
  },
  bmiChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 200,
  },
  bmiValueOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bmiValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  bmiLabel: {
    fontSize: 16,
  },
  bmiLegendContainer: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  vitalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  metric: {
    alignItems: 'center',
    width: '48%',
    marginVertical: 8,
  },
  metricIcon: {
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sleepContainer: {
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
    paddingTop: 16,
  },
  sleepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sleepDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sleepMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  action: {
    alignItems: 'center',
    width: '25%',
    marginVertical: 8,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default HealthDashboard;
