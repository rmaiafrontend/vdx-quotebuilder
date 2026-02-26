/**
 * Configurações técnicas: tipos-vidro, puxadores, ferragens, tipos-configuracao, itens-configuracao.
 * Bases: /api/configuracao/tipos-vidro, .../puxadores, .../ferragens, .../tipos-configuracao, .../itens-configuracao.
 */

import { apiClient } from '../apiClient';

function crud(base) {
  return {
    list(params = {}) {
      return apiClient.get(base, { params });
    },
    getById(id) {
      return apiClient.get(`${base}/${id}`);
    },
    create(data) {
      return apiClient.post(base, data);
    },
    update(id, data) {
      return apiClient.put(`${base}/${id}`, data);
    },
    delete(id) {
      return apiClient.delete(`${base}/${id}`);
    }
  };
}

export const tiposVidroTecnico = crud('/api/configuracao/tipos-vidro');
export const puxadoresTecnico = crud('/api/configuracao/puxadores');
export const ferragensTecnica = crud('/api/configuracao/ferragens');
export const tiposConfiguracaoTecnica = crud('/api/configuracao/tipos-configuracao');

export const itensConfiguracaoTecnica = {
  list({ tipoConfiguracaoId, orderBy, limit } = {}) {
    return apiClient.get('/api/configuracao/itens-configuracao', {
      params: { tipoConfiguracaoId, orderBy, limit }
    });
  },
  getById(id) {
    return apiClient.get(`/api/configuracao/itens-configuracao/${id}`);
  },
  create(data) {
    return apiClient.post('/api/configuracao/itens-configuracao', data);
  },
  update(id, data) {
    return apiClient.put(`/api/configuracao/itens-configuracao/${id}`, data);
  },
  delete(id) {
    return apiClient.delete(`/api/configuracao/itens-configuracao/${id}`);
  }
};

export const configTecnicasService = {
  tiposVidro: tiposVidroTecnico,
  puxadores: puxadoresTecnico,
  ferragens: ferragensTecnica,
  tiposConfiguracao: tiposConfiguracaoTecnica,
  itensConfiguracao: itensConfiguracaoTecnica
};
