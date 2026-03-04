import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { DAILY_STATS } from '../constants';

function StatCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.labelRow}>
        <Ionicons name={icon} size={14} color={AuthColors.primary} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
}

export function StatsRow() {
  return (
    <View style={styles.container}>
      <StatCard
        icon="flame-outline"
        label="KALORİ"
        value={String(DAILY_STATS.calories)}
        unit="kcal"
      />
      <StatCard
        icon="time-outline"
        label="ANTRENMAN SÜRESİ"
        value={`${DAILY_STATS.durationHours}sa ${DAILY_STATS.durationMinutes}dk`}
        unit=""
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: AuthSpacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    padding: AuthSpacing.md,
    gap: AuthSpacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    color: AuthColors.whiteSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    color: AuthColors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  unit: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
});
