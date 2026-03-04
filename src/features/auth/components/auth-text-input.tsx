import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  type TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '../constants';

type AuthTextInputProps = TextInputProps & {
  isPassword?: boolean;
};

export function AuthTextInput({
  isPassword = false,
  style,
  ...props
}: AuthTextInputProps) {
  const [secureEntry, setSecureEntry] = useState(isPassword);

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={AuthColors.inputPlaceholder}
        secureTextEntry={secureEntry}
        autoCapitalize="none"
        {...props}
      />
      {isPassword && (
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setSecureEntry((prev) => !prev)}
          hitSlop={8}
        >
          <Ionicons
            name={secureEntry ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={AuthColors.whiteSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    paddingHorizontal: AuthSpacing.lg,
    height: 56,
  },
  input: {
    flex: 1,
    color: AuthColors.inputText,
    fontSize: 16,
    height: '100%',
  },
  eyeButton: {
    marginLeft: AuthSpacing.sm,
  },
});
