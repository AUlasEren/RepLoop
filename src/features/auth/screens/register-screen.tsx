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

import { AuthTextInput, AuthButton, SocialButton, AuthDivider } from '../components';
import { AuthColors, AuthSpacing } from '../constants';
import { useAuth, getApiErrorMessage } from '@/store/auth-context';

export function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { register } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!displayName.trim()) {
      Alert.alert('Hata', 'Ad soyad alanı boş bırakılamaz.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Hata', 'E-posta alanı boş bırakılamaz.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    setLoading(true);
    try {
      await register({
        email: email.trim(),
        password,
        displayName: displayName.trim(),
      });
      router.replace('/(auth)/profile-setup');
    } catch (e) {
      const message = getApiErrorMessage(e);
      Alert.alert('Kayıt Başarısız', message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.back();
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
              <Text style={styles.brandName}>REPLOOP</Text>
            </View>

            <View style={styles.content}>
              <View style={styles.titleSection}>
                <Text style={styles.title}>Hesap Oluştur</Text>
                <Text style={styles.subtitle}>
                  Antrenman yolculuğuna başlamak için kaydol.
                </Text>
              </View>

              <View style={styles.form}>
                <AuthTextInput
                  placeholder="Ad Soyad"
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoComplete="name"
                  autoCapitalize="words"
                />

                <AuthTextInput
                  placeholder="E-posta"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoComplete="email"
                />

                <AuthTextInput
                  placeholder="Şifre"
                  value={password}
                  onChangeText={setPassword}
                  isPassword
                  autoComplete="new-password"
                />

                <AuthTextInput
                  placeholder="Şifre Tekrar"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  isPassword
                  autoComplete="new-password"
                />
              </View>

              {loading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={AuthColors.primary} />
                </View>
              ) : (
                <AuthButton title="Kayıt Ol" onPress={handleRegister} />
              )}

              <AuthDivider text="veya şunlarla devam et" />

              <View style={styles.socialRow}>
                <SocialButton provider="google" />
                <SocialButton provider="apple" />
              </View>

              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Zaten hesabın var mı? </Text>
                <TouchableOpacity onPress={handleLogin} hitSlop={8}>
                  <Text style={styles.loginLink}>Giriş Yap</Text>
                </TouchableOpacity>
              </View>
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
    alignItems: 'center',
    paddingHorizontal: AuthSpacing.lg,
    paddingTop: AuthSpacing.md,
  },
  brandName: {
    color: AuthColors.primary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: AuthSpacing.lg,
    gap: AuthSpacing.lg,
    paddingBottom: AuthSpacing.md,
  },
  titleSection: {
    gap: AuthSpacing.xs,
  },
  title: {
    color: AuthColors.white,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
  },
  subtitle: {
    color: AuthColors.whiteSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    gap: AuthSpacing.md,
  },
  loaderContainer: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: AuthSpacing.md,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: AuthColors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
