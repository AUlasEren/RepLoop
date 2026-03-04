import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';
import type { BodyMeasurementDto } from '@/services/api-types';

type BodyMeasurementsProps = {
  measurements: BodyMeasurementDto[];
};

type MetricConfig = {
  key: 'weightKg' | 'bodyFatPercentage';
  label: string;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
};

const METRICS: MetricConfig[] = [
  { key: 'weightKg', label: 'Vücut\nAğırlığı', unit: 'kg', icon: 'analytics-outline', iconColor: '#4FC3F7' },
  { key: 'bodyFatPercentage', label: 'Yağ\nOranı', unit: '%', icon: 'body-outline', iconColor: '#FF7043' },
];

function MeasurementCard({
  label,
  value,
  unit,
  change,
  icon,
  iconColor,
}: {
  label: string;
  value: string;
  unit: string;
  change: number | null;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}) {
  const isNegative = change !== null && change < 0;
  const hasChange = change !== null && change !== 0;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircle, { backgroundColor: `${iconColor}18` }]}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        {hasChange && (
          <View style={styles.changeBadge}>
            <Text style={[styles.changeArrow, isNegative && styles.changeNegative]}>
              {isNegative ? '↓' : '↑'}
            </Text>
            <Text style={[styles.changeText, isNegative && styles.changeNegative]}>
              {Math.abs(change!).toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.label}>{label}</Text>
      <Text style={styles.changeLabel}>son ölçüme göre</Text>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
}

export function BodyMeasurements({ measurements }: BodyMeasurementsProps) {
  const latest = measurements[0] ?? null;
  const prev = measurements[1] ?? null;

  const cards = METRICS.map((m) => {
    const currentVal = latest?.[m.key] ?? null;
    const prevVal = prev?.[m.key] ?? null;
    const change = currentVal !== null && prevVal !== null ? currentVal - prevVal : null;

    return {
      ...m,
      value: currentVal !== null ? String(currentVal) : '—',
      change,
    };
  });

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Vücut Ölçüleri</Text>
      {measurements.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="body-outline" size={32} color={AuthColors.whiteSecondary} />
          <Text style={styles.emptyText}>Henüz ölçüm kaydı yok</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {cards.map((c) => (
            <MeasurementCard
              key={c.key}
              label={c.label}
              value={c.value}
              unit={c.unit}
              change={c.change}
              icon={c.icon}
              iconColor={c.iconColor}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: AuthSpacing.md,
  },
  sectionTitle: {
    color: AuthColors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    gap: AuthSpacing.sm,
  },
  card: {
    width: 170,
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    padding: AuthSpacing.md,
    gap: AuthSpacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  changeArrow: {
    color: AuthColors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  changeText: {
    color: AuthColors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  changeNegative: {
    color: '#FF5252',
  },
  label: {
    color: AuthColors.whiteSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  changeLabel: {
    color: AuthColors.whiteSecondary,
    fontSize: 10,
    lineHeight: 14,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    marginTop: 2,
  },
  value: {
    color: AuthColors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  unit: {
    color: AuthColors.whiteSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: AuthSpacing.xl,
    gap: AuthSpacing.sm,
  },
  emptyText: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
  },
});
