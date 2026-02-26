/**
 * Cálculos e conversões - Documentacao_API §4.4.
 * POST /api/calculo/converter-unidade, POST /api/calculo/arredondar
 */

import { apiClient } from '../apiClient';

const BASE = '/api/calculo';

export const calculoService = {
  converterUnidade(payload) {
    return apiClient.post(`${BASE}/converter-unidade`, payload);
  },

  arredondar(payload) {
    return apiClient.post(`${BASE}/arredondar`, payload);
  }
};
