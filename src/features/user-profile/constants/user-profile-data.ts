export type UserProfileData = {
  name: string;
  avatarUrl: string;
  level: string;
  height: number;
  weight: number;
  goal: string;
};

export type SettingsItem = {
  id: string;
  icon: string;
  iconBg: string;
  label: string;
  hasBadge?: boolean;
};

export const ACCOUNT_SETTINGS: SettingsItem[] = [
  { id: 'edit', icon: 'person-outline', iconBg: '#4FC3F7', label: 'Profilimi Düzenle' },
  { id: 'prefs', icon: 'barbell-outline', iconBg: '#AB47BC', label: 'Antrenman Tercihleri' },
  { id: 'notif', icon: 'notifications-outline', iconBg: '#FFB74D', label: 'Bildirimler', hasBadge: true },
];

export const APP_SETTINGS: SettingsItem[] = [
  { id: 'privacy', icon: 'lock-closed-outline', iconBg: '#66BB6A', label: 'Gizlilik & Güvenlik' },
  { id: 'help', icon: 'help-circle-outline', iconBg: '#42A5F5', label: 'Yardım & Destek' },
];
