/**
 * Auth service - Documentacao_API §3.
 * POST /api/auth/sync-profile, GET /api/auth/profile-status, GET /api/auth/me
 */

import { apiClient } from '../apiClient';

const BASE = '/api/auth';

export const authService = {
  syncProfile(data) {
    return apiClient.post(`${BASE}/sync-profile`, data);
  },

  profileStatus() {
    return apiClient.get(`${BASE}/profile-status`);
  },

  me() {
    return apiClient.get(`${BASE}/me`);
  }
};
