// ─── Shared ─────────────────────────────────────────────────────────────────

export type PaginatedResult<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ApiError = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  errorCode?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

// ─── Auth ───────────────────────────────────────────────────────────────────

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  isProfileComplete: boolean;
};

export type AuthResult = {
  token: string;
  refreshToken: string;
  user: AuthUser;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  displayName: string;
};

export type ForgotPasswordRequest = { email: string };
export type ResetPasswordRequest = { email: string; token: string; newPassword: string };
export type ChangePasswordRequest = { currentPassword: string; newPassword: string };
export type GoogleAuthRequest = { idToken: string };
export type AppleAuthRequest = { identityToken: string; fullName?: string | null };

// ─── User ───────────────────────────────────────────────────────────────────

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 0 | 1 | 2;
export type Goal = 'WeightLoss' | 'MuscleGain' | 'Endurance' | 'Flexibility' | 'GeneralFitness' | 0 | 1 | 2 | 3 | 4;

export type UserProfileDto = {
  userId: string;
  displayName: string;
  age: number;
  heightCm: number;
  weightKg: number;
  experienceLevel: ExperienceLevel;
  goal: Goal;
  avatarUrl: string | null;
};

export type UpdateProfileCommand = {
  displayName: string;
  age: number;
  heightCm: number;
  weightKg: number;
  experienceLevel: ExperienceLevel;
  goal: Goal;
};

// ─── Settings ───────────────────────────────────────────────────────────────

export type WeightUnit = 'Kg' | 'Lb';
export type DistanceUnit = 'Km' | 'Miles';

export type WorkoutSettings = {
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
  defaultDurationMinutes: number;
  restBetweenSetsSeconds: number;
  workoutDays: string[];
};

export type NotificationSettings = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  workoutReminders: boolean;
  weeklyReport: boolean;
  achievementAlerts: boolean;
};

export type PrivacySettings = {
  allowDataAnalysis: boolean;
};

export type SettingsDto = {
  workout: WorkoutSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
};

// ─── Exercises ──────────────────────────────────────────────────────────────

export type ExerciseDto = {
  id: string;
  name: string;
  description: string | null;
  muscleGroup: string | null;
  equipment: string | null;
  difficulty: string | null;
  videoUrl: string | null;
  imageUrl: string | null;
  isPublic: boolean;
  createdAt: string;
};

export type CreateExerciseCommand = Omit<ExerciseDto, 'id' | 'createdAt'>;
export type UpdateExerciseCommand = CreateExerciseCommand & { id: string };

// ─── Workouts ───────────────────────────────────────────────────────────────

export type WorkoutExerciseDto = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weightKg: number;
  durationSeconds: number;
  notes: string | null;
};

export type WorkoutDto = {
  id: string;
  name: string;
  description: string | null;
  notes: string | null;
  scheduledDate: string | null;
  durationMinutes: number;
  createdAt: string;
  exercises: WorkoutExerciseDto[];
};

export type CreateWorkoutCommand = {
  name: string;
  description?: string | null;
  notes?: string | null;
  scheduledDate?: string | null;
  durationMinutes: number;
  exercises: Omit<WorkoutExerciseDto, 'id'>[];
};

export type UpdateWorkoutCommand = CreateWorkoutCommand & { id: string };

// ─── Sessions ───────────────────────────────────────────────────────────────

export type SessionStatus = 'Active' | 'Paused' | 'Completed' | 'Abandoned';

export type SessionSetDto = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  reps: number;
  weightKg: number;
  durationSeconds: number;
  notes: string | null;
  completedAt: string;
};

export type SessionDto = {
  id: string;
  workoutId: string;
  workoutName: string;
  status: SessionStatus;
  startedAt: string;
  pausedAt: string | null;
  completedAt: string | null;
  totalDurationSeconds: number;
  notes: string | null;
  sets: SessionSetDto[];
};

export type StartSessionRequest = { workoutId: string; workoutName: string };
export type LogSetRequest = {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  reps: number;
  weightKg: number;
  durationSeconds: number;
  notes?: string | null;
};
export type SessionActionRequest = { action: 'Pause' | 'Resume' };
export type CompleteSessionRequest = { notes?: string };

// ─── Statistics ─────────────────────────────────────────────────────────────

export type StrengthDataPoint = {
  date: string;
  maxWeightKg: number;
  maxReps: number;
  totalVolume: number;
};

export type StrengthProgressDto = {
  exerciseId: string;
  exerciseName: string;
  dataPoints: StrengthDataPoint[];
};

export type PersonalRecordDto = {
  exerciseId: string;
  exerciseName: string;
  maxWeightKg: number;
  maxReps: number;
  achievedAt: string;
};

export type BodyMeasurementDto = {
  id: string;
  measuredAt: string;
  weightKg: number | null;
  bodyFatPercentage: number | null;
  chestCm: number | null;
  waistCm: number | null;
  hipsCm: number | null;
  bicepsCm: number | null;
  thighCm: number | null;
  notes: string | null;
};

export type AddBodyMeasurementCommand = {
  measuredAt: string;
  weightKg?: number | null;
  bodyFatPercentage?: number | null;
  chestCm?: number | null;
  waistCm?: number | null;
  hipsCm?: number | null;
  bicepsCm?: number | null;
  thighCm?: number | null;
  notes?: string | null;
};

export type LogExerciseCommand = {
  exerciseId: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
  performedAt: string;
};

// ─── Recommendations ───────────────────────────────────────────────────────

export type RecommendationRequest = {
  user_id: string;
  age: number;
  weight_kg: number;
  height_cm: number;
  experience_level: 'Beginner' | 'Intermediate' | 'Advanced';
  goal: 'WeightLoss' | 'MuscleGain' | 'Endurance' | 'Flexibility' | 'GeneralFitness';
};

export type RecommendationItem = {
  workout_id: string;
  workout_name: string;
  description: string;
  duration_minutes: number;
  exercise_count: number;
  muscle_groups: string[];
  score: number;
  reason: string;
  tags: string[];
};

export type RecommendationResponse = {
  user_id: string;
  algorithm: string;
  recommendations: RecommendationItem[];
};
