import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors } from '@/features/auth';

type ProfileAvatarProps = {
  uri: string;
};

export function ProfileAvatar({ uri }: ProfileAvatarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.ring}>
        <Image source={{ uri }} style={styles.avatar} />
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
