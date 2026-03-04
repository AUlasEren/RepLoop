import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';

type VideoPlaceholderProps = {
  exerciseName: string;
};

export function VideoPlaceholder({ exerciseName }: VideoPlaceholderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.titleRow}>
        <Text style={styles.exerciseName}>{exerciseName}</Text>
        <TouchableOpacity hitSlop={8}>
          <Ionicons name="information-circle-outline" size={22} color={AuthColors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.videoBox}>
        <TouchableOpacity style={styles.playCircle} activeOpacity={0.7}>
          <Ionicons name="play" size={32} color={AuthColors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: AuthSpacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    color: AuthColors.white,
    fontSize: 22,
    fontWeight: '800',
    flex: 1,
  },
  videoBox: {
    height: 160,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
});
