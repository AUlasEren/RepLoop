import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';
import type { PersonalRecordDto } from '@/services/api-types';

const ICON_COLORS = ['#FFD700', '#4FC3F7', '#FF7043', '#81C784'];

type PersonalRecordsProps = {
  records: PersonalRecordDto[];
};

function RecordCard({ record, index }: { record: PersonalRecordDto; index: number }) {
  const iconName = index === 0 ? 'trophy' : 'trending-up';
  const iconColor = ICON_COLORS[index % ICON_COLORS.length];
  const dateStr = new Date(record.achievedAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: `${iconColor}18` }]}>
        <Ionicons name={iconName} size={18} color={iconColor} />
      </View>
      <Text style={styles.exercise}>{record.exerciseName}</Text>
      <Text style={styles.weight}>
        <Text style={styles.weightValue}>{record.maxWeightKg}</Text>
        {' '}
        <Text style={styles.weightUnit}>kg</Text>
      </Text>
      <Text style={styles.date}>{dateStr}</Text>
    </View>
  );
}

export function PersonalRecords({ records }: PersonalRecordsProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Kişisel Rekorlar</Text>
        <TouchableOpacity hitSlop={8}>
          <Text style={styles.seeAll}>Tümünü Gör</Text>
        </TouchableOpacity>
      </View>
      {records.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="trophy-outline" size={32} color={AuthColors.whiteSecondary} />
          <Text style={styles.emptyText}>Henüz kişisel rekor yok</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {records.map((record, i) => (
            <RecordCard key={record.exerciseId} record={record} index={i} />
          ))}
        </View>
      )}
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
