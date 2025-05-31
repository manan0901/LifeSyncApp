import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useTheme } from '../../themes/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface TimelineProps {
  date?: string; // Format: 'YYYY-MM-DD'
  onTaskPress?: (taskId: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ 
  date = new Date().toISOString().split('T')[0],
  onTaskPress 
}) => {
  const { theme } = useTheme();
  const currentDate = useSelector((state: RootState) => state.schedule.currentDate);
  const tasks = useSelector((state: RootState) => 
    state.schedule.dailyTasks[date] || []
  );
  
  // Sort tasks by start time
  const sortedTasks = [...tasks].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });
  
  // Format time from 24-hour to 12-hour format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };
  
  // Get category icon and color
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'work':
        return { name: 'briefcase', color: '#4CAF50' };
      case 'study':
        return { name: 'book-open-variant', color: '#2196F3' };
      case 'exercise':
        return { name: 'run', color: '#FF9800' };
      case 'meal':
        return { name: 'food', color: '#E91E63' };
      case 'leisure':
        return { name: 'gamepad-variant', color: '#9C27B0' };
      case 'sleep':
        return { name: 'sleep', color: '#607D8B' };
      case 'meeting':
        return { name: 'account-group', color: '#00BCD4' };
      case 'health':
        return { name: 'heart-pulse', color: '#F44336' };
      default:
        return { name: 'calendar-check', color: theme.colors.primary };
    }
  };
  
  // Check if two time ranges overlap
  const hasConflict = (task: typeof tasks[0], index: number) => {
    for (let i = 0; i < sortedTasks.length; i++) {
      if (i !== index) {
        const otherTask = sortedTasks[i];
        // Check if the tasks overlap
        if (
          (task.startTime < otherTask.endTime && task.endTime > otherTask.startTime) ||
          (otherTask.startTime < task.endTime && otherTask.endTime > task.startTime)
        ) {
          return true;
        }
      }
    }
    return false;
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Timeline line */}
      <View style={[styles.timeline, { backgroundColor: theme.colors.disabled }]} />
      
      {/* Tasks on timeline */}
      {sortedTasks.map((task, index) => {
        const { name, color } = getCategoryIcon(task.category);
        const conflict = hasConflict(task, index);
        
        return (
          <TouchableOpacity
            key={task.id}
            style={styles.taskContainer}
            onPress={() => onTaskPress && onTaskPress(task.id)}
            activeOpacity={0.8}
          >
            {/* Time node */}
            <View style={styles.timeContainer}>
              <Text style={[styles.time, { color: theme.colors.text }]}>
                {formatTime(task.startTime)}
              </Text>
              
              {/* Timeline node */}
              <View style={styles.nodeContainer}>
                <View 
                  style={[
                    styles.node, 
                    { 
                      backgroundColor: color,
                      borderColor: theme.dark ? '#121212' : '#FFFFFF', 
                    }
                  ]} 
                />
              </View>
            </View>
            
            {/* Task card */}
            <View 
              style={[
                styles.taskCard,
                { 
                  backgroundColor: theme.colors.surface,
                  borderLeftColor: color,
                  borderLeftWidth: 4,
                }
              ]}
            >
              {/* Header with title and icon */}
              <View style={styles.taskHeader}>
                <Text 
                  style={[
                    styles.taskTitle, 
                    { 
                      color: theme.colors.text,
                      textDecorationLine: task.completed ? 'line-through' : 'none',
                    }
                  ]}
                >
                  {task.title}
                </Text>
                <MaterialCommunityIcons name={name as any} size={20} color={color} />
              </View>
              
              {/* Time range and conflict warning */}
              <View style={styles.taskDetails}>
                <View style={styles.taskTime}>
                  <MaterialCommunityIcons 
                    name="clock-outline" 
                    size={14} 
                    color={theme.colors.placeholder} 
                  />
                  <Text style={[styles.taskTimeText, { color: theme.colors.placeholder }]}>
                    {formatTime(task.startTime)} - {formatTime(task.endTime)}
                  </Text>
                </View>
                
                {conflict && (
                  <View style={styles.conflictBadge}>
                    <MaterialCommunityIcons 
                      name="alert" 
                      size={12} 
                      color="#FFFFFF" 
                    />
                    <Text style={styles.conflictText}>Conflict</Text>
                  </View>
                )}
              </View>
              
              {/* Description if exists */}
              {task.description && (
                <Text 
                  style={[styles.taskDescription, { color: theme.colors.text }]}
                  numberOfLines={2}
                >
                  {task.description}
                </Text>
              )}
              
              {/* Priority and completion status */}
              <View style={styles.taskFooter}>
                <View 
                  style={[
                    styles.priorityBadge,
                    {
                      backgroundColor: 
                        task.priority === 'high' ? '#F8BBD0' :
                        task.priority === 'medium' ? '#FFE0B2' : '#DCEDC8',
                    }
                  ]}
                >
                  <Text 
                    style={{
                      color: 
                        task.priority === 'high' ? '#C2185B' :
                        task.priority === 'medium' ? '#E65100' : '#33691E',
                      fontSize: 10,
                      fontWeight: '600',
                    }}
                  >
                    {task.priority.toUpperCase()}
                  </Text>
                </View>
                
                {task.completed && (
                  <View style={styles.completedBadge}>
                    <MaterialCommunityIcons 
                      name="check-circle" 
                      size={14} 
                      color="#4CAF50" 
                    />
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
      
      {/* Empty state */}
      {sortedTasks.length === 0 && (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons 
            name="calendar-blank" 
            size={64} 
            color={theme.colors.disabled} 
          />
          <Text style={[styles.emptyText, { color: theme.colors.placeholder }]}>
            No tasks scheduled for today
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.placeholder }]}>
            Add a new task to get started
          </Text>
        </View>
      )}
      
      {/* Extra space at bottom */}
      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  timeline: {
    position: 'absolute',
    left: 72, // Aligns with the center of the timeline node
    width: 2,
    height: '100%',
    zIndex: -1,
  },
  taskContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeContainer: {
    width: 80,
    alignItems: 'flex-end',
    paddingRight: 12,
  },
  time: {
    fontSize: 12,
    marginBottom: 4,
  },
  nodeContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  node: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
  },
  taskCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    marginLeft: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  taskDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTimeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  conflictBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  conflictText: {
    fontSize: 10,
    color: '#FFFFFF',
    marginLeft: 2,
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  footer: {
    height: 40,
  },
});

export default Timeline;
