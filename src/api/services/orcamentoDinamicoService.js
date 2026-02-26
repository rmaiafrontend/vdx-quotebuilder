/**
 * Orçamento dinâmico - Documentacao_API §4.3.1.
 * POST /api/orcamento-dinamico/calcular-pecas
 * CRUD de orçamento: entities.Orcamento (orcamentosService).
 */

import { apiClient } from '../apiClient';

const BASE = '/api/orcamento-dinamico';

/**
 * Calcula peças da tipologia com as variáveis fornecidas.
 * @param {{ tipologiaId: number, variaveis: Record<string, number>, unidade?: string }} payload
 * @returns {Promise<CalculoPecasResponseDTO>}
 */
export function calcularPecas(payload) {
  return apiClient.post(`${BASE}/calcular-pecas`, payload);
}

export const orcamentoDinamicoService = {
  calcularPecas
};
