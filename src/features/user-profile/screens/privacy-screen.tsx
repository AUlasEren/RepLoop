import React from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { useAuth } from '@/store/auth-context';
import { useUser } from '@/store/user-context';
import { useSettings, type PrivacyPreferences } from '@/store/settings-context';
import { userService } from '@/services';

type PrivacyOption = { id: keyof PrivacyPreferences; label: string; description: string };

const PRIVACY_OPTIONS: PrivacyOption[] = [
  { id: 'public', label: 'Profili Herkese Açık Yap', description: 'Antrenman geçmişin başkaları tarafından görülebilir' },
  { id: 'analytics', label: 'Analitik Verileri Paylaş', description: 'Anonim kullanım verileri ile uygulamayı geliştir' },
  { id: 'biometric', label: 'Biyometrik Kilit', description: 'Uygulamayı parmak izi veya Face ID ile koru' },
];

export function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout } = useAuth();
  const { resetUser } = useUser();
  const { settings, updatePrivacy, resetSettings } = useSettings();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + AuthSpacing.sm }]}>
        <View style={styles.headerBtn} />
        <Text style={styles.headerTitle}>Gizlilik & Güvenlik</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={24} color={AuthColors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {PRIVACY_OPTIONS.map((opt, i) => (
            <React.Fragment key={opt.id}>
              {i > 0 && <View style={styles.sep} />}
              <View style={styles.row}>
                <View style={styles.textCol}>
                  <Text style={styles.label}>{opt.label}</Text>
                  <Text style={styles.desc}>{opt.description}</Text>
                </View>
                <Switch
                  value={settings.privacy[opt.id]}
                  onValueChange={(v) => updatePrivacy({ [opt.id]: v })}
                  trackColor={{ false: 'rgba(255,255,255,0.15)', true: 'rgba(0,230,118,0.4)' }}
                  thumbColor={settings.privacy[opt.id] ? AuthColors.primary : '#888'}
                />
              </View>
            </React.Fragment>
          ))}
        </View>

        <TouchableOpacity
          style={styles.dangerButton}
          activeOpacity={0.7}
          onPress={() =>
            Alert.alert(
              'Hesabı Sil',
              'Hesabını silmek istediğine emin misin? Bu işlem geri alınamaz.',
              [
                { text: 'İptal', style: 'cancel' },
                {
                  text: 'Sil',
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
            )
          }
        >
          <Ionicons name="trash-outline" size={18} color="#FF5252" />
          <Text style={styles.dangerText}>Hesabımı Sil</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: AuthColors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: AuthSpacing.lg, paddingBottom: AuthSpacing.md,
  },
  headerBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: AuthColors.white, fontSize: 16, fontWeight: '600' },
  content: { paddingHorizontal: AuthSpacing.lg, gap: AuthSpacing.lg },
  card: {
    backgroundColor: AuthColors.inputBackground, borderRadius: 16, borderWidth: 1,
    borderColor: AuthColors.inputBorder, overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: AuthSpacing.md, gap: AuthSpacing.md },
  textCol: { flex: 1, gap: 2 },
  label: { color: AuthColors.white, fontSize: 15, fontWeight: '600' },
  desc: { color: AuthColors.whiteSecondary, fontSize: 12, lineHeight: 16 },
  sep: { height: 1, backgroundColor: AuthColors.inputBorder, marginLeft: AuthSpacing.md },
  dangerButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: AuthSpacing.sm,
    borderWidth: 1, borderColor: 'rgba(255,82,82,0.3)', backgroundColor: 'rgba(255,82,82,0.08)',
    borderRadius: 16, paddingVertical: 14,
  },
  dangerText: { color: '#FF5252', fontSize: 15, fontWeight: '700' },
});
