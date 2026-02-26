/**
 * Vidros service - Documentacao_API §4.2.
 * POST /api/vidro/validar, POST /api/vidro/recomendar, GET /api/vidro/categorias-aplicacao
 */

import { apiClient } from '../apiClient';

const BASE = '/api/vidro';

export const vidroService = {
  validar(payload) {
    return apiClient.post(`${BASE}/validar`, payload);
  },

  recomendar(payload) {
    return apiClient.post(`${BASE}/recomendar`, payload);
  },

  listCategoriasAplicacao() {
    return apiClient.get(`${BASE}/categorias-aplicacao`);
  }
};
