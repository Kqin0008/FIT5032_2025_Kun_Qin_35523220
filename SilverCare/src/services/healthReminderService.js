// 健康提醒服务

export class HealthReminderService {
  constructor() {
    this.reminders = [];
    this.timer = null;
  }

  // 添加提醒
  addReminder(title, message, time, repeat = false) {
    const reminder = {
      id: Date.now(),
      title,
      message,
      time,
      repeat,
      isActive: true
    };

    this.reminders.push(reminder);
    this.sortReminders();
    this.setupTimer();

    return reminder.id;
  }

  // 移除提醒
  removeReminder(id) {
    this.reminders = this.reminders.filter(reminder => reminder.id !== id);
    this.setupTimer();
  }

  // 暂停提醒
  pauseReminder(id) {
    const reminder = this.reminders.find(reminder => reminder.id === id);
    if (reminder) {
      reminder.isActive = false;
    }
  }

  // 恢复提醒
  resumeReminder(id) {
    const reminder = this.reminders.find(reminder => reminder.id === id);
    if (reminder) {
      reminder.isActive = true;
      this.sortReminders();
      this.setupTimer();
    }
  }

  // 获取所有提醒
  getAllReminders() {
    return [...this.reminders];
  }

  // 排序提醒
  sortReminders() {
    this.reminders.sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return new Date(a.time) - new Date(b.time);
    });
  }

  // 设置定时器
  setupTimer() {
    // 清除现有定时器
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    // 找到下一个活跃的提醒
    const now = new Date();
    const nextReminder = this.reminders.find(reminder => 
      reminder.isActive && new Date(reminder.time) > now
    );

    if (nextReminder) {
      const delay = new Date(nextReminder.time) - now;
      this.timer = setTimeout(() => {
        this.triggerReminder(nextReminder);
        this.setupTimer();
      }, delay);
    }
  }

  // 触发提醒
  triggerReminder(reminder) {
    // 显示通知
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(reminder.title, {
        body: reminder.message,
        icon: '/favicon.ico'
      });
    }

    // 如果是重复提醒，设置下一次提醒
    if (reminder.repeat) {
      // 默认每天重复
      const nextTime = new Date(reminder.time);
      nextTime.setDate(nextTime.getDate() + 1);
      reminder.time = nextTime.toISOString();
      this.sortReminders();
    } else {
      // 非重复提醒，触发后变为非活跃
      reminder.isActive = false;
    }

    // 触发回调
    if (this.onReminderTriggered) {
      this.onReminderTriggered(reminder);
    }
  }

  // 请求通知权限
  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }

  // 设置提醒触发回调
  setOnReminderTriggeredCallback(callback) {
    this.onReminderTriggered = callback;
  }
}

// 创建单例实例
export const healthReminderService = new HealthReminderService();