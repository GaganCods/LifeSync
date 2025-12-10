export type MoodRating = 1 | 2 | 3 | 4 | 5;

export interface DailyLog {
  date: string; // ISO YYYY-MM-DD
  habits: Record<string, boolean>;
  mood: MoodRating;
  energy: MoodRating;

  // Sleep & Routine
  bedTime: string; // HH:mm
  wakeTime: string; // HH:mm
  sleepQuality: MoodRating;

  // Focus vs Distraction
  instagramMinutes: number;
  studyMinutes: number;
  studySessions: number;

  // Goals & Reflection
  dailyGoal: string;
  dailyGoalCompleted: boolean;
  reflection: string;
  
  // AI Insights
  aiMentorInsight?: string;
  
  // Basic Health
  waterIntake: number;
}

export interface AppData {
  logs: Record<string, DailyLog>;
  userGoals: {
    studyGoalMinutes: number;
    instagramLimitMinutes: number;
  };
}

export enum View {
  TRACKER = 'TRACKER',
  ANALYTICS = 'ANALYTICS',
  MENTOR = 'MENTOR'
}

export const DEFAULT_HABITS = [
  { id: 'exercise', label: 'Exercise', icon: 'activity' },
  { id: 'noPhoneMorning', label: 'No Morning Phone', icon: 'smartphone' },
  { id: 'deepWork', label: 'Deep Work Session', icon: 'focus' },
  { id: 'read', label: 'Reading', icon: 'book' },
  { id: 'meditate', label: 'Meditation', icon: 'sun' },
  { id: 'planTomorrow', label: 'Plan Tomorrow', icon: 'list' }
];