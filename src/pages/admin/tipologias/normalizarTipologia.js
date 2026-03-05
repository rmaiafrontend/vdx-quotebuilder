import { VARIAVEL_INICIAL, PECA_INICIAL, CONFIGURACAO_TECNICA_INICIAL } from './constants';

/**
 * Normaliza os dados de uma tipologia do backend para o formato do form.
 */
export function normalizarTipologia(tipologia, itensConfiguracaoTecnica = []) {
    const categoriaId = tipologia.categoriaId ?? tipologia.categoria_id ?? tipologia.categoria_ids?.[0] ?? '';
    const tiposVidroIds = tipologia.tiposVidroIds ?? tipologia.tipos_vidro_ids ?? [];
    const acessorioIds = tipologia.acessorioIds ?? tipologia.acessorio_ids ?? [];

    const variaveis = (tipologia.variaveis || []).map((v, i) => ({
        ...VARIAVEL_INICIAL,
        ...v,
        id: v.id || `var_${i}_${Date.now()}`,
        unidade_padrao: v.unidade_padrao ?? v.unidadePadrao ?? VARIAVEL_INICIAL.unidade_padrao,
        permite_alterar_unidade: v.permite_alterar_unidade ?? v.escolherUnidade ?? VARIAVEL_INICIAL.permite_alterar_unidade,
        valor_default: v.valor_default ?? v.valorDefault ?? VARIAVEL_INICIAL.valor_default,
    }));

    const pecas = (tipologia.pecas || []).map((peca, i) => {
        const p = { ...peca };
        if (p.formula_largura == null && p.formulaLargura != null) p.formula_largura = p.formulaLargura;
        if (p.formula_altura == null && p.formulaAltura != null) p.formula_altura = p.formulaAltura;

        const configsTecnicas = normalizarConfiguracoesTecnicas(p, itensConfiguracaoTecnica);

        return {
            ...PECA_INICIAL,
            ...p,
            id: p.id || `peca_${i}_${Date.now()}`,
            configuracoes_tecnicas: configsTecnicas,
        };
    });

    return {
        nome: tipologia.nome || '',
        descricao: tipologia.descricao || '',
        categoria_id: categoriaId,
        imagens: tipologia.imagens || [],
        variaveis,
        pecas,
        acessorio_ids: acessorioIds,
        tipos_vidro_ids: tiposVidroIds,
        ordem: tipologia.ordem || 0,
        ativo: tipologia.ativo !== false,
    };
}

function normalizarConfiguracoesTecnicas(peca, itensConfiguracaoTecnica) {
    let configsTecnicas = peca.configuracoes_tecnicas ?? peca.configuracoesTecnicas ?? [];
    const itensConfig = peca.itensConfiguracao ?? peca.itens_configuracao ?? [];
    const flatIds = peca.itensConfiguracaoIds ?? peca.tiposConfiguracaoIds ?? peca.tipos_configuracao_ids ?? [];

    if (Array.isArray(itensConfig) && itensConfig.length > 0) {
        const porTipoEObrigatorio = {};
        itensConfig.forEach((entry) => {
            const itemId = entry.itemConfiguracaoId ?? entry.item_configuracao_id ?? entry.id;
            const obrigatorio = entry.obrigatorio ?? false;
            const item = itensConfiguracaoTecnica.find(
                (it) => Number(it.id) === Number(itemId) || it.id === itemId
            );
            const tipoId = item?.tipo_configuracao_id ?? item?.tipoConfiguracaoId;
            if (tipoId != null) {
                const key = `${tipoId}_${obrigatorio}`;
                if (!porTipoEObrigatorio[key]) porTipoEObrigatorio[key] = { categoria: Number(tipoId), itens_ids: [], obrigatorio };
                porTipoEObrigatorio[key].itens_ids.push(Number(itemId));
            }
        });
        return Object.values(porTipoEObrigatorio);
    }

    if (configsTecnicas.length === 0 && Array.isArray(flatIds) && flatIds.length > 0) {
        const porTipo = {};
        flatIds.forEach((itemId) => {
            const item = itensConfiguracaoTecnica.find(
                (it) => Number(it.id) === Number(itemId) || it.id === itemId
            );
            const tipoId = item?.tipo_configuracao_id ?? item?.tipoConfiguracaoId;
            if (tipoId != null) {
                if (!porTipo[tipoId]) porTipo[tipoId] = [];
                porTipo[tipoId].push(Number(itemId));
            }
        });
        return Object.entries(porTipo).map(([categoria, itens_ids]) => ({
            categoria: Number(categoria), itens_ids, obrigatorio: false,
        }));
    }

    return configsTecnicas.map((c) => ({
        ...CONFIGURACAO_TECNICA_INICIAL,
        ...c,
        categoria: c.categoria ?? c.tipoConfiguracaoId ?? '',
        itens_ids: c.itens_ids ?? c.itensIds ?? [],
        obrigatorio: c.obrigatorio ?? false,
    }));
}
