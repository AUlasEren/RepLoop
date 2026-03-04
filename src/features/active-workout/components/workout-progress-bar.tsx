import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthColors, AuthSpacing } from '@/features/auth';

type WorkoutProgressBarProps = {
  currentExercise: number;
  totalExercises: number;
  elapsedTime: string;
};

export function WorkoutProgressBar({
  currentExercise,
  totalExercises,
  elapsedTime,
}: WorkoutProgressBarProps) {
  const progress = totalExercises > 0 ? currentExercise / totalExercises : 0;
  const percent = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.label}>
          Egzersiz {currentExercise} / {totalExercises}
        </Text>
        <Text style={styles.percent}>{percent}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.meta}>
          Geçen Süre: <Text style={styles.metaBold}>{elapsedTime}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: AuthSpacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: AuthColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  percent: {
    color: AuthColors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: AuthColors.primary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    color: AuthColors.whiteSecondary,
    fontSize: 12,
  },
  metaBold: {
    color: AuthColors.white,
    fontWeight: '700',
  },
});
