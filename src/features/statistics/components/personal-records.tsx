import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { PERSONAL_RECORDS, type PersonalRecord } from '../constants';

function RecordCard({ record }: { record: PersonalRecord }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: `${record.iconColor}18` }]}>
        <Ionicons
          name={record.icon as keyof typeof Ionicons.glyphMap}
          size={18}
          color={record.iconColor}
        />
      </View>
      <Text style={styles.exercise}>{record.exercise}</Text>
      <Text style={styles.weight}>
        <Text style={styles.weightValue}>{record.weight}</Text>
        {' '}
        <Text style={styles.weightUnit}>kg</Text>
      </Text>
      <Text style={styles.date}>{record.date}</Text>
    </View>
  );
}

export function PersonalRecords() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Kişisel Rekorlar</Text>
        <TouchableOpacity hitSlop={8}>
          <Text style={styles.seeAll}>Tümünü Gör</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        {PERSONAL_RECORDS.map((record) => (
          <RecordCard key={record.id} record={record} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: AuthSpacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: AuthColors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  seeAll: {
    color: '#4FC3F7',
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AuthSpacing.sm,
  },
  card: {
    width: '48.5%',
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    padding: AuthSpacing.md,
    gap: AuthSpacing.xs,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exercise: {
    color: AuthColors.white,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  weight: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  weightValue: {
    color: AuthColors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  weightUnit: {
    color: AuthColors.whiteSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  date: {
    color: AuthColors.whiteSecondary,
    fontSize: 12,
  },
});
