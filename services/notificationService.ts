import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions =
  async () => {
    const { status } =
      await Notifications.requestPermissionsAsync();

    return status === "granted";
  };

export const scheduleDailyReminder =
  async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚒️ FocusForge Reminder",
        body: "Have you forged today?",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
      },
    });
  };