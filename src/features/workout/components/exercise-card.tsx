import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';
import type { WorkoutExerciseDto } from '@/services/api-types';

type ExerciseCardProps = {
  exercise: WorkoutExerciseDto;
  order: number;
  total: number;
};

export function ExerciseCard({ exercise, order, total }: ExerciseCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.orderCircle}>
        <Text style={styles.orderNumber}>{order}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.titleCol}>
            <Text style={styles.name}>{exercise.exerciseName}</Text>
            <Text style={styles.category}>Egzersiz</Text>
          </View>
          <TouchableOpacity hitSlop={8}>
            <Ionicons name="information-circle-outline" size={22} color={AuthColors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailChip}>
            <Text style={styles.detailValue}>{exercise.sets}</Text>
            <Text style={styles.detailLabel}>Set</Text>
          </View>
          <View style={styles.detailChip}>
            <Text style={styles.detailValue}>{exercise.reps}</Text>
            <Text style={styles.detailLabel}>Tekrar</Text>
          </View>
          {exercise.weightKg > 0 && (
            <View style={styles.detailChip}>
              <Text style={styles.detailValue}>{exercise.weightKg}</Text>
              <Text style={styles.detailLabel}>kg</Text>
            </View>
          )}
          <View style={styles.restChip}>
            <Ionicons name="time" size={12} color={AuthColors.primary} />
            <Text style={styles.restText}>60s</Text>
          </View>
          <Text style={styles.orderText}>
            {order}/{total}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    padding: AuthSpacing.md,
    gap: AuthSpacing.md,
    alignItems: 'center',
  },
  orderCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,230,118,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderNumber: {
    color: AuthColors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    gap: AuthSpacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleCol: {
    flex: 1,
    gap: 1,
  },
  name: {
    color: AuthColors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  category: {
    color: AuthColors.whiteSecondary,
    fontSize: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AuthSpacing.sm,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  detailValue: {
    color: AuthColors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  detailLabel: {
    color: AuthColors.whiteSecondary,
    fontSize: 11,
  },
  restChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  restText: {
    color: AuthColors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  orderText: {
    color: AuthColors.whiteSecondary,
    fontSize: 12,
    marginLeft: 'auto',
  },
});
