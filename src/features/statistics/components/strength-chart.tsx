import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { STRENGTH_CHART } from '../constants';

const CHART_WIDTH = 280;
const CHART_HEIGHT = 100;
const PADDING_X = 10;
const PADDING_Y = 10;

export function StrengthChart() {
  const { points, currentValue, unit, changePercent, period, title } = STRENGTH_CHART;

  const values = points.map((p) => p.value);
  const minVal = Math.min(...values) - 10;
  const maxVal = Math.max(...values) + 10;
  const range = maxVal - minVal;

  const getX = (i: number) =>
    PADDING_X + (i / (points.length - 1)) * (CHART_WIDTH - PADDING_X * 2);
  const getY = (v: number) =>
    PADDING_Y + (1 - (v - minVal) / range) * (CHART_HEIGHT - PADDING_Y * 2);

  const polylinePoints = points.map((p, i) => `${getX(i)},${getY(p.value)}`).join(' ');

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.changeBadge}>
          <Text style={styles.changeArrow}>↗</Text>
          <Text style={styles.changeText}>+{changePercent}%</Text>
        </View>
      </View>

      <Text style={styles.value}>
        {currentValue} <Text style={styles.unit}>{unit}</Text>
      </Text>
      <Text style={styles.period}>{period}</Text>

      <View style={styles.chartContainer}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          {/* grid lines */}
          {[0.25, 0.5, 0.75].map((pct) => (
            <Line
              key={pct}
              x1={PADDING_X}
              y1={PADDING_Y + pct * (CHART_HEIGHT - PADDING_Y * 2)}
              x2={CHART_WIDTH - PADDING_X}
              y2={PADDING_Y + pct * (CHART_HEIGHT - PADDING_Y * 2)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          ))}
          {/* line */}
          <Polyline
            points={polylinePoints}
            fill="none"
            stroke="#4FC3F7"
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* dots */}
          {points.map((p, i) => (
            <Circle
              key={p.label}
              cx={getX(i)}
              cy={getY(p.value)}
              r={i === points.length - 1 ? 6 : 4}
              fill={i === points.length - 1 ? '#4FC3F7' : 'rgba(79,195,247,0.5)'}
              stroke={i === points.length - 1 ? '#fff' : 'none'}
              strokeWidth={i === points.length - 1 ? 2 : 0}
            />
          ))}
        </Svg>

        <View style={styles.labelsRow}>
          {points.map((p) => (
            <Text key={p.label} style={styles.labelText}>{p.label}</Text>
          ))}
        </View>
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
    gap: AuthSpacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: AuthColors.whiteSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79,195,247,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
  },
  changeArrow: {
    color: '#4FC3F7',
    fontSize: 12,
    fontWeight: '700',
  },
  changeText: {
    color: '#4FC3F7',
    fontSize: 12,
    fontWeight: '700',
  },
  value: {
    color: AuthColors.white,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
  },
  unit: {
    fontSize: 18,
    fontWeight: '500',
    color: AuthColors.whiteSecondary,
  },
  period: {
    color: AuthColors.whiteSecondary,
    fontSize: 12,
  },
  chartContainer: {
    marginTop: AuthSpacing.sm,
    alignItems: 'center',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CHART_WIDTH,
    paddingHorizontal: PADDING_X,
    marginTop: AuthSpacing.xs,
  },
  labelText: {
    color: AuthColors.whiteSecondary,
    fontSize: 10,
    fontWeight: '500',
  },
});
