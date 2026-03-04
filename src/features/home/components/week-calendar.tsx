import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { CURRENT_MONTH, WEEK_DAYS } from '../constants';

export function WeekCalendar() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Bu Hafta</Text>
        <TouchableOpacity style={styles.monthButton} hitSlop={8}>
          <Text style={styles.monthText}>{CURRENT_MONTH}</Text>
          <Ionicons name="calendar-outline" size={16} color={AuthColors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
          {WEEK_DAYS.map((day) => (
            <TouchableOpacity
              key={day.key}
              style={[styles.dayColumn, day.isToday && styles.dayColumnToday]}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayLabel, day.isToday && styles.dayLabelToday]}>
                {day.label}
              </Text>
              <View style={[styles.dateCircle, day.isToday && styles.dateCircleToday]}>
                <Text style={[styles.dateText, day.isToday && styles.dateTextToday]}>
                  {day.date}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: AuthSpacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: AuthColors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  monthText: {
    color: AuthColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    paddingVertical: AuthSpacing.md,
    paddingHorizontal: AuthSpacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayColumn: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  dayColumnToday: {
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
  },
  dayLabel: {
    color: AuthColors.whiteSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  dayLabelToday: {
    color: AuthColors.primary,
    fontWeight: '700',
  },
  dateCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCircleToday: {
    backgroundColor: AuthColors.primary,
  },
  dateText: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  dateTextToday: {
    color: '#000000',
    fontWeight: '800',
  },
});
