import React, { useState, forwardRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  type TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '../constants';

type AuthTextInputProps = TextInputProps & {
  isPassword?: boolean;
  error?: string;
};

export const AuthTextInput = forwardRef<TextInput, AuthTextInputProps>(
  function AuthTextInput({ isPassword = false, error, style, ...props }, ref) {
    const [secureEntry, setSecureEntry] = useState(isPassword);
    const hasError = !!error;

    return (
      <View style={styles.wrapper}>
        <View style={[styles.container, hasError && styles.containerError]}>
          <TextInput
            ref={ref}
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
        {hasError && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    gap: AuthSpacing.xs,
  },
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
  containerError: {
    borderColor: AuthColors.error,
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
  errorText: {
    color: AuthColors.error,
    fontSize: 13,
    paddingHorizontal: AuthSpacing.lg,
  },
});
