import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../redux/store';
import { useTheme } from '../../themes/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Timeline from '../feature/Timeline';
import Button from '../core/Button';
import { setCurrentDate, addTask, deleteTask, updateTask } from '../../redux/slices/scheduleSlice';

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

const TimelineScreen: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  
  // Get the current date from Redux store
  const currentDate = useSelector((state: RootState) => state.schedule.currentDate);
  const tasks = useSelector((state: RootState) => 
    state.schedule.dailyTasks[currentDate] || []
  );
  
  // State for the task modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Selected task details
  const selectedTask = selectedTaskId 
    ? tasks.find(task => task.id === selectedTaskId)
    : null;
  
  // Function to handle date change
  const handleDateChange = (direction: 'prev' | 'next') => {
    const currentDateObj = new Date(currentDate);
    
    // Add or subtract one day
    if (direction === 'prev') {
      currentDateObj.setDate(currentDateObj.getDate() - 1);
    } else {
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }
    
    // Format the new date as YYYY-MM-DD
    const newDate = currentDateObj.toISOString().split('T')[0];
    
    // Update the current date in Redux
    dispatch(setCurrentDate(newDate));
  };
  
  // Format a date for display (e.g., "May 10, 2025")
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  // Check if the date is today
  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };
  
  // Function to handle task press
  const handleTaskPress = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsModalVisible(true);
  };
    // Function to add a new task (this would normally open a form)
  const handleAddTask = () => {
    // This is a simple example - in a real app, you'd have a form
    const newTask = {
      id: generateId(),
      title: `New Task ${tasks.length + 1}`,
      description: 'Task description',
      startTime: '08:00',
      endTime: '09:00',
      completed: false,
      category: 'work',
      priority: 'medium' as const,
      location: 'Home', // Added required location property
    };
    
    dispatch(addTask({ date: currentDate, task: newTask }));
  };
  
  // Function to toggle task completion
  const handleToggleComplete = () => {
    if (selectedTaskId) {
      const task = tasks.find(t => t.id === selectedTaskId);
      if (task) {
        dispatch(updateTask({
          date: currentDate,
          taskId: selectedTaskId,
          updates: { completed: !task.completed }
        }));
      }
    }
  };
  
  // Function to delete a task
  const handleDeleteTask = () => {
    if (selectedTaskId) {
      dispatch(deleteTask({
        date: currentDate,
        taskId: selectedTaskId
      }));
      setIsModalVisible(false);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
          Timeline
        </Text>
        
        {/* Date selector */}
        <View style={styles.dateSelector}>
          <TouchableOpacity 
            style={styles.dateArrow}
            onPress={() => handleDateChange('prev')}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
            <View style={styles.dateContainer}>
            <Text style={[styles.dateText, { color: theme.colors.onBackground }]}>
              {formatDisplayDate(currentDate)}
            </Text>
            {isToday(currentDate) && (
              <View style={[styles.todayBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.todayText}>TODAY</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.dateArrow}
            onPress={() => handleDateChange('next')}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
        
        {/* Add task button */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddTask}
        >
          <MaterialCommunityIcons
            name="plus"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
      
      {/* Timeline */}
      <Timeline 
        date={currentDate}
        onTaskPress={handleTaskPress}
      />
      
      {/* Task detail modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View 
            style={[
              styles.modalContent, 
              { backgroundColor: theme.colors.surface }
            ]}
          >
            {selectedTask ? (
              <>                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: theme.colors.onBackground }]}>
                    {selectedTask.title}
                  </Text>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <MaterialCommunityIcons
                      name="close"
                      size={24}
                      color={theme.colors.onSurfaceVariant}
                    />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalBody}>
                  {/* Task time */}
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={20}
                      color={theme.colors.primary}
                    />                    <Text style={[styles.detailText, { color: theme.colors.onBackground }]}>
                      {selectedTask.startTime} - {selectedTask.endTime}
                    </Text>
                  </View>
                  
                  {/* Task category */}
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons
                      name={selectedTask.category === 'work' ? 'briefcase' : 'tag'}
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={[styles.detailText, { color: theme.colors.onBackground }]}>
                      {selectedTask.category.charAt(0).toUpperCase() + selectedTask.category.slice(1)}
                    </Text>
                  </View>
                  
                  {/* Task priority */}
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons
                      name="flag"
                      size={20}
                      color={
                        selectedTask.priority === 'high' ? '#F44336' :
                        selectedTask.priority === 'medium' ? '#FF9800' : '#8BC34A'
                      }
                    />
                    <Text style={[styles.detailText, { color: theme.colors.onBackground }]}>
                      {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)} Priority
                    </Text>
                  </View>
                    {/* Task description */}
                  {selectedTask.description && (
                    <View style={styles.description}>
                      <Text style={[styles.descriptionLabel, { color: theme.colors.onBackground }]}>
                        Description
                      </Text>
                      <Text style={[styles.descriptionText, { color: theme.colors.onBackground }]}>
                        {selectedTask.description}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.modalActions}>
                  <Button
                    title={selectedTask.completed ? "Mark Incomplete" : "Mark Complete"}
                    variant={selectedTask.completed ? "outline" : "primary"}
                    onPress={handleToggleComplete}
                    icon={
                      <MaterialCommunityIcons
                        name={selectedTask.completed ? "close-circle" : "check-circle"}
                        size={20}
                        color={selectedTask.completed ? theme.colors.primary : "#FFFFFF"}
                      />
                    }
                  />
                  
                  <Button
                    title="Delete Task"
                    variant="secondary"
                    onPress={handleDeleteTask}
                    icon={
                      <MaterialCommunityIcons
                        name="trash-can"
                        size={20}
                        color="#FFFFFF"
                      />
                    }
                  />
                </View>              </>
            ) : (
              <Text style={{ color: theme.colors.onBackground }}>Loading task details...</Text>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateArrow: {
    padding: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
  },
  todayBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  todayText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: 10,
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
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 16,
  },
  description: {
    marginTop: 16,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
});

export default TimelineScreen;
