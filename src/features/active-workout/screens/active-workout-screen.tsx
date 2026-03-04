import React, { useState, useCallback } from 'react';
import {
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
import { useRouter } from 'expo-router';

import { AuthColors, AuthSpacing } from '@/features/auth';
import {
  WorkoutProgressBar,
  VideoPlaceholder,
  RestTimer,
  SetTracker,
  PreviousSets,
} from '../components';
import { DUMMY_SESSION } from '../constants';

export function ActiveWorkoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const session = DUMMY_SESSION;

  const [weight, setWeight] = useState(session.exercise.defaultWeight);
  const [reps, setReps] = useState(session.exercise.defaultReps);

  const handleWeightChange = useCallback(
    (delta: number) => setWeight((w) => Math.max(0, w + delta)),
    [],
  );
  const handleRepsChange = useCallback(
    (delta: number) => setReps((r) => Math.max(0, r + delta)),
    [],
  );

  const handleFinish = () => {
    Alert.alert('Antrenman Bitti', 'Tebrikler! Antrenmanı tamamladın.', [
      { text: 'Tamam', onPress: () => router.back() },
    ]);
  };

  const handleNextSet = () => {
    Alert.alert('Set Kaydedildi', `${weight} kg × ${reps} tekrar`);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top + AuthSpacing.sm }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={22} color={AuthColors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{session.title}</Text>
          <Text style={styles.headerSub}>{session.weekInfo}</Text>
        </View>
        <TouchableOpacity style={styles.pauseButton} activeOpacity={0.7}>
          <Text style={styles.pauseText}>Duraklat</Text>
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
        <WorkoutProgressBar session={session} />
        <VideoPlaceholder exerciseName={session.exercise.name} />
        <RestTimer />
        <SetTracker
          exercise={session.exercise}
          weight={weight}
          reps={reps}
          onWeightChange={handleWeightChange}
          onRepsChange={handleRepsChange}
        />
        <PreviousSets sets={session.previousSets} />
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + AuthSpacing.md }]}>
        <TouchableOpacity
          style={styles.finishButton}
          activeOpacity={0.7}
          onPress={handleFinish}
        >
          <Text style={styles.finishText}>Antrenmanı{'\n'}Bitir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextSetButton}
          activeOpacity={0.8}
          onPress={handleNextSet}
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
    color: AuthColors.whiteSecondary,
    fontSize: 12,
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
