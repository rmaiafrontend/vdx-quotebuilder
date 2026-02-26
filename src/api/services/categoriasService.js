/**
 * Categorias service.
 * GET /api/configuracao/categorias, GET /api/configuracao/categorias/{id},
 * POST /api/configuracao/categoria/cadastrar,
 * PUT /api/configuracao/categoria/{id}, DELETE /api/configuracao/categoria/{id}
 */

import { apiClient } from '../apiClient';

const BASE = '/api/configuracao';

export const categoriasService = {
  list() {
    return apiClient.get(`${BASE}/categorias`);
  },

  getById(id) {
    return apiClient.get(`${BASE}/categorias/${id}`);
  },

  create(data) {
    return apiClient.post(`${BASE}/categoria/cadastrar`, data);
  },

  update(id, data) {
    return apiClient.put(`${BASE}/categoria/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`${BASE}/categoria/${id}`);
  }
};
