import React from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../../themes/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootState } from '../../redux/store';
import { updateSettings, resetUser } from '../../redux/slices/userSlice';
import Card from '../core/Card';
import Button from '../core/Button';

const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme, isDarkMode, setThemeType } = useTheme();
  const dispatch = useDispatch();
  
  const { settings, profile } = useSelector((state: RootState) => state.user);
  
  // Toggle notification settings
  const handleNotificationToggle = (value: boolean) => {
    dispatch(updateSettings({ notifications: value }));
  };
  
  // Toggle privacy settings
  const handlePrivacyToggle = (setting: 'activityTracking' | 'healthDataSharing', value: boolean) => {
    dispatch(updateSettings({ 
      privacySettings: {
        ...settings.privacySettings,
        [setting]: value
      }
    }));
  };
  
  // Reset user data
  const handleReset = () => {
    dispatch(resetUser());
    // You would typically navigate to the onboarding screen here
    // This is simplified for the example
  };
  
  // Render a setting row with a switch
  const renderSettingSwitch = (
    icon: string, 
    title: string, 
    description: string, 
    value: boolean,
    onToggle: (value: boolean) => void,
    iconColor?: string
  ) => (
    <View style={styles.settingRow}>
      <MaterialCommunityIcons
        name={icon as any}
        size={24}
        color={iconColor || theme.colors.primary}
        style={styles.settingIcon}
      />
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.settingDescription, { color: theme.colors.placeholder }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
      />
    </View>
  );
  
  // Render a theme option
  const renderThemeOption = (
    title: string, 
    type: 'light' | 'dark' | 'system',
    icon: string
  ) => (
    <TouchableOpacity
      style={[
        styles.themeOption,
        { 
          backgroundColor: 
            (type === 'light' && !isDarkMode && themeType !== 'system') ||
            (type === 'dark' && isDarkMode && themeType !== 'system') ||
            (type === 'system' && themeType === 'system')
              ? theme.colors.primary
              : theme.colors.surface
        }
      ]}
      onPress={() => setThemeType(type)}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={24}
        color={
          (type === 'light' && !isDarkMode && themeType !== 'system') ||
          (type === 'dark' && isDarkMode && themeType !== 'system') ||
          (type === 'system' && themeType === 'system')
            ? '#FFFFFF'
            : theme.colors.text
        }
      />
      <Text
        style={[
          styles.themeOptionText,
          {
            color: 
              (type === 'light' && !isDarkMode && themeType !== 'system') ||
              (type === 'dark' && isDarkMode && themeType !== 'system') ||
              (type === 'system' && themeType === 'system')
                ? '#FFFFFF'
                : theme.colors.text
          }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
  
  // Track theme type for system/light/dark selection UI
  const [themeType, setThemeTypeState] = React.useState<'light' | 'dark' | 'system'>('system');
  
  // Update theme when option is selected
  const handleThemeTypeChange = (type: 'light' | 'dark' | 'system') => {
    setThemeTypeState(type);
    setThemeType(type);
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
        Settings
      </Text>
      
      {/* Profile Summary */}
      <Card
        elevated
      >
        <View style={styles.profileSummary}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.avatarText}>
              {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={[styles.profileName, { color: theme.colors.text }]}>
              {profile.name || 'User'}
            </Text>
            <Text style={[styles.profileDetails, { color: theme.colors.placeholder }]}>
              {profile.profession && profile.profession.charAt(0).toUpperCase() + profile.profession.slice(1).replace('_', ' ')}
              {profile.gender && profile.profession && ' • '}
              {profile.gender && profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <MaterialCommunityIcons
              name="pencil"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
      </Card>
      
      {/* Appearance Settings */}
      <Card
        title="Appearance"
        subtitle="Customize the app's look"
        icon="palette"
        iconColor="#9C27B0"
        elevated
      >
        <View style={styles.themeOptions}>
          {renderThemeOption('Light', 'light', 'white-balance-sunny')}
          {renderThemeOption('Dark', 'dark', 'weather-night')}
          {renderThemeOption('System', 'system', 'theme-light-dark')}
        </View>
      </Card>
      
      {/* Notification Settings */}
      <Card
        title="Notifications"
        subtitle="Manage your alerts"
        icon="bell"
        iconColor="#FF9800"
        elevated
      >
        {renderSettingSwitch(
          'bell-ring',
          'Enable Notifications',
          'Receive alerts for tasks, health insights, and more',
          settings.notifications,
          handleNotificationToggle
        )}
      </Card>
      
      {/* Privacy Settings */}
      <Card
        title="Privacy"
        subtitle="Manage your data"
        icon="shield-account"
        iconColor="#4CAF50"
        elevated
      >
        {renderSettingSwitch(
          'run',
          'Activity Tracking',
          'Allow the app to track your daily activities',
          settings.privacySettings.activityTracking,
          (value) => handlePrivacyToggle('activityTracking', value)
        )}
        {renderSettingSwitch(
          'heart-pulse',
          'Health Data Sharing',
          'Share health data with connected devices',
          settings.privacySettings.healthDataSharing,
          (value) => handlePrivacyToggle('healthDataSharing', value)
        )}
      </Card>
      
      {/* Data Management */}
      <Card
        title="Data Management"
        subtitle="Reset or export your data"
        icon="database"
        iconColor="#795548"
        elevated
      >
        <Button
          title="Reset User Data"
          variant="secondary"
          onPress={handleReset}
          icon={<MaterialCommunityIcons name="refresh" size={20} color="#FFFFFF" />}
          style={styles.resetButton}
        />
        <Text style={[styles.warningText, { color: theme.colors.error }]}>
          Warning: This will delete all your data and cannot be undone.
        </Text>
      </Card>
      
      {/* About Section */}
      <Card
        title="About LifeSync"
        subtitle="Version 1.0.0"
        icon="information"
        iconColor="#2196F3"
        elevated
      >
        <Text style={{ color: theme.colors.text, marginBottom: 8 }}>
          LifeSync is a comprehensive daily routine tracking application designed to help users of all ages manage their daily activities.
        </Text>
        <TouchableOpacity style={styles.linkButton}>
          <MaterialCommunityIcons name="web" size={20} color={theme.colors.primary} />
          <Text style={[styles.linkText, { color: theme.colors.primary }]}>
            Visit Website
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton}>
          <MaterialCommunityIcons name="email" size={20} color={theme.colors.primary} />
          <Text style={[styles.linkText, { color: theme.colors.primary }]}>
            Contact Support
          </Text>
        </TouchableOpacity>
      </Card>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.placeholder }]}>
          © 2025 LifeSync • All Rights Reserved
        </Text>
      </View>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
  },
  editButton: {
    padding: 8,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  themeOption: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  themeOptionText: {
    marginTop: 8,
    fontSize: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
  },
  resetButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 12,
    marginBottom: 8,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  linkText: {
    marginLeft: 8,
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
  },
});

export default SettingsScreen;
