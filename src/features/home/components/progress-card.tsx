import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { DAILY_STATS } from '../constants';

const RING_SIZE = 80;
const STROKE_WIDTH = 8;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressCard() {
  const progress = DAILY_STATS.setsCompleted / DAILY_STATS.setsTotal;
  const percent = Math.round(progress * 100);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.title}>Günlük İlerleme</Text>
        <Text style={styles.subtitle}>Harika gidiyorsun! İvmeni koru.</Text>
        <View style={styles.setsRow}>
          <Text style={styles.setsIcon}>↘</Text>
          <Text style={styles.setsText}>
            {DAILY_STATS.setsCompleted}/{DAILY_STATS.setsTotal} Set Tamamlandı
          </Text>
        </View>
      </View>
      <View style={styles.ringContainer}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
          />
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke={AuthColors.primary}
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
          />
        </Svg>
        <Text style={styles.percentText}>%{percent}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    padding: AuthSpacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    gap: 4,
    marginRight: AuthSpacing.md,
  },
  title: {
    color: AuthColors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  subtitle: {
    color: AuthColors.whiteSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  setsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  setsIcon: {
    color: AuthColors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  setsText: {
    color: AuthColors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    position: 'absolute',
    color: AuthColors.white,
    fontSize: 18,
    fontWeight: '800',
  },
});
