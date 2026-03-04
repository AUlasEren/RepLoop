export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type GoalType = 'muscle' | 'fat_loss' | 'endurance';

export const EXPERIENCE_LEVELS: { key: ExperienceLevel; label: string }[] = [
  { key: 'beginner', label: 'Başlangıç' },
  { key: 'intermediate', label: 'Orta' },
  { key: 'advanced', label: 'İleri' },
];

export const GOALS: {
  key: GoalType;
  icon: string;
  label: string;
  description: string;
}[] = [
  { key: 'muscle', icon: 'barbell-outline', label: 'Kas Kazanma', description: 'Güç ve hacim kazan' },
  { key: 'fat_loss', icon: 'flame-outline', label: 'Yağ Yakma', description: 'Yağ yak ve sıkılaş' },
  { key: 'endurance', icon: 'fitness-outline', label: 'Dayanıklılık', description: 'Kardiyo ve kondisyonu artır' },
];

export type GenderType = 'male' | 'female';

export const GENDERS: { key: GenderType; label: string }[] = [
  { key: 'male', label: 'Erkek' },
  { key: 'female', label: 'Kadın' },
];
