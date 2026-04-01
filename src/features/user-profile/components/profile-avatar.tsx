import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors } from '@/features/auth';

type ProfileAvatarProps = {
  uri: string;
  name?: string;
};

export function ProfileAvatar({ uri, name }: ProfileAvatarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.ring}>
        {uri ? (
          <Image source={{ uri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.fallback]}>
            <Text style={styles.initial}>
              {(name || '?').charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.editBadge}>
        <Ionicons name="pencil" size={13} color={AuthColors.white} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    width: 110,
    height: 110,
  },
  ring: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: AuthColors.primary,
    padding: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 52,
  },
  fallback: {
    backgroundColor: 'rgba(0,230,118,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: AuthColors.primary,
    fontSize: 36,
    fontWeight: '800',
  },
  editBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AuthColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: AuthColors.background,
  },
});
