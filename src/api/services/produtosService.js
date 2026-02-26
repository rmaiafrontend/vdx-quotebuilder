/**
 * Produtos - GET/POST /api/produtos, GET/PUT/DELETE /api/produtos/{id}.
 * Query list: orderBy, limit.
 */

import { apiClient } from '../apiClient';

const BASE = '/api/produtos';

export const produtosService = {
  list({ orderBy, limit } = {}) {
    return apiClient.get(BASE, { params: { orderBy, limit } });
  },

  getById(id) {
    return apiClient.get(`${BASE}/${id}`);
  },

  create(data) {
    return apiClient.post(BASE, data);
  },

  update(id, data) {
    return apiClient.put(`${BASE}/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`${BASE}/${id}`);
  }
};
