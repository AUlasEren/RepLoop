import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { settingsService } from '@/services';
import type {
  SettingsDto,
  WorkoutSettings,
  NotificationSettings,
  PrivacySettings,
} from '@/services/api-types';

// ─── Local UI types (used by screens) ───────────────────────────────────────

export type WorkoutPreferences = {
  warmup: boolean;
  rest: boolean;
  sound: boolean;
  vibrate: boolean;
  progressive: boolean;
  supersets: boolean;
};

export type NotificationPreferences = {
  reminder: boolean;
  progress: boolean;
  records: boolean;
  tips: boolean;
  social: boolean;
  marketing: boolean;
};

export type PrivacyPreferences = {
  public: boolean;
  analytics: boolean;
  biometric: boolean;
};

export type AppSettings = {
  workout: WorkoutPreferences;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
};

// ─── Defaults ───────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings = {
  workout: {
    warmup: true, rest: true, sound: false, vibrate: true, progressive: true, supersets: false,
  },
  notifications: {
    reminder: true, progress: true, records: true, tips: false, social: true, marketing: false,
  },
  privacy: {
    public: false, analytics: true, biometric: false,
  },
};

// ─── Local-only persistence (no API counterpart) ───────────────────────────

const LOCAL_PREFS_KEY = 'reploop_local_prefs';

type LocalOnlyPrefs = {
  warmup: boolean;
  sound: boolean;
  vibrate: boolean;
  progressive: boolean;
  supersets: boolean;
  marketing: boolean;
  public: boolean;
  biometric: boolean;
};

const LOCAL_DEFAULTS: LocalOnlyPrefs = {
  warmup: true, sound: false, vibrate: true, progressive: true, supersets: false,
  marketing: false, public: false, biometric: false,
};

async function loadLocalPrefs(): Promise<LocalOnlyPrefs> {
  try {
    const raw = Platform.OS === 'web'
      ? localStorage.getItem(LOCAL_PREFS_KEY)
      : await SecureStore.getItemAsync(LOCAL_PREFS_KEY);
    return raw ? { ...LOCAL_DEFAULTS, ...JSON.parse(raw) } : LOCAL_DEFAULTS;
  } catch {
    return LOCAL_DEFAULTS;
  }
}

function saveLocalPrefs(prefs: LocalOnlyPrefs) {
  const json = JSON.stringify(prefs);
  if (Platform.OS === 'web') {
    localStorage.setItem(LOCAL_PREFS_KEY, json);
  } else {
    SecureStore.setItemAsync(LOCAL_PREFS_KEY, json).catch(() => {});
  }
}

// ─── Mapping between UI keys and API keys ───────────────────────────────────

function mapApiToLocal(dto: SettingsDto, prev: AppSettings): AppSettings {
  return {
    workout: {
      warmup: prev.workout.warmup,
      rest: dto.workout.restBetweenSetsSeconds > 0,
      sound: prev.workout.sound,
      vibrate: prev.workout.vibrate,
      progressive: prev.workout.progressive,
      supersets: prev.workout.supersets,
    },
    notifications: {
      reminder: dto.notifications.workoutReminders,
      progress: dto.notifications.weeklyReport,
      records: dto.notifications.achievementAlerts,
      tips: dto.notifications.emailNotifications,
      social: dto.notifications.pushNotifications,
      marketing: prev.notifications.marketing,
    },
    privacy: {
      public: prev.privacy.public,
      analytics: dto.privacy.allowDataAnalysis,
      biometric: prev.privacy.biometric,
    },
  };
}

// ─── Context ────────────────────────────────────────────────────────────────

type SettingsContextType = {
  settings: AppSettings;
  loadSettings: () => Promise<void>;
  updateWorkout: (partial: Partial<WorkoutPreferences>) => void;
  updateNotifications: (partial: Partial<NotificationPreferences>) => void;
  updatePrivacy: (partial: Partial<PrivacyPreferences>) => void;
  resetSettings: () => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const loadSettings = useCallback(async () => {
    try {
      const [dto, local] = await Promise.all([
        settingsService.getSettings(),
        loadLocalPrefs(),
      ]);
      setSettings((prev) => {
        const prevWithLocal = {
          ...prev,
          workout: { ...prev.workout, warmup: local.warmup, sound: local.sound, vibrate: local.vibrate, progressive: local.progressive, supersets: local.supersets },
          notifications: { ...prev.notifications, marketing: local.marketing },
          privacy: { ...prev.privacy, public: local.public, biometric: local.biometric },
        };
        return mapApiToLocal(dto, prevWithLocal);
      });
    } catch {
      // API failed — still load local prefs
      const local = await loadLocalPrefs().catch(() => LOCAL_DEFAULTS);
      setSettings((prev) => ({
        ...prev,
        workout: { ...prev.workout, warmup: local.warmup, sound: local.sound, vibrate: local.vibrate, progressive: local.progressive, supersets: local.supersets },
        notifications: { ...prev.notifications, marketing: local.marketing },
        privacy: { ...prev.privacy, public: local.public, biometric: local.biometric },
      }));
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateWorkout = useCallback((partial: Partial<WorkoutPreferences>) => {
    setSettings((prev) => {
      const next = { ...prev, workout: { ...prev.workout, ...partial } };
      if ('rest' in partial) {
        const restSeconds = next.workout.rest ? 60 : 0;
        settingsService.updateWorkout({ restBetweenSetsSeconds: restSeconds }).catch(() => {});
      }
      // Persist local-only workout prefs
      saveLocalPrefs({
        warmup: next.workout.warmup, sound: next.workout.sound,
        vibrate: next.workout.vibrate, progressive: next.workout.progressive,
        supersets: next.workout.supersets,
        marketing: prev.notifications.marketing,
        public: prev.privacy.public, biometric: prev.privacy.biometric,
      });
      return next;
    });
  }, []);

  const updateNotifications = useCallback((partial: Partial<NotificationPreferences>) => {
    setSettings((prev) => {
      const next = { ...prev, notifications: { ...prev.notifications, ...partial } };
      if ('marketing' in partial) {
        saveLocalPrefs({
          warmup: prev.workout.warmup, sound: prev.workout.sound,
          vibrate: prev.workout.vibrate, progressive: prev.workout.progressive,
          supersets: prev.workout.supersets,
          marketing: next.notifications.marketing,
          public: prev.privacy.public, biometric: prev.privacy.biometric,
        });
      }
      return next;
    });
    const apiPartial: Partial<NotificationSettings> = {};
    if ('reminder' in partial) apiPartial.workoutReminders = partial.reminder;
    if ('progress' in partial) apiPartial.weeklyReport = partial.progress;
    if ('records' in partial) apiPartial.achievementAlerts = partial.records;
    if ('tips' in partial) apiPartial.emailNotifications = partial.tips;
    if ('social' in partial) apiPartial.pushNotifications = partial.social;
    if (Object.keys(apiPartial).length > 0) {
      settingsService.updateNotifications(apiPartial).catch(() => {});
    }
  }, []);

  const updatePrivacy = useCallback((partial: Partial<PrivacyPreferences>) => {
    setSettings((prev) => {
      const next = { ...prev, privacy: { ...prev.privacy, ...partial } };
      if ('public' in partial || 'biometric' in partial) {
        saveLocalPrefs({
          warmup: prev.workout.warmup, sound: prev.workout.sound,
          vibrate: prev.workout.vibrate, progressive: prev.workout.progressive,
          supersets: prev.workout.supersets,
          marketing: prev.notifications.marketing,
          public: next.privacy.public, biometric: next.privacy.biometric,
        });
      }
      return next;
    });
    const apiPartial: Partial<PrivacySettings> = {};
    if ('analytics' in partial) apiPartial.allowDataAnalysis = partial.analytics;
    if (Object.keys(apiPartial).length > 0) {
      settingsService.updatePrivacy(apiPartial).catch(() => {});
    }
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveLocalPrefs(LOCAL_DEFAULTS);
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, loadSettings, updateWorkout, updateNotifications, updatePrivacy, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
