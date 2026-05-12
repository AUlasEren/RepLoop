import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AuthTextInput, AuthButton } from '../components';
import { AuthColors, AuthSpacing } from '../constants';
import { loginSchema, type LoginFormData } from '../schemas';
import { useAuth } from '@/store/auth-context';
import { parseAuthError } from '@/services';

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setGeneralError(null);
    try {
      const user = await login({ email: data.email.trim(), password: data.password });

      if (user.isProfileComplete) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/profile-setup');
      }
    } catch (e) {
      const parsed = parseAuthError(e);

      for (const [field, msg] of Object.entries(parsed.fieldErrors)) {
        if (field === 'email' || field === 'password') {
          setError(field, { type: 'server', message: msg });
        }
      }

      if (Object.keys(parsed.fieldErrors).length === 0) {
        setGeneralError(parsed.message);
      }
    }
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
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
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AuthTextInput
                      placeholder="E-posta"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoComplete="email"
                      error={errors.email?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AuthTextInput
                      placeholder="Şifre"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      isPassword
                      autoComplete="password"
                      error={errors.password?.message}
                    />
                  )}
                />

                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={handleForgotPassword}
                  hitSlop={8}
                >
                  <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
                </TouchableOpacity>
              </View>

              {generalError && (
                <Text style={styles.generalError}>{generalError}</Text>
              )}

              {isSubmitting ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={AuthColors.primary} />
                </View>
              ) : (
                <AuthButton title="Giriş Yap" onPress={handleSubmit(onSubmit)} />
              )}

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
  generalError: {
    color: AuthColors.error,
    fontSize: 14,
    textAlign: 'center',
  },
  loaderContainer: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
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
