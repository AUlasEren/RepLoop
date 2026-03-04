import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { workoutService, sessionService, statisticsService } from '@/services';
import type { WorkoutDto, LogSetRequest } from '@/services/api-types';
import {
  WorkoutProgressBar,
  VideoPlaceholder,
  RestTimer,
  SetTracker,
  PreviousSets,
} from '../components';

type CompletedSetLog = {
  exerciseId: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
  performedAt: string;
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function ActiveWorkoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { workoutId, workoutName } = useLocalSearchParams<{
    workoutId: string;
    workoutName: string;
  }>();

  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [workout, setWorkout] = useState<WorkoutDto | null>(null);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);

  const [isCompleting, setIsCompleting] = useState(false);
  const [completedSets, setCompletedSets] = useState<CompletedSetLog[]>([]);

  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  useEffect(() => {
    if (!workoutId) {
      Alert.alert('Hata', 'Antrenman bilgisi bulunamadı.', [
        { text: 'Tamam', onPress: () => router.back() },
      ]);
      return;
    }

    (async () => {
      try {
        const [w, session] = await Promise.all([
          workoutService.getById(workoutId),
          sessionService.start({ workoutId, workoutName: workoutName ?? '' }),
        ]);

        if (!mountedRef.current) return;

        await SecureStore.setItemAsync('activeSessionId', session.id);
        await SecureStore.setItemAsync('activeWorkoutId', workoutId);

        setWorkout(w);
        setSessionId(session.id);

        if (w.exercises.length > 0) {
          setWeight(w.exercises[0].weightKg || 0);
          setReps(w.exercises[0].reps || 0);
        }
      } catch (e) {
        console.error('ActiveWorkout init error:', e);
        if (mountedRef.current) {
          Alert.alert('Hata', 'Antrenman başlatılamadı.', [
            { text: 'Tamam', onPress: () => router.back() },
          ]);
        }
      } finally {
        if (mountedRef.current) setIsInitializing(false);
      }
    })();
  }, [workoutId, workoutName, router]);

  // Main timer
  useEffect(() => {
    if (isPaused || isInitializing) return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isInitializing]);

  // Rest timer
  useEffect(() => {
    if (!isResting) return;
    if (restSecondsLeft <= 0) {
      setIsResting(false);
      return;
    }
    const timer = setTimeout(() => setRestSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [isResting, restSecondsLeft]);

  const handleWeightChange = useCallback(
    (delta: number) => setWeight((w) => Math.max(0, w + delta)),
    [],
  );
  const handleRepsChange = useCallback(
    (delta: number) => setReps((r) => Math.max(0, r + delta)),
    [],
  );

  const handlePause = async () => {
    if (!sessionId) return;
    try {
      await sessionService.updateStatus(sessionId, { action: 'Pause' });
    } catch { /* silent */ }
    setIsPaused(true);
  };

  const handleResume = async () => {
    if (!sessionId) return;
    try {
      await sessionService.updateStatus(sessionId, { action: 'Resume' });
    } catch { /* silent */ }
    setIsPaused(false);
  };

  const handleFinish = async () => {
    if (!sessionId) return;
    setIsCompleting(true);
    try {
      await sessionService.complete(sessionId, {});

      await Promise.all(
        completedSets.map((set) =>
          statisticsService.logExercise({
            exerciseId: set.exerciseId,
            exerciseName: set.exerciseName,
            weightKg: set.weightKg,
            reps: set.reps,
            performedAt: set.performedAt,
          }),
        ),
      ).catch(() => {});

      await SecureStore.deleteItemAsync('activeSessionId');
      await SecureStore.deleteItemAsync('activeWorkoutId');

      if (mountedRef.current) router.back();
    } catch {
      if (mountedRef.current) {
        Alert.alert('Hata', 'Antrenman kaydedilemedi, tekrar dene.');
      }
    } finally {
      if (mountedRef.current) setIsCompleting(false);
    }
  };

  const handleNextSet = async () => {
    if (!workout || !sessionId) return;
    const currentExercise = workout.exercises[currentExerciseIndex];
    const setNumber = currentSetIndex + 1;

    sessionService
      .logSet(sessionId, {
        exerciseId: currentExercise.exerciseId,
        exerciseName: currentExercise.exerciseName,
        setNumber,
        reps,
        weightKg: weight,
        durationSeconds: 0,
      } satisfies LogSetRequest)
      .catch(() => {});

    setCompletedSets((prev) => [
      ...prev,
      {
        exerciseId: currentExercise.exerciseId,
        exerciseName: currentExercise.exerciseName,
        weightKg: weight,
        reps,
        performedAt: new Date().toISOString(),
      },
    ]);

    const totalSets = currentExercise.sets;
    if (currentSetIndex + 1 < totalSets) {
      setCurrentSetIndex((s) => s + 1);
      setIsResting(true);
      setRestSecondsLeft(60);
    } else if (currentExerciseIndex + 1 < workout.exercises.length) {
      const nextExercise = workout.exercises[currentExerciseIndex + 1];
      setCurrentExerciseIndex((i) => i + 1);
      setCurrentSetIndex(0);
      setWeight(nextExercise.weightKg || 0);
      setReps(nextExercise.reps || 0);
      setIsResting(true);
      setRestSecondsLeft(90);
    } else {
      Alert.alert('Antrenman Tamamlandı!', 'Tebrikler! Tüm egzersizleri bitirdin.', [
        { text: 'Bitir', onPress: handleFinish },
      ]);
    }
  };

  const handleRestSkip = useCallback(() => {
    setRestSecondsLeft(0);
    setIsResting(false);
  }, []);

  const handleRestAddThirty = useCallback(() => {
    setRestSecondsLeft((s) => s + 30);
  }, []);

  if (isInitializing) {
    return (
      <View style={[styles.root, styles.loader]}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={AuthColors.primary} />
        <Text style={styles.loadingText}>Antrenman başlatılıyor...</Text>
      </View>
    );
  }

  if (!workout || !sessionId) {
    return (
      <View style={[styles.root, styles.loader]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.loadingText}>Antrenman yüklenemedi.</Text>
      </View>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const currentExerciseSets = completedSets
    .filter((s) => s.exerciseId === currentExercise?.exerciseId)
    .map((s, i) => ({ setNumber: i + 1, weight: s.weightKg, reps: s.reps }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top + AuthSpacing.sm }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() =>
            Alert.alert('Çıkmak istiyor musun?', 'Antrenman kaydedilmeden kapanacak.', [
              { text: 'İptal', style: 'cancel' },
              { text: 'Çık', style: 'destructive', onPress: () => router.back() },
            ])
          }
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={22} color={AuthColors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{workoutName ?? workout.name}</Text>
          <Text style={styles.headerSub}>{formatTime(elapsedSeconds)}</Text>
        </View>
        <TouchableOpacity
          style={styles.pauseButton}
          activeOpacity={0.7}
          onPress={isPaused ? handleResume : handlePause}
        >
          <Text style={styles.pauseText}>{isPaused ? 'Devam Et' : 'Duraklat'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <WorkoutProgressBar
          currentExercise={currentExerciseIndex + 1}
          totalExercises={workout.exercises.length}
          elapsedTime={formatTime(elapsedSeconds)}
        />
        {currentExercise && (
          <>
            <VideoPlaceholder exerciseName={currentExercise.exerciseName} />
            <RestTimer
              isVisible={isResting}
              secondsLeft={restSecondsLeft}
              onAddThirty={handleRestAddThirty}
              onSkip={handleRestSkip}
            />
            <SetTracker
              currentSet={currentSetIndex + 1}
              targetReps={currentExercise.reps}
              weight={weight}
              reps={reps}
              onWeightChange={handleWeightChange}
              onRepsChange={handleRepsChange}
            />
            <PreviousSets sets={currentExerciseSets} />
          </>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + AuthSpacing.md }]}>
        <TouchableOpacity
          style={styles.finishButton}
          activeOpacity={0.7}
          onPress={() =>
            Alert.alert('Antrenmanı bitir?', 'Mevcut ilerleme kaydedilecek.', [
              { text: 'İptal', style: 'cancel' },
              { text: 'Bitir', onPress: handleFinish },
            ])
          }
          disabled={isCompleting}
        >
          {isCompleting ? (
            <ActivityIndicator size="small" color={AuthColors.white} />
          ) : (
            <Text style={styles.finishText}>Antrenmanı{'\n'}Bitir</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextSetButton}
          activeOpacity={0.8}
          onPress={handleNextSet}
          disabled={isCompleting}
        >
          <Text style={styles.nextSetText}>Sonraki Set</Text>
          <Ionicons name="arrow-forward" size={18} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: AuthSpacing.md,
  },
  loadingText: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AuthSpacing.lg,
    paddingBottom: AuthSpacing.md,
    gap: AuthSpacing.sm,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    gap: 1,
  },
  headerTitle: {
    color: AuthColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  headerSub: {
    color: AuthColors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  pauseButton: {
    borderWidth: 1,
    borderColor: AuthColors.primary,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  pauseText: {
    color: AuthColors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: AuthSpacing.lg,
    gap: AuthSpacing.lg,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: AuthSpacing.lg,
    paddingTop: AuthSpacing.md,
    gap: AuthSpacing.sm,
    backgroundColor: AuthColors.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  finishButton: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    backgroundColor: AuthColors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  finishText: {
    color: AuthColors.white,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
  },
  nextSetButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: AuthColors.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: AuthSpacing.sm,
  },
  nextSetText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
