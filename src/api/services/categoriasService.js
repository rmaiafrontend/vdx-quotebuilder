/**
 * Categorias service.
 * GET /api/configuracao/categorias (public)
 * GET /api/configuracao/categorias/{id} (admin)
 * POST /api/configuracao/categoria/cadastrar (admin)
 * PUT /api/configuracao/categoria/{id} (admin)
 * DELETE /api/configuracao/categoria/{id} (admin)
 */

import { apiClient } from '../apiClient';

export const categoriasService = {
  list() {
    return apiClient.get('/api/configuracao/categorias', { tokenScope: 'public' });
  },

  getById(id) {
    return apiClient.get(`/api/configuracao/categorias/${id}`, { tokenScope: 'admin' });
  },

  create(data) {
    return apiClient.post('/api/configuracao/categoria/cadastrar', data, { tokenScope: 'admin' });
  },

  update(id, data) {
    return apiClient.put(`/api/configuracao/categoria/${id}`, data, { tokenScope: 'admin' });
  },

  delete(id) {
    return apiClient.delete(`/api/configuracao/categoria/${id}`, { tokenScope: 'admin' });
  }
};
