import {
  getCurrentUserStats,
  saveCurrentUserStats,
} from "../firebase/firestoreService";

const getWeekStart = (isoDate: string) => {
  const date = new Date(isoDate);
  const day = date.getDay();
  const diff = (day + 6) % 7;
  date.setDate(date.getDate() - diff);
  return date.toISOString().split("T")[0];
};

export const getStats = async () => {
  const stats: any =
  await getCurrentUserStats();
  const today = new Date().toISOString().split("T")[0];


    if (stats.lastSessionDate !== today) {
      stats.todayFocusTime = 0;
    }

    if (
      stats.lastSessionDate &&
      getWeekStart(stats.lastSessionDate) !== getWeekStart(today)
    ) {
      stats.weeklyFocus = [0, 0, 0, 0, 0, 0, 0];
    }

    return {
      points: 0,
      sessionsCompleted: 0,
      totalFocusTime: 0,
      todayFocusTime: 0,
      streak: 0,
      lastSessionDate: null,
      weeklyFocus: [0, 0, 0, 0, 0, 0, 0],
      dailyHistory: {},
      ...stats,
    };
    return {
      points: 0,
      sessionsCompleted: 0,
      totalFocusTime: 0,
      todayFocusTime: 0,
      streak: 0,
      lastSessionDate: null,
      weeklyFocus: [0, 0, 0, 0, 0, 0, 0],
      dailyHistory: {},
      
    };
};

export const saveStats = async (stats: any) => {
  await saveCurrentUserStats(stats);
  
};