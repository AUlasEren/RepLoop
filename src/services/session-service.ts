import { api } from './api-client';
import type {
  SessionDto,
  StartSessionRequest,
  LogSetRequest,
  SessionActionRequest,
  CompleteSessionRequest,
  PaginatedResult,
} from './api-types';

export const sessionService = {
  async start(body: StartSessionRequest): Promise<{ id: string }> {
    return api.post('/api/sessions', body);
  },

  async getById(id: string): Promise<SessionDto> {
    return api.get(`/api/sessions/${id}`);
  },

  async history(page = 1, pageSize = 10): Promise<PaginatedResult<SessionDto>> {
    return api.get(`/api/sessions/history?page=${page}&pageSize=${pageSize}`);
  },

  async logSet(sessionId: string, body: LogSetRequest): Promise<{ id: string }> {
    return api.post(`/api/sessions/${sessionId}/sets`, body);
  },

  async updateStatus(sessionId: string, body: SessionActionRequest): Promise<void> {
    return api.patch(`/api/sessions/${sessionId}`, body);
  },

  async complete(sessionId: string, body?: CompleteSessionRequest): Promise<void> {
    return api.post(`/api/sessions/${sessionId}/complete`, body ?? {});
  },
};
