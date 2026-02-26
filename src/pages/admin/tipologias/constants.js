export const FORM_INICIAL = {
  nome: "",
  descricao: "",
  categoria_id: "",
  imagens: [],
  variaveis: [],
  pecas: [],
  acessorio_ids: [],
  tipos_vidro_ids: [],
  ordem: 0,
  ativo: true,
};

export const VARIAVEL_INICIAL = {
  id: "",
  nome: "",
  label: "",
  tipo: "numerico",
  unidade_padrao: "cm",
  permite_alterar_unidade: true,
  opcoes: [],
  ordem: 0,
};

export const PECA_INICIAL = {
  id: "",
  nome: "",
  formula_largura: "",
  formula_altura: "",
  imagem_url: "",
  configuracoes_tecnicas: [],
  ordem: 0,
};

export const CONFIGURACAO_TECNICA_INICIAL = {
  categoria: "",
  itens_ids: [],
  obrigatorio: false,
};
