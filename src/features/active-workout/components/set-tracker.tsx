import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';

type SetTrackerProps = {
  currentSet: number;
  targetReps: number;
  weight: number;
  reps: number;
  onWeightChange: (delta: number) => void;
  onRepsChange: (delta: number) => void;
};

function ValueStepper({
  label,
  value,
  onDecrement,
  onIncrement,
}: {
  label: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <View style={styles.stepperCol}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperRow}>
        <TouchableOpacity style={styles.stepperButton} onPress={onDecrement} activeOpacity={0.6}>
          <Ionicons name="remove" size={20} color={AuthColors.white} />
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{value}</Text>
        <TouchableOpacity style={styles.stepperButton} onPress={onIncrement} activeOpacity={0.6}>
          <Ionicons name="add" size={20} color={AuthColors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function SetTracker({
  currentSet,
  targetReps,
  weight,
  reps,
  onWeightChange,
  onRepsChange,
}: SetTrackerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.setLabel}>{currentSet}. Set</Text>
        <Text style={styles.target}>Hedef: {targetReps} Tekrar</Text>
      </View>

      <View style={styles.steppersRow}>
        <ValueStepper
          label="Kilo (kg)"
          value={weight}
          onDecrement={() => onWeightChange(-1)}
          onIncrement={() => onWeightChange(1)}
        />
        <ValueStepper
          label="Tekrar"
          value={reps}
          onDecrement={() => onRepsChange(-1)}
          onIncrement={() => onRepsChange(1)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: AuthSpacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setLabel: {
    color: AuthColors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  target: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
  },
  steppersRow: {
    flexDirection: 'row',
    gap: AuthSpacing.lg,
  },
  stepperCol: {
    flex: 1,
    gap: AuthSpacing.sm,
  },
  stepperLabel: {
    color: AuthColors.whiteSecondary,
    fontSize: 13,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AuthSpacing.md,
  },
  stepperButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AuthColors.inputBackground,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    color: AuthColors.white,
    fontSize: 28,
    fontWeight: '800',
    minWidth: 40,
    textAlign: 'center',
  },
});
