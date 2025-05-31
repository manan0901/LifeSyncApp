// Service for managing push notifications, reminders, and alerts

export interface Notification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: number;
  read: boolean;
  category: 'reminder' | 'alert' | 'update' | 'message' | 'other';
}

export class NotificationService {
  private notifications: Notification[] = [];

  // Schedule a local notification
  async scheduleNotification(
    title: string,
    body: string,
    scheduledTime: Date,
    category: Notification['category'] = 'reminder',
    data?: Record<string, any>
  ): Promise<string> {
    // Mock notification scheduling
    const id = `notification_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // In a real app, this would use platform-specific notification APIs
    console.log(`Scheduled notification "${title}" for ${scheduledTime.toLocaleString()}`);
    
    // For mock purposes, we'll add it to our in-memory list
    this.notifications.push({
      id,
      title,
      body,
      data,
      timestamp: scheduledTime.getTime(),
      read: false,
      category
    });
    
    return id;
  }
  
  // Cancel a scheduled notification
  async cancelNotification(id: string): Promise<boolean> {
    const initialLength = this.notifications.length;
    this.notifications = this.notifications.filter(notification => notification.id !== id);
    
    return initialLength > this.notifications.length;
  }
  
  // Get all notifications
  async getNotifications(): Promise<Notification[]> {
    return [...this.notifications];
  }
  
  // Mark notification as read
  async markAsRead(id: string): Promise<boolean> {
    const notification = this.notifications.find(n => n.id === id);
    
    if (notification) {
      notification.read = true;
      return true;
    }
    
    return false;
  }
  
  // Get unread notifications count
  async getUnreadCount(): Promise<number> {
    return this.notifications.filter(n => !n.read).length;
  }
  
  // Clear all notifications
  async clearAllNotifications(): Promise<void> {
    this.notifications = [];
  }
  
  // Request permission for push notifications (in a real app)
  async requestPermission(): Promise<boolean> {
    // This would use platform-specific APIs to request notification permissions
    console.log('Requested notification permission');
    return true;
  }
  
  // Create a reminder for a task
  async createTaskReminder(
    taskId: string,
    taskTitle: string,
    scheduledTime: Date,
    reminderMinutesBefore = 15
  ): Promise<string> {
    const reminderTime = new Date(scheduledTime.getTime() - reminderMinutesBefore * 60 * 1000);
    
    return this.scheduleNotification(
      'Task Reminder',
      `Reminder: ${taskTitle} starting soon`,
      reminderTime,
      'reminder',
      { taskId }
    );
  }
  
  // Create a notification for a habit that needs to be done
  async createHabitReminder(
    habitId: string, 
    habitName: string,
    time: Date
  ): Promise<string> {
    return this.scheduleNotification(
      'Habit Reminder',
      `Time to ${habitName}`,
      time,
      'reminder',
      { habitId, type: 'habit' }
    );
  }
}

// Export a singleton instance
export const notificationService = new NotificationService();
