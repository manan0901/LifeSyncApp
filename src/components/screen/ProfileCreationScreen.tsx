import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../themes/ThemeContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../core/Button';
import Input from '../core/Input';
import { setProfile, completeOnboarding } from '../../redux/slices/userSlice';

// Available gender options
const genderOptions = [
  { value: 'male', label: 'Male', icon: 'gender-male' },
  { value: 'female', label: 'Female', icon: 'gender-female' },
  { value: 'other', label: 'Other', icon: 'gender-non-binary' },
];

// Available profession groups
const professionGroups = [
  {
    title: 'Education',
    options: [
      { value: 'student', label: 'Student', icon: 'school' },
      { value: 'teacher', label: 'Teacher', icon: 'teach' },
    ],
  },
  {
    title: 'Office & Business',
    options: [
      { value: 'office_worker', label: 'Office Worker', icon: 'briefcase' },
      { value: 'manager', label: 'Manager', icon: 'account-tie' },
      { value: 'entrepreneur', label: 'Entrepreneur', icon: 'rocket-launch' },
    ],
  },
  {
    title: 'Healthcare',
    options: [
      { value: 'doctor', label: 'Doctor', icon: 'medical-bag' },
      { value: 'nurse', label: 'Nurse', icon: 'hospital' },
      { value: 'therapist', label: 'Therapist', icon: 'heart-pulse' },
    ],
  },
  {
    title: 'Creative',
    options: [
      { value: 'artist', label: 'Artist', icon: 'palette' },
      { value: 'designer', label: 'Designer', icon: 'pencil-ruler' },
      { value: 'writer', label: 'Writer', icon: 'pen' },
    ],
  },
  {
    title: 'Other',
    options: [
      { value: 'parent', label: 'Parent', icon: 'human-male-female-child' },
      { value: 'retired', label: 'Retired', icon: 'beach' },
      { value: 'other', label: 'Other', icon: 'account' },
    ],
  },
];

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(2, 'Name too short'),
  dateOfBirth: Yup.string()
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      'Date must be in format YYYY-MM-DD'
    )
    .test(
      'is-valid-date',
      'Please enter a valid date',
      (value) => {
        if (!value) return false;
        const date = new Date(value);
        return !isNaN(date.getTime());
      }
    )
    .required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  profession: Yup.string().required('Profession is required'),
  height: Yup.number()
    .min(50, 'Height must be at least 50 cm')
    .max(250, 'Height must be at most 250 cm')
    .required('Height is required'),
  weight: Yup.number()
    .min(20, 'Weight must be at least 20 kg')
    .max(300, 'Weight must be at most 300 kg')
    .required('Weight is required'),
});

const ProfileCreationScreen: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  const [selectedProfessionGroup, setSelectedProfessionGroup] = useState<string | null>(null);
  
  // Handle form submission
  const handleSubmit = (values: any) => {
    // Dispatch actions to save profile and complete onboarding
    dispatch(setProfile(values));
    dispatch(completeOnboarding());
    
    // Navigate to main app
    navigation.navigate('MainTabs' as never);
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          Create Your Profile
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Help us personalize your experience. Your data remains on your device.
        </Text>
      </View>
      
      {/* Profile image placeholder - could be implemented with image picker */}
      <View style={styles.avatarContainer}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
          <MaterialCommunityIcons name="account" size={64} color="#FFFFFF" />
        </View>
      </View>
      
      <Formik
        initialValues={{
          name: '',
          dateOfBirth: '',
          gender: '',
          profession: '',
          height: '',
          weight: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View style={styles.form}>
            {/* Name */}
            <Input
              label="Name"
              placeholder="Enter your name"
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              error={touched.name && errors.name ? errors.name : undefined}
              leftIcon={
                <MaterialCommunityIcons
                  name="account"
                  size={20}
                  color={theme.colors.primary}
                />
              }
            />
            
            {/* Date of Birth */}
            <Input
              label="Date of Birth (YYYY-MM-DD)"
              placeholder="e.g. 1990-01-15"
              value={values.dateOfBirth}
              onChangeText={handleChange('dateOfBirth')}
              onBlur={handleBlur('dateOfBirth')}
              error={touched.dateOfBirth && errors.dateOfBirth ? errors.dateOfBirth : undefined}
              leftIcon={
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color={theme.colors.primary}
                />
              }
            />
              {/* Gender Selection */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: theme.colors.onBackground }]}>
                Gender
              </Text>
              <View style={styles.genderOptions}>
                {genderOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.genderOption,
                      {
                        backgroundColor:
                          values.gender === option.value
                            ? theme.colors.primary
                            : theme.colors.surface,
                      },
                    ]}
                    onPress={() => setFieldValue('gender', option.value)}
                  >                    <MaterialCommunityIcons
                      name={option.icon as any}
                      size={24}
                      color={
                        values.gender === option.value
                          ? '#FFFFFF'
                          : theme.colors.onBackground
                      }
                    /><Text
                      style={[
                        styles.genderLabel,
                        {
                          color:
                            values.gender === option.value
                              ? '#FFFFFF'
                              : theme.colors.onBackground,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {touched.gender && errors.gender ? (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.gender}
                </Text>
              ) : null}
            </View>
              {/* Profession Selection */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: theme.colors.onBackground }]}>
                Profession
              </Text>
              
              {/* Profession Groups */}
              {!selectedProfessionGroup ? (
                <View style={styles.professionGroups}>
                  {professionGroups.map((group) => (
                    <TouchableOpacity
                      key={group.title}
                      style={[
                        styles.professionGroupCard,
                        { backgroundColor: theme.colors.surface },
                      ]}
                      onPress={() => setSelectedProfessionGroup(group.title)}
                    >                      <Text style={[styles.professionGroupTitle, { color: theme.colors.onBackground }]}>
                        {group.title}
                      </Text>
                      <View style={styles.professionGroupIcons}>
                        {group.options.slice(0, 3).map((option, index) => (
                          <MaterialCommunityIcons
                            key={index}
                            name={option.icon as any}
                            size={20}
                            color={theme.colors.primary}
                            style={styles.professionGroupIcon}
                          />
                        ))}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <>
                  {/* Back Button */}
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setSelectedProfessionGroup(null)}
                  >
                    <MaterialCommunityIcons
                      name="arrow-left"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>
                      Back to categories
                    </Text>
                  </TouchableOpacity>
                  
                  {/* Profession Options */}
                  <View style={styles.professionOptions}>
                    {professionGroups
                      .find(g => g.title === selectedProfessionGroup)
                      ?.options.map(option => (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.professionOption,
                            {
                              backgroundColor:
                                values.profession === option.value
                                  ? theme.colors.primary
                                  : theme.colors.surface,
                            },
                          ]}
                          onPress={() => setFieldValue('profession', option.value)}
                        >                          <MaterialCommunityIcons
                            name={option.icon as any}
                            size={28}
                            color={
                              values.profession === option.value
                                ? '#FFFFFF'
                                : theme.colors.onBackground
                            }
                          />
                          <Text
                            style={[
                              styles.professionLabel,
                              {
                                color:
                                  values.profession === option.value
                                    ? '#FFFFFF'
                                    : theme.colors.onBackground,
                              },
                            ]}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </>
              )}
              
              {touched.profession && errors.profession ? (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.profession}
                </Text>
              ) : null}
            </View>
            
            {/* Height and Weight */}
            <View style={styles.rowFields}>
              <View style={styles.halfField}>
                <Input
                  label="Height (cm)"
                  placeholder="e.g. 175"
                  value={values.height.toString()}
                  onChangeText={(text) => setFieldValue('height', text ? parseFloat(text) : '')}
                  onBlur={handleBlur('height')}
                  error={touched.height && errors.height ? errors.height : undefined}
                  keyboardType="numeric"
                  leftIcon={
                    <MaterialCommunityIcons
                      name="human-male-height"
                      size={20}
                      color={theme.colors.primary}
                    />
                  }
                />
              </View>
              
              <View style={styles.halfField}>
                <Input
                  label="Weight (kg)"
                  placeholder="e.g. 70"
                  value={values.weight.toString()}
                  onChangeText={(text) => setFieldValue('weight', text ? parseFloat(text) : '')}
                  onBlur={handleBlur('weight')}
                  error={touched.weight && errors.weight ? errors.weight : undefined}
                  keyboardType="numeric"
                  leftIcon={
                    <MaterialCommunityIcons
                      name="weight-kilogram"
                      size={20}
                      color={theme.colors.primary}
                    />
                  }
                />
              </View>
            </View>
              {/* Submit Button */}
            <Button
              title="Complete Profile"
              size="large"
              fullWidth
              onPress={() => handleSubmit()}
              style={styles.submitButton}
              icon={
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color="#FFFFFF"
                />
              }
            />
          </View>
        )}
      </Formik>
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
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  form: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  genderLabel: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  professionGroups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  professionGroupCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  professionGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  professionGroupIcons: {
    flexDirection: 'row',
  },
  professionGroupIcon: {
    marginRight: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  professionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  professionOption: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  professionLabel: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  rowFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    marginTop: 24,
  },
});

export default ProfileCreationScreen;
