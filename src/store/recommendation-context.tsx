import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import type { RecommendationItem, WorkoutDto, WorkoutExerciseDto } from '@/services/api-types';

type RecommendationContextType = {
  selectedRecommendation: RecommendationItem | null;
  setSelectedRecommendation: (item: RecommendationItem | null) => void;
  clearSelectedRecommendation: () => void;
  prepareForActiveWorkout: (item: RecommendationItem) => void;
  consumeForActiveWorkout: (workoutId: string) => RecommendationItem | null;
  toWorkoutDto: (item: RecommendationItem) => WorkoutDto;
};

const RecommendationContext = createContext<RecommendationContextType | null>(null);

function toWorkoutDto(item: RecommendationItem): WorkoutDto {
  const exercises: WorkoutExerciseDto[] =
    item.exercises?.map((e, i) => ({
      id: `${item.workout_id}-ex-${i}`,
      exerciseId: e.exercise_id,
      exerciseName: (e.exercise_name?.trim() || `Egzersiz ${i + 1}`),
      sets: e.sets,
      reps: e.reps,
      weightKg: e.weight_kg,
      durationSeconds: e.duration_seconds ?? 0,
      notes: null,
    })) ?? [];

  return {
    id: item.workout_id,
    name: item.workout_name,
    description: item.description || null,
    notes: null,
    scheduledDate: null,
    durationMinutes: item.duration_minutes,
    createdAt: new Date().toISOString(),
    exercises,
  };
}

export function RecommendationProvider({ children }: { children: ReactNode }) {
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<RecommendationItem | null>(null);
  const forActiveRef = useRef<RecommendationItem | null>(null);

  const clearSelectedRecommendation = useCallback(() => {
    setSelectedRecommendation(null);
    forActiveRef.current = null;
  }, []);

  const prepareForActiveWorkout = useCallback((item: RecommendationItem) => {
    forActiveRef.current = item;
  }, []);

  const consumeForActiveWorkout = useCallback((workoutId: string): RecommendationItem | null => {
    const item = forActiveRef.current;
    // Don't null the ref here — clearSelectedRecommendation handles cleanup.
    // Nulling here breaks React strict-mode double-mount.
    return item?.workout_id === workoutId ? item : null;
  }, []);

  const toWorkoutDtoCb = useCallback(toWorkoutDto, []);

  return (
    <RecommendationContext.Provider
      value={{
        selectedRecommendation,
        setSelectedRecommendation,
        clearSelectedRecommendation,
        prepareForActiveWorkout,
        consumeForActiveWorkout,
        toWorkoutDto: toWorkoutDtoCb,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
}

export function useRecommendation() {
  const ctx = useContext(RecommendationContext);
  if (!ctx) throw new Error('useRecommendation must be used within RecommendationProvider');
  return ctx;
}
