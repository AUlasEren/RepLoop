import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { BODY_MEASUREMENTS, type BodyMeasurement } from '../constants';

function MeasurementCard({ m }: { m: BodyMeasurement }) {
  const isNegative = m.change < 0;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircle, { backgroundColor: `${m.iconColor}18` }]}>
          <Ionicons
            name={m.icon as keyof typeof Ionicons.glyphMap}
            size={18}
            color={m.iconColor}
          />
        </View>
        <View style={styles.changeBadge}>
          <Text style={[styles.changeArrow, isNegative && styles.changeNegative]}>
            {isNegative ? '↓' : '↑'}
          </Text>
          <Text style={[styles.changeText, isNegative && styles.changeNegative]}>
            {Math.abs(m.change)}%
          </Text>
        </View>
      </View>

      <Text style={styles.label}>{m.label}</Text>
      <Text style={styles.changeLabel}>{m.changeLabel}</Text>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{m.value}</Text>
        <Text style={styles.unit}>{m.unit}</Text>
      </View>
    </View>
  );
}

export function BodyMeasurements() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Vücut Ölçüleri</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {BODY_MEASUREMENTS.map((m) => (
          <MeasurementCard key={m.id} m={m} />
        ))}
      </ScrollView>
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
});
