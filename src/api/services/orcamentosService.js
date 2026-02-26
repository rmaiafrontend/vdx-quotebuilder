/**
 * Orçamentos - GET/POST /api/orcamentos, GET/PUT/DELETE /api/orcamentos/{id}.
 * Query list: orderBy, limit.
 */

import { apiClient } from '../apiClient';

const BASE = '/api/orcamentos';

export const orcamentosService = {
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
