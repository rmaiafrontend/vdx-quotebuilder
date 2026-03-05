/**
 * Orcamentos service — rotas separadas para vidraceiro e admin.
 *
 * Vidraceiro: POST /api/vidraceiro/orcamentos, GET /api/vidraceiro/me/orcamentos, GET /api/vidraceiro/orcamentos/{id}
 * Admin: GET /api/admin/orcamentos, GET /api/admin/orcamentos/{id}, GET /api/admin/orcamentos/stats, PATCH /api/admin/orcamentos/{id}/status
 */

import { apiClient } from '../apiClient';

export const orcamentosService = {
  // ── Vidraceiro ──

  createAsVidraceiro(data) {
    return apiClient.post('/api/vidraceiro/orcamentos', data, { tokenScope: 'vidraceiro' });
  },

  listMyQuotes() {
    return apiClient.get('/api/vidraceiro/me/orcamentos', { tokenScope: 'vidraceiro' });
  },

  getMyQuote(id) {
    return apiClient.get(`/api/vidraceiro/me/orcamentos/${id}`, { tokenScope: 'vidraceiro' });
  },

  // ── Admin ──

  listAll(filters = {}) {
    return apiClient.get('/api/orcamentos', { params: filters, tokenScope: 'admin' });
  },

  getById(id) {
    return apiClient.get(`/api/orcamentos/${id}`, { tokenScope: 'admin' });
  },

  getStats() {
    return apiClient.get('/api/admin/orcamentos/stats', { tokenScope: 'admin' });
  },

  updateStatus(id, { status, motivo }) {
    return apiClient.patch(`/api/admin/orcamentos/${id}/status`, { status, motivo }, { tokenScope: 'admin' });
  }
};
