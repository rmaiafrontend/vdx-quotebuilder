// Fatores de conversão para milímetros
const UNIDADES_VALIDAS = ['mm', 'cm', 'm'];
const FATORES = {
  mm: 1,
  cm: 10,
  m: 1000
};

/**
 * Escapa caracteres especiais de uma string para uso seguro em RegExp.
 */
function escaparParaRegex(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Converte qualquer unidade para milímetros.
 * @param {number} valor - Valor numérico (deve ser finito e >= 0).
 * @param {string} unidade - 'mm' | 'cm' | 'm'.
 * @returns {number} Valor em mm, ou NaN se entrada inválida.
 */
export function converterParaMM(valor, unidade) {
  const num = Number(valor);
  if (!Number.isFinite(num) || num < 0) return NaN;
  if (!UNIDADES_VALIDAS.includes(unidade)) return NaN;
  return num * FATORES[unidade];
}

/**
 * Converte milímetros para qualquer unidade.
 * @param {number} valorMM - Valor em mm (se não finito, retorna NaN).
 * @param {string} unidade - 'mm' | 'cm' | 'm'.
 */
export function converterDeMM(valorMM, unidade) {
  const num = Number(valorMM);
  if (!Number.isFinite(num)) return NaN;
  if (!UNIDADES_VALIDAS.includes(unidade)) return NaN;
  return num / FATORES[unidade];
}

// Formata uma medida em mm para a unidade desejada
export function formatarMedida(valorMM, unidade) {
  const valor = converterDeMM(valorMM, unidade);
  if (!Number.isFinite(valor)) return '—';
  if (unidade === 'mm') {
    return `${Math.round(valor)} mm`;
  } else if (unidade === 'cm') {
    return `${valor.toFixed(1)} cm`;
  } else {
    return `${valor.toFixed(3)} m`;
  }
}

// Arredonda para cima para o próximo múltiplo de 50mm
export function arredondarMultiplo50(valorMM) {
  if (!Number.isFinite(valorMM)) return NaN;
  return Math.ceil(valorMM / 50) * 50;
}

/**
 * Avalia uma fórmula simples substituindo variáveis pelos valores em mm.
 * @param {string} formula - Ex: "Lv - 15"
 * @param {Record<string, number>} variaveis - Map nome -> valor em mm.
 * @returns {{ valor: number, erro?: string }} Valor em mm ou NaN; erro opcional.
 */
export function avaliarFormula(formula, variaveis) {
  if (!formula || typeof formula !== 'string') {
    return { valor: NaN, erro: 'Fórmula vazia ou inválida' };
  }

  let expressao = String(formula).trim();
  if (!expressao) return { valor: NaN, erro: 'Fórmula vazia' };

  // Ordenar nomes por tamanho (maior primeiro) para evitar substituição parcial (ex: L vs Lv)
  const nomes = Object.keys(variaveis).filter((n) => n != null && String(n).length > 0);
  nomes.sort((a, b) => b.length - a.length);

  for (const nome of nomes) {
    const valor = variaveis[nome];
    const valorNum = Number(valor);
    if (!Number.isFinite(valorNum)) continue;
    const regex = new RegExp(`\\b${escaparParaRegex(nome)}\\b`, 'g');
    expressao = expressao.replace(regex, String(valorNum));
  }

  expressao = expressao.replace(/\s/g, '');

  try {
    // Permite números (incl. notação científica 1e3), operadores e parênteses
    if (!/^[\d.eE+\-*/().]+$/.test(expressao)) {
      return { valor: NaN, erro: `Expressão inválida: ${expressao}` };
    }
    const resultado = Function('"use strict"; return (' + expressao + ')')();
    const num = Number(resultado);
    if (!Number.isFinite(num)) {
      return { valor: NaN, erro: 'Resultado não é um número válido' };
    }
    if (num < 0) {
      return { valor: NaN, erro: 'Resultado não pode ser negativo' };
    }
    return { valor: num };
  } catch (e) {
    return { valor: NaN, erro: `Erro ao avaliar: ${e.message || String(e)}` };
  }
}

/**
 * Resultado de cálculo de peças: peças, totais e lista de erros.
 * @typedef {Object} ResultadoCalculoPecas
 * @property {Array} pecas
 * @property {number} areaTotalRealM2
 * @property {number} areaTotalCobrancaM2
 * @property {Array<{ tipo: string, mensagem: string, pecaIndex?: number, variavelNome?: string }>} erros
 */

/**
 * Calcula as peças de uma tipologia com base nas variáveis de entrada.
 * @param {Object} tipologia - Deve ter tipologia.pecas (array com formula_largura, formula_altura).
 * @param {Array<{ nome: string, valor: number|string, unidade: string }>} variaveisEntrada
 * @returns {ResultadoCalculoPecas}
 */
export function calcularPecas(tipologia, variaveisEntrada) {
  const erros = [];

  if (!tipologia || !Array.isArray(tipologia.pecas) || tipologia.pecas.length === 0) {
    erros.push({ tipo: 'tipologia', mensagem: 'Tipologia sem peças definidas.' });
    return {
      pecas: [],
      areaTotalRealM2: 0,
      areaTotalCobrancaM2: 0,
      erros
    };
  }

  if (!Array.isArray(variaveisEntrada)) {
    erros.push({ tipo: 'variaveis', mensagem: 'Variáveis de entrada inválidas.' });
    return {
      pecas: [],
      areaTotalRealM2: 0,
      areaTotalCobrancaM2: 0,
      erros
    };
  }

  const variaveisMM = {};
  for (const v of variaveisEntrada) {
    if (v == null || v.nome == null) continue;
    const valorNum = typeof v.valor === 'string' && v.valor.trim() === '' ? NaN : Number(v.valor);
    const mm = converterParaMM(valorNum, v.unidade);
    variaveisMM[v.nome] = mm;
    if (!Number.isFinite(mm)) {
      erros.push({
        tipo: 'variavel',
        mensagem: `Valor da variável "${v.nome}" é inválido ou unidade incorreta.`,
        variavelNome: v.nome
      });
    }
  }

  if (erros.some((e) => e.tipo === 'variavel')) {
    return {
      pecas: [],
      areaTotalRealM2: 0,
      areaTotalCobrancaM2: 0,
      erros
    };
  }

  const pecasCalculadas = tipologia.pecas.map((peca, pecaIndex) => {
    const larguraResult = avaliarFormula(peca.formula_largura, variaveisMM);
    const alturaResult = avaliarFormula(peca.formula_altura, variaveisMM);
    const larguraMM = larguraResult.valor;
    const alturaMM = alturaResult.valor;

    if (!Number.isFinite(larguraMM) || larguraMM < 0) {
      erros.push({
        tipo: 'formula_largura',
        mensagem: larguraResult.erro
          ? `Peça "${peca.nome || 'Sem nome'}": ${larguraResult.erro}`
          : `Peça "${peca.nome || 'Sem nome'}": fórmula de largura inválida.`,
        pecaIndex
      });
    }
    if (!Number.isFinite(alturaMM) || alturaMM < 0) {
      erros.push({
        tipo: 'formula_altura',
        mensagem: alturaResult.erro
          ? `Peça "${peca.nome || 'Sem nome'}": ${alturaResult.erro}`
          : `Peça "${peca.nome || 'Sem nome'}": fórmula de altura inválida.`,
        pecaIndex
      });
    }

    const larguraUsar = Number.isFinite(larguraMM) && larguraMM >= 0 ? larguraMM : 0;
    const alturaUsar = Number.isFinite(alturaMM) && alturaMM >= 0 ? alturaMM : 0;
    const larguraArredondadaMM = arredondarMultiplo50(larguraUsar);
    const alturaArredondadaMM = arredondarMultiplo50(alturaUsar);
    const areaRealM2 = (larguraUsar * alturaUsar) / 1000000;
    const areaCobrancaM2 = (larguraArredondadaMM * alturaArredondadaMM) / 1000000;

    return {
      nome: peca.nome,
      imagem_url: peca.imagem_url || '',
      largura_real_mm: larguraUsar,
      altura_real_mm: alturaUsar,
      largura_arredondada_mm: larguraArredondadaMM,
      altura_arredondada_mm: alturaArredondadaMM,
      area_real_m2: areaRealM2,
      area_cobranca_m2: areaCobrancaM2,
      tem_puxador: peca.tem_puxador,
      puxador: null,
      configuracoes_tecnicas: [],
      conferido: false
    };
  });

  const areaTotalRealM2 = pecasCalculadas.reduce((sum, p) => sum + p.area_real_m2, 0);
  const areaTotalCobrancaM2 = pecasCalculadas.reduce((sum, p) => sum + p.area_cobranca_m2, 0);

  return {
    pecas: pecasCalculadas,
    areaTotalRealM2,
    areaTotalCobrancaM2,
    erros
  };
}

// Calcula o preço total
export function calcularPreco(areaM2, precoM2) {
  const a = Number(areaM2);
  const p = Number(precoM2);
  if (!Number.isFinite(a) || !Number.isFinite(p)) return NaN;
  return a * p;
}

/** Regex para identificar nomes de variáveis em fórmulas (identificador: letra/underscore seguido de alfanuméricos) */
const REGEX_IDENTIFICADOR = /\b[A-Za-z_][A-Za-z0-9_]*\b/g;

/**
 * Extrai os identificadores (possíveis variáveis) de uma fórmula.
 * @param {string} formula
 * @returns {string[]} Lista única de identificadores.
 */
function extrairIdentificadoresFormula(formula) {
  if (!formula || typeof formula !== 'string') return [];
  const matches = formula.trim().match(REGEX_IDENTIFICADOR) || [];
  return [...new Set(matches)];
}

/**
 * Valida as fórmulas de uma tipologia: variáveis usadas existem e fórmulas retornam valor válido com valores de teste.
 * @param {{ variaveis?: Array<{ nome: string }>, pecas?: Array<{ nome?: string, formula_largura?: string, formula_altura?: string }> }} tipologia - Objeto com variaveis e pecas (formData do modal).
 * @returns {{ valido: boolean, erros: string[], avisos: string[] }}
 */
export function validarFormulasTipologia(tipologia) {
  const erros = [];
  const avisos = [];
  const nomesVariaveis = new Set((tipologia.variaveis || []).map((v) => v?.nome).filter(Boolean));

  if (!Array.isArray(tipologia.pecas) || tipologia.pecas.length === 0) {
    return { valido: true, erros: [], avisos: [] };
  }

  const variaveisTeste = {};
  nomesVariaveis.forEach((n) => { variaveisTeste[n] = 1000; });

  for (let i = 0; i < tipologia.pecas.length; i++) {
    const peca = tipologia.pecas[i];
    const nomePeca = peca.nome || `Peça ${i + 1}`;

    for (const [campo, label] of [
      ['formula_largura', 'largura'],
      ['formula_altura', 'altura']
    ]) {
      const formula = peca[campo];
      if (!formula || !String(formula).trim()) {
        erros.push(`${nomePeca}: fórmula de ${label} não pode estar vazia.`);
        continue;
      }
      const ids = extrairIdentificadoresFormula(formula);
      for (const id of ids) {
        if (!nomesVariaveis.has(id)) {
          erros.push(`${nomePeca}: a variável "${id}" usada na fórmula de ${label} não está definida nas variáveis da tipologia.`);
        }
      }
      const result = avaliarFormula(formula, variaveisTeste);
      if (!Number.isFinite(result.valor) || result.valor < 0) {
        avisos.push(`${nomePeca}: fórmula de ${label} não retorna um valor válido com valores de teste. ${result.erro || ''}`);
      }
    }
  }

  return {
    valido: erros.length === 0,
    erros,
    avisos
  };
}
