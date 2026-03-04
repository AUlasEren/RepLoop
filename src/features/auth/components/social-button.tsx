import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors } from '../constants';

type SocialButtonProps = TouchableOpacityProps & {
  provider: 'google' | 'apple';
};

const ICON_MAP = {
  google: 'logo-google' as const,
  apple: 'logo-apple' as const,
};

export function SocialButton({ provider, style, ...props }: SocialButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      activeOpacity={0.7}
      {...props}
    >
      <Ionicons
        name={ICON_MAP[provider]}
        size={24}
        color={AuthColors.white}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AuthColors.socialButtonBg,
    borderWidth: 1,
    borderColor: AuthColors.socialButtonBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
