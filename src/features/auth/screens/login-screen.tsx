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
import { authService } from '@/services';

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Hata', 'E-posta ve şifre alanları boş bırakılamaz.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login({ email: email.trim(), password });
      setUser(result.user);

      if (result.user.isProfileComplete) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/profile-setup');
      }
    } catch (e) {
      const message = getApiErrorMessage(e);
      Alert.alert('Giriş Başarısız', message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('E-posta Gerekli', 'Şifre sıfırlama için e-posta adresini gir.');
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword({ email: email.trim() });
    } catch {
      // Intentionally silent — same message regardless of result for security
    } finally {
      setLoading(false);
      Alert.alert('Gönderildi', 'Eğer bu e-posta ile bir hesap varsa, şifre sıfırlama bağlantısı gönderildi.');
    }
  };

  const handleSignUp = () => {
    router.push('/(auth)/register');
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
                <Text style={styles.title}>Tekrar Hoşgeldin</Text>
                <Text style={styles.subtitle}>
                  Hedeflerine ulaşmak için giriş yap.
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

                <AuthTextInput
                  placeholder="Şifre"
                  value={password}
                  onChangeText={setPassword}
                  isPassword
                  autoComplete="password"
                />

                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={handleForgotPassword}
                  hitSlop={8}
                >
                  <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={AuthColors.primary} />
                </View>
              ) : (
                <AuthButton title="Giriş Yap" onPress={handleLogin} />
              )}

              <AuthDivider text="veya şunlarla devam et" />

              <View style={styles.socialRow}>
                <SocialButton
                  provider="google"
                  onPress={() => Alert.alert('Yakında', 'Google ile giriş yakında aktif olacak.')}
                />
                <SocialButton
                  provider="apple"
                  onPress={() => Alert.alert('Yakında', 'Apple ile giriş yakında aktif olacak.')}
                />
              </View>

              <View style={styles.signUpRow}>
                <Text style={styles.signUpText}>Hesabın yok mu? </Text>
                <TouchableOpacity onPress={handleSignUp} hitSlop={8}>
                  <Text style={styles.signUpLink}>Yeni Hesap Oluştur</Text>
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
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: AuthColors.primary,
    fontSize: 14,
    fontWeight: '600',
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
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
  },
  signUpLink: {
    color: AuthColors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
