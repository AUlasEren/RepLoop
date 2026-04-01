import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { useUser } from '@/store/user-context';

export function UserHeader() {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.avatarRing}>
          {user.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitial}>
                {(user.name || '?').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View>
          <Text style={styles.greeting}>Tekrar hoş geldin,</Text>
          <Text style={styles.name}>{user.name}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AuthSpacing.md,
  },
  avatarRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: AuthColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarFallback: {
    backgroundColor: 'rgba(0,230,118,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: AuthColors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  greeting: {
    color: AuthColors.whiteSecondary,
    fontSize: 13,
  },
  name: {
    color: AuthColors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});
