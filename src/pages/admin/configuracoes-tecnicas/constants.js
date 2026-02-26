export const TIPO_VIDRO_TECNICO_INICIAL = {
  codigo: "",
  nome: "",
  espessura: "",
  tipo: "comum",
  cor: "#e2e8f0",
  descricao: "",
  caracteristicas: [],
  preco_m2: 0,
  ativo: true,
  ordem: 0,
};

export const PUXADOR_TECNICO_INICIAL = {
  nome: "",
  codigo: "",
  tipo_furacao: "",
  descricao: "",
  imagem_url: "",
  especificacoes: {
    diametro_furo: "",
    distancia_centros: "",
    profundidade: "",
  },
  ativo: true,
};

export const FERRAGEM_TECNICA_INICIAL = {
  nome: "",
  codigo: "",
  tipo: "",
  descricao: "",
  compatibilidade_tipologias: [],
  especificacoes: {},
  ativo: true,
};

export const TIPO_CONFIG_TECNICA_INICIAL = {
  nome: "",
  codigo: "",
  descricao: "",
  ordem: 0,
  ativo: true,
};

export const ITEM_CONFIG_TECNICA_INICIAL = {
  tipo_configuracao_id: "",
  nome: "",
  codigo: "",
  descricao: "",
  imagem_url: "",
  especificacoes: {},
  ativo: true,
};
