import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { GENDERS, type GenderType } from '../constants';

type GenderPickerProps = {
  value: GenderType | null;
  onChange: (value: GenderType) => void;
};

export function GenderPicker({ value, onChange }: GenderPickerProps) {
  const [visible, setVisible] = useState(false);
  const selectedLabel = GENDERS.find((g) => g.key === value)?.label ?? 'Seçiniz';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cinsiyet</Text>
      <TouchableOpacity
        style={styles.selector}
        activeOpacity={0.7}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.selectorText, !value && styles.placeholder]}>
          {selectedLabel}
        </Text>
        <Ionicons name="chevron-down" size={20} color={AuthColors.whiteSecondary} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Cinsiyet</Text>
            {GENDERS.map((g) => (
              <TouchableOpacity
                key={g.key}
                style={[styles.option, value === g.key && styles.optionSelected]}
                onPress={() => {
                  onChange(g.key);
                  setVisible(false);
                }}
              >
                <Text
                  style={[styles.optionText, value === g.key && styles.optionTextSelected]}
                >
                  {g.label}
                </Text>
                {value === g.key && (
                  <Ionicons name="checkmark" size={20} color={AuthColors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: AuthSpacing.sm,
  },
  label: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  selector: {
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    paddingHorizontal: AuthSpacing.md,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorText: {
    color: AuthColors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    color: AuthColors.inputPlaceholder,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: AuthSpacing.lg,
    gap: AuthSpacing.sm,
  },
  sheetTitle: {
    color: AuthColors.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: AuthSpacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: AuthSpacing.md,
    borderRadius: 12,
  },
  optionSelected: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
  },
  optionText: {
    color: AuthColors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: AuthColors.primary,
    fontWeight: '700',
  },
});
