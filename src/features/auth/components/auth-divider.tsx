import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthColors, AuthSpacing } from '../constants';

type AuthDividerProps = {
  text: string;
};

export function AuthDivider({ text }: AuthDividerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AuthSpacing.md,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: AuthColors.dividerLine,
  },
  text: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
  },
});
