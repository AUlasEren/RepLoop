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
import { registerSchema, type RegisterFormData } from '../schemas';
import { useAuth } from '@/store/auth-context';
import { parseAuthError } from '@/services';

export function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: '', email: '', password: '', confirmPassword: '' },
    mode: 'onBlur',
  });

  const onSubmit = async (data: RegisterFormData) => {
    setGeneralError(null);
    try {
      const user = await registerUser({
        email: data.email.trim(),
        password: data.password,
        displayName: data.displayName.trim(),
      });

      if (user.isProfileComplete) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/profile-setup');
      }
    } catch (e) {
      const parsed = parseAuthError(e);

      for (const [field, msg] of Object.entries(parsed.fieldErrors)) {
        if (field === 'displayName' || field === 'email' || field === 'password') {
          setError(field, { type: 'server', message: msg });
        }
      }

      if (Object.keys(parsed.fieldErrors).length === 0) {
        setGeneralError(parsed.message);
      }
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
                <Controller
                  control={control}
                  name="displayName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AuthTextInput
                      placeholder="Ad Soyad"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoComplete="name"
                      autoCapitalize="words"
                      error={errors.displayName?.message}
                    />
                  )}
                />

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
                      autoComplete="new-password"
                      error={errors.password?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AuthTextInput
                      placeholder="Şifre Tekrar"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      isPassword
                      autoComplete="new-password"
                      error={errors.confirmPassword?.message}
                    />
                  )}
                />
              </View>

              {generalError && (
                <Text style={styles.generalError}>{generalError}</Text>
              )}

              {isSubmitting ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={AuthColors.primary} />
                </View>
              ) : (
                <AuthButton title="Kayıt Ol" onPress={handleSubmit(onSubmit)} />
              )}

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
