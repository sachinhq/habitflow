import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  notifications: [
    {
      id: '1',
      title: 'Daily Habit Reminder',
      message: 'Time to drink water and take your morning walk!',
      time: '1 hour ago',
      read: false,
      type: 'reminder',
    },
    {
      id: '2',
      title: 'Streak Milestone 🔥',
      message: "You've reached a 13-day streak on Morning Walk!",
      time: 'Yesterday',
      read: false,
      type: 'achievement',
    },
    {
      id: '3',
      title: 'Weekly Summary Ready',
      message: 'You achieved an 87% completion rate this week. Keep crushing it!',
      time: '3 days ago',
      read: true,
      type: 'report',
    },
  ],

  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [
        {
          id: Date.now().toString(),
          time: 'Just now',
          read: false,
          ...notification,
        },
        ...state.notifications,
      ],
    }));

    // Trigger browser notification if supported and permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
      });
    }
  },

  requestBrowserPermission: async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  },
}));
