export type Exercise = {
  id: string;
  name: string;
  category: string;
  sets: number;
  reps: string;
  rest: string;
  imageUrl: string;
  order: number;
  total: number;
};

export type WorkoutDetail = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  difficulty: string;
  exerciseCount: number;
  estimatedCalories: number;
  heroImageUrl: string;
  exercises: Exercise[];
};

export type WorkoutSummary = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  exerciseCount: number;
  duration: string;
  imageUrl: string;
};

export const WORKOUT_LIST: WorkoutSummary[] = [
  {
    id: '1',
    title: 'İtme Günü',
    subtitle: 'Göğüs, Omuz & Triceps',
    tags: ['Hipertrofi'],
    exerciseCount: 6,
    duration: '60 dk',
    imageUrl: 'https://images.unsplash.com/photo-1534368786749-b63e05c92717?w=400&q=70',
  },
  {
    id: '2',
    title: 'Çekme Günü',
    subtitle: 'Sırt & Biceps Odaklı',
    tags: ['Güç'],
    exerciseCount: 5,
    duration: '55 dk',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=70',
  },
  {
    id: '3',
    title: 'Bacak Günü',
    subtitle: 'Quadriceps, Hamstring & Glute',
    tags: ['Hipertrofi'],
    exerciseCount: 7,
    duration: '65 dk',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=70',
  },
  {
    id: '4',
    title: 'HIIT Kardiyo',
    subtitle: 'Yüksek Yoğunluk Interval',
    tags: ['Kardiyo'],
    exerciseCount: 8,
    duration: '30 dk',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=70',
  },
  {
    id: '5',
    title: 'Üst Vücut',
    subtitle: 'Omuz, Göğüs & Kol',
    tags: ['Güç'],
    exerciseCount: 6,
    duration: '50 dk',
    imageUrl: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=400&q=70',
  },
];

export const DUMMY_WORKOUT: WorkoutDetail = {
  id: '1',
  title: 'İtme Günü',
  subtitle: 'Göğüs, Omuz & Triceps Odaklı',
  tags: ['HİPERTROFİ', '60 dk'],
  difficulty: 'Yüksek',
  exerciseCount: 6,
  estimatedCalories: 450,
  heroImageUrl: 'https://images.unsplash.com/photo-1534368786749-b63e05c92717?w=800&q=80',
  exercises: [
    {
      id: 'e1',
      name: 'Barbell Bench Press',
      category: 'Temel Bileşik',
      sets: 3,
      reps: '8-12 Tekrar',
      rest: '90s',
      imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=60',
      order: 1,
      total: 6,
    },
    {
      id: 'e2',
      name: 'Incline DB Press',
      category: 'Üst Göğüs',
      sets: 3,
      reps: '10-12 Tekrar',
      rest: '90s',
      imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&q=60',
      order: 2,
      total: 6,
    },
    {
      id: 'e3',
      name: 'Lateral Raises',
      category: 'Yan Omuz',
      sets: 4,
      reps: '15-20 Tekrar',
      rest: '60s',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&q=60',
      order: 3,
      total: 6,
    },
    {
      id: 'e4',
      name: 'Tricep Pushdowns',
      category: 'İzolasyon',
      sets: 3,
      reps: '12-15 Tekrar',
      rest: '60s',
      imageUrl: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=200&q=60',
      order: 4,
      total: 6,
    },
  ],
};
