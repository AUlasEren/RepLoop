import { api } from './api-client';
import type {
  StrengthProgressDto,
  PersonalRecordDto,
  BodyMeasurementDto,
  AddBodyMeasurementCommand,
  LogExerciseCommand,
  PaginatedResult,
} from './api-types';

export const statisticsService = {
  async getStrengthProgress(exerciseId: string, period = '30d'): Promise<StrengthProgressDto> {
    return api.get(`/api/statistics/strength?exerciseId=${exerciseId}&period=${period}`);
  },

  async getPersonalRecords(): Promise<PersonalRecordDto[]> {
    return api.get('/api/statistics/personal-records');
  },

  async getBodyMeasurements(page = 1, pageSize = 10): Promise<PaginatedResult<BodyMeasurementDto>> {
    return api.get(`/api/statistics/body-measurements?page=${page}&pageSize=${pageSize}`);
  },

  async addBodyMeasurement(body: AddBodyMeasurementCommand): Promise<{ id: string }> {
    return api.post('/api/statistics/body-measurements', body);
  },

  async logExercise(body: LogExerciseCommand): Promise<{ id: string }> {
    return api.post('/api/statistics/exercise-logs', body);
  },
};
