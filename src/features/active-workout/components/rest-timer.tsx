import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AuthColors, AuthSpacing } from '@/features/auth';

type RestTimerProps = {
  isVisible: boolean;
  secondsLeft: number;
  onAddThirty: () => void;
  onSkip: () => void;
};

export function RestTimer({ isVisible, secondsLeft, onAddThirty, onSkip }: RestTimerProps) {
  if (!isVisible) return null;

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <View style={styles.card}>
      <Text style={styles.title}>DİNLENME SAYACI</Text>

      <View style={styles.timerRow}>
        <View style={styles.timeBox}>
          <Text style={styles.timeValue}>{minutes}</Text>
        </View>
        <Text style={styles.colon}>:</Text>
        <View style={styles.timeBox}>
          <Text style={styles.timeValue}>{seconds}</Text>
        </View>
      </View>

      <View style={styles.labelRow}>
        <Text style={styles.timeLabel}>DK</Text>
        <Text style={styles.timeLabel}>SN</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.chipButton} onPress={onAddThirty} activeOpacity={0.7}>
          <Text style={styles.chipText}>+30sn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chipButton} onPress={onSkip} activeOpacity={0.7}>
          <Text style={styles.chipText}>Atla</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    paddingVertical: AuthSpacing.lg,
    paddingHorizontal: AuthSpacing.xl,
    alignItems: 'center',
    gap: AuthSpacing.sm,
  },
  title: {
    color: AuthColors.whiteSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AuthSpacing.md,
  },
  timeBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(0,230,118,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeValue: {
    color: AuthColors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  colon: {
    color: AuthColors.whiteSecondary,
    fontSize: 28,
    fontWeight: '700',
  },
  labelRow: {
    flexDirection: 'row',
    gap: 80,
  },
  timeLabel: {
    color: AuthColors.whiteSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: AuthSpacing.sm,
    marginTop: AuthSpacing.xs,
  },
  chipButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AuthColors.primary,
  },
  chipText: {
    color: AuthColors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
