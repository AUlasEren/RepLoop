export type WeekDay = {
  key: string;
  label: string;
  date: number;
  isToday: boolean;
};

export type DailyStats = {
  calories: number;
  durationHours: number;
  durationMinutes: number;
  setsCompleted: number;
  setsTotal: number;
};

export type Recommendation = {
  id: string;
  tags: string[];
  title: string;
  description: string;
  avatarCount: number;
};

export type UpcomingWorkoutData = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
};

export const CURRENT_MONTH = 'Ekim 2023';

export const WEEK_DAYS: WeekDay[] = [
  { key: 'mon', label: 'Pzt', date: 16, isToday: false },
  { key: 'tue', label: 'Sal', date: 17, isToday: false },
  { key: 'wed', label: 'Çar', date: 18, isToday: true },
  { key: 'thu', label: 'Per', date: 19, isToday: false },
  { key: 'fri', label: 'Cum', date: 20, isToday: false },
  { key: 'sat', label: 'Cmt', date: 21, isToday: false },
  { key: 'sun', label: 'Paz', date: 22, isToday: false },
];

export const DAILY_STATS: DailyStats = {
  calories: 840,
  durationHours: 1,
  durationMinutes: 20,
  setsCompleted: 12,
  setsTotal: 16,
};

export const RECOMMENDATION: Recommendation = {
  id: '1',
  tags: ['Hipertrofi', '45 Dk'],
  title: 'İtme Günü - Hipertrofi',
  description: 'Son bench press gelişimine dayanarak. Bugün kontrollü eksantrik hareketlere odaklan.',
  avatarCount: 1,
};

export const UPCOMING_WORKOUT: UpcomingWorkoutData = {
  id: '1',
  title: 'HIIT Kardiyo',
  subtitle: 'Yarın • 20 dk',
  icon: 'fitness-outline',
};
