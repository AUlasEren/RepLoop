import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';
import type { Exercise } from '../constants';

type ExerciseCardProps = {
  exercise: Exercise;
};

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: exercise.imageUrl }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.titleCol}>
            <Text style={styles.name}>{exercise.name}</Text>
            <Text style={styles.category}>{exercise.category}</Text>
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
            <Text style={styles.detailValue}>{exercise.reps.split(' ')[0]}</Text>
            <Text style={styles.detailLabel}>{exercise.reps.split(' ')[1] ?? ''}</Text>
          </View>
          <View style={styles.restChip}>
            <Ionicons name="time" size={12} color={AuthColors.primary} />
            <Text style={styles.restText}>{exercise.rest}</Text>
          </View>
          <Text style={styles.orderText}>
            {exercise.order}/{exercise.total}
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
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
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
