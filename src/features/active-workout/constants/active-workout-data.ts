export type PreviousSet = {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
};

export type ActiveExercise = {
  name: string;
  currentSet: number;
  totalSets: number;
  targetReps: string;
  defaultWeight: number;
  defaultReps: number;
};

export type ActiveWorkoutSession = {
  title: string;
  weekInfo: string;
  currentExercise: number;
  totalExercises: number;
  elapsedTime: string;
  estimatedEnd: string;
  exercise: ActiveExercise;
  previousSets: PreviousSet[];
};

export const DUMMY_SESSION: ActiveWorkoutSession = {
  title: 'Göğüs ve Arka Kol',
  weekInfo: '4. Hafta • 1. Gün',
  currentExercise: 3,
  totalExercises: 8,
  elapsedTime: '25:00',
  estimatedEnd: '10:45',
  exercise: {
    name: 'Eğimli Dumbbell Press',
    currentSet: 3,
    totalSets: 4,
    targetReps: '10-12 Tekrar',
    defaultWeight: 24,
    defaultReps: 12,
  },
  previousSets: [
    { setNumber: 1, weight: 22, reps: 12, completed: true },
    { setNumber: 2, weight: 24, reps: 10, completed: true },
  ],
};
