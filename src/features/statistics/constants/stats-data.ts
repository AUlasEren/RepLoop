export type ChartPoint = {
  label: string;
  value: number;
};

export type PersonalRecord = {
  id: string;
  exercise: string;
  weight: number;
  date: string;
  icon: string;
  iconColor: string;
};

export type BodyMeasurement = {
  id: string;
  label: string;
  value: number;
  unit: string;
  change: number;
  changeLabel: string;
  icon: string;
  iconColor: string;
};

export const STRENGTH_CHART: {
  title: string;
  exercise: string;
  currentValue: number;
  unit: string;
  changePercent: number;
  period: string;
  points: ChartPoint[];
} = {
  title: 'GÜÇ GELİŞİMİ (SQUAT)',
  exercise: 'Squat',
  currentValue: 142.5,
  unit: 'kg',
  changePercent: 5,
  period: 'Son 30 Gün',
  points: [
    { label: '1. Hafta', value: 120 },
    { label: '2. Hafta', value: 125 },
    { label: '3. Hafta', value: 130 },
    { label: '4. Hafta', value: 142.5 },
  ],
};

export const PERSONAL_RECORDS: PersonalRecord[] = [
  { id: 'pr1', exercise: 'Squat', weight: 142.5, date: '12 Eki 2023', icon: 'trophy', iconColor: '#FFD700' },
  { id: 'pr2', exercise: 'Deadlift', weight: 183.5, date: '20 Eyl 2023', icon: 'trending-up', iconColor: '#4FC3F7' },
  { id: 'pr3', exercise: 'Bench', weight: 102.0, date: '01 Kas 2023', icon: 'stop', iconColor: '#4FC3F7' },
  { id: 'pr4', exercise: 'OH Press', weight: 70.0, date: '28 Eki 2023', icon: 'flash', iconColor: '#FFD700' },
];

export const BODY_MEASUREMENTS: BodyMeasurement[] = [
  {
    id: 'bm1',
    label: 'Vücut\nAğırlığı',
    value: 84.1,
    unit: 'kg',
    change: -1.2,
    changeLabel: 'geçen haftaya\ngöre',
    icon: 'analytics-outline',
    iconColor: '#4FC3F7',
  },
  {
    id: 'bm2',
    label: 'Yağ\nOranı',
    value: 14.2,
    unit: '%',
    change: -0.8,
    changeLabel: 'geçen aya\ngöre',
    icon: 'body-outline',
    iconColor: '#FF7043',
  },
];
