/**
 * Orçamentos de exemplo para demonstração e testes.
 * Incluídos na listagem do admin; não podem ser excluídos nem ter status alterado.
 */

/**
 * Payload de exemplo para cadastro de orçamento (POST /api/orcamentos).
 * No cadastro, id, created_at e updated_at costumam ser gerados pelo backend (podem ser omitidos).
 */
export const ORCAMENTO_CADASTRO_EXEMPLO = {
  numero: "ORC-2025001",
  cliente_nome: "Maria Silva",
  cliente_telefone: "(11) 98765-4321",
  cliente_email: "maria.silva@email.com",
  tipologia_id: "1",
  tipologia_nome: "Porta de Correr 2 Folhas",
  tipo_vidro_id: "1",
  tipo_vidro_nome: "Vidro Incolor 8mm",
  variaveis_entrada: [
    '{"nome":"Lv","label":"Largura do vão","valor":180,"unidade":"cm"}',
    '{"nome":"Av","label":"Altura do vão","valor":220,"unidade":"cm"}',
  ],
  pecas_calculadas: [
    '{"nome":"Folha 1","largura_real_mm":900,"altura_real_mm":2150,"area_cobranca_m2":2.0}',
    '{"nome":"Folha 2","largura_real_mm":900,"altura_real_mm":2150,"area_cobranca_m2":2.0}',
  ],
  itens: [
    '{"produto_id":1,"nome":"Vidro Incolor 8mm","quantidade":4.0,"unidade":"m2","preco_unitario":350,"preco_total":1400}',
  ],
  area_total_real_m2: 3.87,
  area_total_cobranca_m2: 4.0,
  preco_m2: 350,
  preco_total: 1400,
  status: "aguardando_aprovacao",
};

const umaSemanaAtras = new Date();
umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
const tresDiasAtras = new Date();
tresDiasAtras.setDate(tresDiasAtras.getDate() - 3);
const ontem = new Date();
ontem.setDate(ontem.getDate() - 1);

export const ORCAMENTOS_EXEMPLO = [
  {
    id: "exemplo-1",
    exemplo: true,
    numero: "ORC-2024001",
    cliente_nome: "Maria Silva",
    cliente_telefone: "(11) 98765-4321",
    cliente_email: "maria.silva@email.com",
    tipologia_id: 1,
    tipologia_nome: "Porta de Correr 2 Folhas",
    tipo_vidro_id: 1,
    tipo_vidro_nome: "Vidro Incolor 8mm",
    variaveis_entrada: [
      { nome: "Lv", label: "Largura do vão", valor: 180, unidade: "cm" },
      { nome: "Av", label: "Altura do vão", valor: 220, unidade: "cm" },
    ],
    pecas_calculadas: [
      {
        nome: "Folha 1",
        largura_real_mm: 900,
        altura_real_mm: 2150,
        area_cobranca_m2: 2.0,
      },
      {
        nome: "Folha 2",
        largura_real_mm: 900,
        altura_real_mm: 2150,
        area_cobranca_m2: 2.0,
      },
    ],
    area_total_real_m2: 3.87,
    area_total_cobranca_m2: 4.0,
    preco_m2: 350,
    preco_total: 1400,
    status: "aguardando_aprovacao",
    created_date: umaSemanaAtras.toISOString(),
  },
  {
    id: "exemplo-2",
    exemplo: true,
    numero: "ORC-2024002",
    cliente_nome: "João Santos",
    cliente_telefone: "(21) 99876-5432",
    cliente_email: "joao.santos@email.com",
    tipologia_id: 2,
    tipologia_nome: "Janela Fixa",
    tipo_vidro_id: 2,
    tipo_vidro_nome: "Vidro Fumê 10mm",
    variaveis_entrada: [
      { nome: "Lv", label: "Largura", valor: 120, unidade: "cm" },
      { nome: "Av", label: "Altura", valor: 100, unidade: "cm" },
    ],
    pecas_calculadas: [
      {
        nome: "Vão fixo",
        largura_real_mm: 1185,
        altura_real_mm: 985,
        area_cobranca_m2: 1.25,
      },
    ],
    area_total_real_m2: 1.17,
    area_total_cobranca_m2: 1.25,
    preco_m2: 420,
    preco_total: 525,
    status: "em_producao",
    created_date: tresDiasAtras.toISOString(),
  },
  {
    id: "exemplo-3",
    exemplo: true,
    numero: "ORC-2024003",
    cliente_nome: "Ana Oliveira",
    cliente_telefone: "(31) 99123-4567",
    cliente_email: "ana.oliveira@email.com",
    tipologia_id: 1,
    tipologia_nome: "Porta de Correr 2 Folhas",
    tipo_vidro_id: 1,
    tipo_vidro_nome: "Vidro Incolor 8mm",
    variaveis_entrada: [
      { nome: "Lv", label: "Largura do vão", valor: 200, unidade: "cm" },
      { nome: "Av", label: "Altura do vão", valor: 230, unidade: "cm" },
    ],
    pecas_calculadas: [
      {
        nome: "Folha 1",
        largura_real_mm: 1000,
        altura_real_mm: 2250,
        area_cobranca_m2: 2.5,
      },
      {
        nome: "Folha 2",
        largura_real_mm: 1000,
        altura_real_mm: 2250,
        area_cobranca_m2: 2.5,
      },
    ],
    area_total_real_m2: 4.5,
    area_total_cobranca_m2: 5.0,
    preco_m2: 350,
    preco_total: 1750,
    status: "concluido",
    created_date: ontem.toISOString(),
  },
];
