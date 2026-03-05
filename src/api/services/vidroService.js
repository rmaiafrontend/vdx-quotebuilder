/**
 * Vidros service.
 * POST /api/vidro/validar, POST /api/vidro/recomendar, GET /api/vidro/categorias-aplicacao
 */

import { apiClient } from '../apiClient';

const BASE = '/api/vidro';

export const vidroService = {
  validar(payload) {
    return apiClient.post(`${BASE}/validar`, payload, { tokenScope: 'public' });
  },

  recomendar(payload) {
    return apiClient.post(`${BASE}/recomendar`, payload, { tokenScope: 'public' });
  },

  getCategoriasAplicacao() {
    return apiClient.get(`${BASE}/categorias-aplicacao`, { tokenScope: 'public' });
  }
};
