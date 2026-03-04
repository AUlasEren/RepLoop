import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AuthColors, AuthSpacing } from '@/features/auth';

type SegmentedControlProps<T extends string> = {
  options: { key: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = option.key === value;
        return (
          <TouchableOpacity
            key={option.key}
            style={[styles.segment, isSelected && styles.segmentSelected]}
            activeOpacity={0.7}
            onPress={() => onChange(option.key)}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  segmentSelected: {
    backgroundColor: AuthColors.primary,
  },
  label: {
    color: AuthColors.whiteSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  labelSelected: {
    color: '#000000',
    fontWeight: '700',
  },
});
