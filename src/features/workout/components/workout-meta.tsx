import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';
import type { WorkoutDetail } from '../constants';

type MetaItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

function MetaItem({ icon, label, value }: MetaItemProps) {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Ionicons name={icon} size={14} color={AuthColors.primary} />
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

type WorkoutMetaProps = {
  workout: WorkoutDetail;
};

export function WorkoutMeta({ workout }: WorkoutMetaProps) {
  return (
    <View style={styles.container}>
      <MetaItem icon="flash" label="Zorluk" value={workout.difficulty} />
      <View style={styles.divider} />
      <MetaItem icon="swap-vertical" label="Egzersizler" value={`${workout.exerciseCount}\nHareket`} />
      <View style={styles.divider} />
      <MetaItem icon="flame" label="Tahmini Kalori" value={String(workout.estimatedCalories)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    paddingVertical: AuthSpacing.md,
    paddingHorizontal: AuthSpacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    color: AuthColors.whiteSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    color: AuthColors.white,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: AuthColors.inputBorder,
  },
});
