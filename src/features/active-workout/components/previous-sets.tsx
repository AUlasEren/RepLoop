import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';
import type { PreviousSet } from '../constants';

type PreviousSetsProps = {
  sets: PreviousSet[];
};

export function PreviousSets({ sets }: PreviousSetsProps) {
  if (sets.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ÖNCEKİ SETLER</Text>
      <View style={styles.list}>
        {sets.map((s) => (
          <View key={s.setNumber} style={styles.row}>
            <View style={styles.numberCircle}>
              <Text style={styles.numberText}>{s.setNumber}</Text>
            </View>
            <Text style={styles.detail}>{s.weight} kg</Text>
            <Text style={styles.detail}>{s.reps} Tekrar</Text>
            <View style={styles.spacer} />
            {s.completed && (
              <Ionicons name="checkmark-circle" size={22} color={AuthColors.primary} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: AuthSpacing.sm,
  },
  title: {
    color: AuthColors.whiteSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  list: {
    gap: AuthSpacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    paddingVertical: 12,
    paddingHorizontal: AuthSpacing.md,
    gap: AuthSpacing.md,
  },
  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,230,118,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: AuthColors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  detail: {
    color: AuthColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
});
