/**
 * Tipologias service - Documentacao_API §4.1.4–4.1.14.
 * Tipologia: POST cadastrar, GET por categoria, GET por id.
 * Variável, fórmula, peça: cadastrar + listar por tipologia. Cores: list, get by codigo.
 */

import { apiClient } from '../apiClient';

const BASE = '/api/configuracao';

/**
 * Converte form (snake_case) para o payload da API (novo schema camelCase).
 * API: categoriaId, nome, descricao, imagemUrl, ordem, ativo, tiposVidroIds, acessorioIds,
 * variaveis (simbolo, nome, label, unidadePadrao, escolherUnidade, valorDefault, obrigatoria, ordem),
 * pecas (nome, formulaLargura, formulaAltura, quantidade, ordem, tiposConfiguracaoIds, imagem_url).
 * Não enviar id no create (gerado pelo backend).
 */
function tipologiaToApi(data) {
  if (!data) return data;

  const trim = (s) => (s != null && s !== '' ? String(s).trim() : null);
  const num = (n) => (n != null && n !== '' ? Number(n) : null);

  const result = {
    categoriaId: num(data.categoria_id) ?? 0,
    nome: trim(data.nome) ?? null,
    descricao: trim(data.descricao) ?? null,
    imagemUrl: trim(data.imagem_url) ?? trim(data.imagens?.[0]) ?? null,
    ordem: data.ordem != null ? Number(data.ordem) : 0,
    ativo: data.ativo != null ? Boolean(data.ativo) : true,
    tiposVidroIds: (data.tipos_vidro_ids || []).map(Number).filter((id) => !Number.isNaN(id)),
    acessorioIds: (data.acessorio_ids || []).map(Number).filter((id) => !Number.isNaN(id)),
    variaveis: (data.variaveis || []).map((v) => ({
      simbolo: trim(v.simbolo ?? v.nome) ?? '',
      nome: trim(v.nome) ?? '',
      label: trim(v.label ?? v.nome) ?? '',
      unidadePadrao: trim(v.unidade_padrao) ?? '',
      escolherUnidade: v.permite_alterar_unidade !== false,
      valorDefault: num(v.valor_default) ?? 0,
      obrigatoria: v.obrigatoria != null ? Boolean(v.obrigatoria) : true,
      ordem: v.ordem != null ? Number(v.ordem) : 0,
    })),
    pecas: (data.pecas || []).map((p) => {
      const tiposConfigIds = (p.configuracoes_tecnicas || [])
        .flatMap((c) => c.itens_ids || [])
        .map(Number)
        .filter((id) => !Number.isNaN(id) && id !== 0);
      return {
        nome: trim(p.nome) ?? '',
        formulaLargura: trim(p.formula_largura) ?? '',
        formulaAltura: trim(p.formula_altura) ?? '',
        quantidade: num(p.quantidade) ?? 1,
        ordem: p.ordem != null ? Number(p.ordem) : 0,
        tiposConfiguracaoIds: tiposConfigIds,
        imagem_url: trim(p.imagem_url) ?? '',
      };
    }),
  };

  return result;
}

/**
 * Tipologias service.
 * GET /api/configuracao/tipologias (todas), GET por categoria, GET /tipologias/{id},
 * POST cadastrar, PUT /tipologia/{id}, DELETE /tipologia/{id}
 */
export const tipologiasService = {
  /** Lista todas as tipologias (GET /api/configuracao/tipologias) */
  list() {
    return apiClient.get(`${BASE}/tipologias`);
  },

  listByCategoria(categoriaId) {
    return apiClient.get(`${BASE}/categorias/${categoriaId}/tipologias`);
  },

  getById(id) {
    return apiClient.get(`${BASE}/tipologias/${id}`);
  },

  create(data) {
    return apiClient.post(`${BASE}/tipologia/cadastrar`, tipologiaToApi(data));
  },

  update(id, data) {
    return apiClient.put(`${BASE}/tipologia/${id}`, tipologiaToApi(data));
  },

  delete(id) {
    return apiClient.delete(`${BASE}/tipologia/${id}`);
  },

  listVariaveis(tipologiaId) {
    return apiClient.get(`${BASE}/tipologias/${tipologiaId}/variaveis`);
  },

  createVariavel(data) {
    // Envia dados diretamente do front-end (snake_case)
    return apiClient.post(`${BASE}/variavel/cadastrar`, data);
  },

  listFormulas(tipologiaId) {
    return apiClient.get(`${BASE}/tipologias/${tipologiaId}/formulas`);
  },

  createFormula(data) {
    // Envia dados diretamente do front-end (snake_case)
    return apiClient.post(`${BASE}/formula/cadastrar`, data);
  },

  listPecas(tipologiaId) {
    return apiClient.get(`${BASE}/tipologias/${tipologiaId}/pecas`);
  },

  createPeca(data) {
    // Envia dados diretamente do front-end (snake_case)
    return apiClient.post(`${BASE}/peca/cadastrar`, data);
  },

  listCores() {
    return apiClient.get(`${BASE}/cores`);
  },

  getCorByCodigo(codigo) {
    return apiClient.get(`${BASE}/cores/${encodeURIComponent(codigo)}`);
  }
};
