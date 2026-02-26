/**
 * Categorias de Produto - GET/POST /api/categorias-produto, GET/PUT/DELETE /api/categorias-produto/{id}.
 */

import { apiClient } from '../apiClient';

const BASE = '/api/categorias-produto';

export const categoriasProdutoService = {
  list() {
    return apiClient.get(BASE);
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
