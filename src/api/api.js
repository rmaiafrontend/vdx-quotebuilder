// API: todas as entidades e integrações delegam para os services (backend real)
import { categoriasService } from './services/categoriasService';
import { tipologiasService } from './services/tipologiasService';
import { integracoesService } from './services/integracoesService';
import { produtosService } from './services/produtosService';
import { orcamentosService } from './services/orcamentosService';
import { ORCAMENTOS_EXEMPLO } from '../constants/orcamentosExemplo';
import { categoriasProdutoService } from './services/categoriasProdutoService';
import { configTecnicasService } from './services/configTecnicasService';
import { uploadService } from './services/uploadService';

const sortData = (data, orderBy) => {
  if (!orderBy || !Array.isArray(data)) return data ?? [];
  const [field, direction] = orderBy.startsWith('-') ? [orderBy.slice(1), 'desc'] : [orderBy, 'asc'];
  return [...data].sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];
    if (field.includes('date')) {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

const filterData = (data, filters) => {
  if (!filters || Object.keys(filters).length === 0) return data ?? [];
  return (data ?? []).filter(item =>
    Object.entries(filters).every(([key, value]) => {
      if (Array.isArray(value)) return value.includes(item[key]);
      return item[key] === value;
    })
  );
};

const ensureList = (res) => (Array.isArray(res) ? res : res?.data ?? []);

// Entidades: sempre via API
export const entities = {
  Categoria: {
    list: async (orderBy = 'ordem') => sortData(await categoriasService.list(), orderBy),
    filter: async (filters = {}, orderBy = 'ordem') => {
      const list = await categoriasService.list();
      return sortData(filterData(list, filters), orderBy);
    },
    create: (data) => categoriasService.create(data),
    update: (id, data) => categoriasService.update(id, data),
    delete: (id) => categoriasService.delete(id)
  },

  Tipologia: {
    list: async (orderBy = 'ordem') => sortData(await tipologiasService.list(), orderBy),
    filter: async (filters = {}, orderBy = 'ordem') => {
      const list = await tipologiasService.list();
      return sortData(filterData(list, filters), orderBy);
    },
    create: (data) => tipologiasService.create(data),
    update: (id, data) => tipologiasService.update(id, data),
    delete: (id) => tipologiasService.delete(id)
  },

  TipoVidro: {
    list: async (orderBy = 'ordem') => {
      const list = await configTecnicasService.tiposVidro.list({ orderBy });
      return sortData(ensureList(list), orderBy);
    },
    filter: async (filters = {}, orderBy = 'ordem') => {
      const list = await configTecnicasService.tiposVidro.list({ orderBy });
      return sortData(filterData(ensureList(list), filters), orderBy);
    },
    create: (data) => configTecnicasService.tiposVidro.create(data),
    update: (id, data) => configTecnicasService.tiposVidro.update(id, data),
    delete: (id) => configTecnicasService.tiposVidro.delete(id)
  },

  Puxador: {
    list: async () => [],
    filter: async () => [],
    create: () => Promise.reject(new Error('Puxador: API removida')),
    update: () => Promise.reject(new Error('Puxador: API removida')),
    delete: () => Promise.reject(new Error('Puxador: API removida'))
  },

  Acessorio: {
    list: async () => [],
    filter: async () => [],
    create: () => Promise.reject(new Error('Acessório: use Produto ou outra API')),
    update: () => Promise.reject(new Error('Acessório: use Produto ou outra API')),
    delete: () => Promise.reject(new Error('Acessório: use Produto ou outra API'))
  },

  Orcamento: {
    list: async (orderBy = '-created_date', limit = 100) => {
      const fromApi = await orcamentosService.list({ orderBy, limit });
      const list = ensureList(fromApi);
      const merged = [...ORCAMENTOS_EXEMPLO, ...list];
      return sortData(merged, orderBy);
    },
    filter: async (filters = {}, orderBy = 'ordem') => {
      const list = await orcamentosService.list({ orderBy });
      return sortData(filterData(ensureList(list), filters), orderBy);
    },
    create: (data) => orcamentosService.create(data),
    update: (id, data) => orcamentosService.update(id, data),
    delete: (id) => orcamentosService.delete(id)
  },

  TipoVidroTecnico: {
    list: async (orderBy = 'ordem') => {
      const list = await configTecnicasService.tiposVidro.list({ orderBy });
      return ensureList(list);
    },
    filter: async (filters = {}, orderBy = 'ordem') => {
      const list = await configTecnicasService.tiposVidro.list({ orderBy });
      return sortData(filterData(ensureList(list), filters), orderBy);
    },
    create: (data) => configTecnicasService.tiposVidro.create(data),
    update: (id, data) => configTecnicasService.tiposVidro.update(id, data),
    delete: (id) => configTecnicasService.tiposVidro.delete(id)
  },

  PuxadorTecnico: {
    list: async () => [],
    filter: async () => [],
    create: () => Promise.reject(new Error('PuxadorTecnico: API removida')),
    update: () => Promise.reject(new Error('PuxadorTecnico: API removida')),
    delete: () => Promise.reject(new Error('PuxadorTecnico: API removida'))
  },

  TipoConfiguracaoTecnica: {
    list: async (orderBy = 'ordem') => {
      const list = await configTecnicasService.tiposConfiguracao.list({ orderBy });
      return ensureList(list);
    },
    filter: async (filters = {}, orderBy = 'ordem') => {
      const list = await configTecnicasService.tiposConfiguracao.list({ orderBy });
      return sortData(filterData(ensureList(list), filters), orderBy);
    },
    create: (data) => configTecnicasService.tiposConfiguracao.create(data),
    update: (id, data) => configTecnicasService.tiposConfiguracao.update(id, data),
    delete: (id) => configTecnicasService.tiposConfiguracao.delete(id)
  },

  ItemConfiguracaoTecnica: {
    list: async (orderBy = 'nome') => {
      const list = await configTecnicasService.itensConfiguracao.list({ orderBy });
      return ensureList(list);
    },
    filter: async (filters = {}, orderBy = 'nome') => {
      const tipoConfiguracaoId = filters?.tipo_configuracao_id ?? filters?.tipoConfiguracaoId;
      if (tipoConfiguracaoId != null) {
        const list = await configTecnicasService.itensConfiguracao.list({ tipoConfiguracaoId, orderBy });
        return sortData(filterData(ensureList(list), filters), orderBy);
      }
      const list = await configTecnicasService.itensConfiguracao.list({ orderBy });
      return sortData(filterData(ensureList(list), filters), orderBy);
    },
    create: (data) => configTecnicasService.itensConfiguracao.create(data),
    update: (id, data) => configTecnicasService.itensConfiguracao.update(id, data),
    delete: (id) => configTecnicasService.itensConfiguracao.delete(id)
  },

  CategoriaProduto: {
    list: async (orderBy = 'ordem') => {
      const list = await categoriasProdutoService.list();
      return sortData(ensureList(list), orderBy);
    },
    filter: async (filters = {}, orderBy = 'ordem') => {
      const list = await categoriasProdutoService.list();
      return sortData(filterData(ensureList(list), filters), orderBy);
    },
    create: (data) => categoriasProdutoService.create(data),
    update: (id, data) => categoriasProdutoService.update(id, data),
    delete: (id) => categoriasProdutoService.delete(id)
  },

  Produto: {
    list: async (orderBy = 'ordem', limit) => {
      const list = await produtosService.list({ orderBy, limit });
      return ensureList(list);
    },
    filter: async (filters = {}, orderBy = 'ordem') => {
      const list = await produtosService.list({ orderBy });
      return sortData(filterData(ensureList(list), filters), orderBy);
    },
    create: (data) => produtosService.create(data),
    update: (id, data) => produtosService.update(id, data),
    delete: (id) => produtosService.delete(id)
  }
};

export const integrations = {
  Core: {
    SendEmail: integracoesService.sendEmail,
    UploadFile: async ({ file }) => uploadService.upload(file)
  }
};
