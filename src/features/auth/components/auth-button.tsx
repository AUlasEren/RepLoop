import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';

import { AuthColors } from '../constants';

type AuthButtonProps = TouchableOpacityProps & {
  title: string;
};

export function AuthButton({ title, style, ...props }: AuthButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      activeOpacity={0.8}
      {...props}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: AuthColors.primary,
    borderRadius: 28,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
});
