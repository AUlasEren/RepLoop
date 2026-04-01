import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AuthTextInput, AuthButton } from '../components';
import { AuthColors, AuthSpacing } from '../constants';
import { getApiErrorMessage, isApiError } from '@/store/auth-context';
import { authService } from '@/services';

export function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      Alert.alert('Hata', 'Lütfen e-posta adresini gir.');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword({ email: trimmed });
    } catch (e) {
      if (isApiError(e) && e.errorCode === 'AUTH-1010') {
        Alert.alert('Lütfen Bekle', 'Lütfen 2 dakika bekleyip tekrar deneyin.');
        setLoading(false);
        return;
      }
      // Silent for security — same flow regardless
    } finally {
      setLoading(false);
    }

    Alert.alert(
      'Kod Gönderildi',
      'Eğer bu e-posta ile bir hesap varsa, doğrulama kodu gönderildi.',
      [{ text: 'Tamam', onPress: () => router.push({ pathname: '/(auth)/reset-password', params: { email: trimmed } }) }],
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1a2e1a', '#12211a', '#0d1a12', '#0A0A0A', '#0A0A0A']}
        locations={[0, 0.15, 0.3, 0.5, 1]}
        style={styles.background}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: insets.top, paddingBottom: insets.bottom + AuthSpacing.lg },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                hitSlop={12}
              >
                <Ionicons name="arrow-back" size={24} color={AuthColors.white} />
              </TouchableOpacity>
              <Text style={styles.brandName}>REPLOOP</Text>
              <View style={styles.backButton} />
            </View>

            <View style={styles.content}>
              <View style={styles.titleSection}>
                <Ionicons name="lock-open-outline" size={48} color={AuthColors.primary} />
                <Text style={styles.title}>Şifremi Unuttum</Text>
                <Text style={styles.subtitle}>
                  E-posta adresini gir, sana 6 haneli doğrulama kodu gönderelim.
                </Text>
              </View>

              <View style={styles.form}>
                <AuthTextInput
                  placeholder="E-posta"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>

              {loading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={AuthColors.primary} />
                </View>
              ) : (
                <AuthButton title="Kod Gönder" onPress={handleSend} />
              )}

              <TouchableOpacity
                style={styles.backToLogin}
                onPress={() => router.back()}
                hitSlop={8}
              >
                <Text style={styles.backToLoginText}>Giriş ekranına dön</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  flex: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: AuthSpacing.lg,
    paddingTop: AuthSpacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: AuthColors.primary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: AuthSpacing.lg,
    gap: AuthSpacing.lg,
    paddingBottom: AuthSpacing.md,
  },
  titleSection: {
    gap: AuthSpacing.sm,
    alignItems: 'center',
  },
  title: {
    color: AuthColors.white,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    textAlign: 'center',
  },
  subtitle: {
    color: AuthColors.whiteSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  form: {
    gap: AuthSpacing.md,
  },
  loaderContainer: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToLogin: {
    alignSelf: 'center',
  },
  backToLoginText: {
    color: AuthColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
