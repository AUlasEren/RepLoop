import React from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { useAuth } from '@/store/auth-context';
import { useUser } from '@/store/user-context';
import { useSettings } from '@/store/settings-context';
import { userService } from '@/services';
import { ProfileAvatar, ProfileStats, SettingsMenu } from '../components';
import { ACCOUNT_SETTINGS, APP_SETTINGS } from '../constants';

const ROUTE_MAP: Record<string, string> = {
  edit: '/edit-profile',
  prefs: '/workout-prefs',
  notif: '/notifications',
  privacy: '/privacy',
  help: '/help',
};

export function UserProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout } = useAuth();
  const { user, resetUser } = useUser();
  const { resetSettings } = useSettings();

  const profile = {
    name: user.name,
    avatarUrl: user.avatarUrl,
    level: user.levelLabel,
    height: user.height,
    weight: user.weight,
    goal: user.goalLabel,
  };

  const handleItemPress = (id: string) => {
    const route = ROUTE_MAP[id];
    if (route) {
      router.push(route as any);
    }
  };

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Hesabından çıkış yapmak istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          await logout();
          resetUser();
          resetSettings();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Bu işlem geri alınamaz. Tüm verileriniz silinecek.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Hesabı Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await userService.deleteAccount();
            } finally {
              await logout();
              resetUser();
              resetSettings();
              router.replace('/(auth)/login');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top + AuthSpacing.sm }]}>
        <View style={styles.headerButton} />
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity
          style={styles.headerButton}
          hitSlop={12}
          onPress={() => router.push('/workout-prefs' as any)}
        >
          <Ionicons name="settings-outline" size={22} color={AuthColors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.profileSection}
          activeOpacity={0.8}
          onPress={() => router.push('/edit-profile' as any)}
        >
          <ProfileAvatar uri={profile.avatarUrl} name={profile.name} />
          <Text style={styles.name}>{profile.name}</Text>
          <View style={styles.levelBadge}>
            <View style={styles.levelDot} />
            <Text style={styles.levelText}>{profile.level}</Text>
          </View>
        </TouchableOpacity>

        <ProfileStats profile={profile} />

        <SettingsMenu title="Hesap Ayarları" items={ACCOUNT_SETTINGS} onItemPress={handleItemPress} />
        <SettingsMenu title="Uygulama" items={APP_SETTINGS} onItemPress={handleItemPress} />

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF5252" />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.7}
          onPress={handleDeleteAccount}
        >
          <Ionicons name="trash-outline" size={20} color="rgba(255,82,82,0.6)" />
          <Text style={styles.deleteText}>Hesabı Sil</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: AuthSpacing.lg,
    paddingBottom: AuthSpacing.md,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: AuthColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: AuthSpacing.lg,
    gap: AuthSpacing.lg,
  },
  profileSection: {
    alignItems: 'center',
    gap: AuthSpacing.sm,
  },
  name: {
    color: AuthColors.white,
    fontSize: 22,
    fontWeight: '800',
    marginTop: AuthSpacing.xs,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,230,118,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AuthColors.primary,
  },
  levelText: {
    color: AuthColors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: AuthSpacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,82,82,0.3)',
    backgroundColor: 'rgba(255,82,82,0.08)',
    borderRadius: 16,
    paddingVertical: 14,
  },
  logoutText: {
    color: '#FF5252',
    fontSize: 15,
    fontWeight: '700',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: AuthSpacing.sm,
    borderRadius: 16,
    paddingVertical: 14,
  },
  deleteText: {
    color: 'rgba(255,82,82,0.6)',
    fontSize: 13,
    fontWeight: '600',
  },
});
