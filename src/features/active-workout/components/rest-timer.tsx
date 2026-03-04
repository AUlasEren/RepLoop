import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AuthColors, AuthSpacing } from '@/features/auth';

const INITIAL_SECONDS = 90;

export function RestTimer() {
  const [totalSeconds, setTotalSeconds] = useState(INITIAL_SECONDS);
  const [running, setRunning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((s) => Math.max(0, s - 1));
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, totalSeconds]);

  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  const addThirty = useCallback(() => setTotalSeconds((s) => s + 30), []);
  const skip = useCallback(() => {
    setTotalSeconds(0);
    setRunning(false);
  }, []);

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
        <TouchableOpacity style={styles.chipButton} onPress={addThirty} activeOpacity={0.7}>
          <Text style={styles.chipText}>+30sn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chipButton} onPress={skip} activeOpacity={0.7}>
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
