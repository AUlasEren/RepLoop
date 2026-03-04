import React from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { AuthColors, AuthSpacing } from '@/features/auth';

type ProfileFormInputProps = TextInputProps & {
  label: string;
};

export function ProfileFormInput({ label, style, ...props }: ProfileFormInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={AuthColors.inputPlaceholder}
          autoCapitalize="none"
          {...props}
        />
      </View>
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
  inputWrapper: {
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    paddingHorizontal: AuthSpacing.md,
    height: 52,
    justifyContent: 'center',
  },
  input: {
    color: AuthColors.inputText,
    fontSize: 18,
    fontWeight: '600',
  },
});
