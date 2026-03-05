import { useState, useMemo, useEffect } from 'react';
import { entities } from '@/api/api';
import { useQuery } from '@tanstack/react-query';
import { calcularPecas, calcularPreco } from '@/components/utils/calculoUtils';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook compartilhado com toda a lógica base do wizard de orçamento.
 * Usado por NovoOrcamento (admin) e OrcamentoPublico (public).
 */
export function useOrcamentoBase() {
    const [etapaAtual, setEtapaAtual] = useState(1);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const [tipologiaSelecionada, setTipologiaSelecionada] = useState(null);
    const [variaveisPreenchidas, setVariaveisPreenchidas] = useState([]);
    const [pecasCalculadas, setPecasCalculadas] = useState([]);
    const [pecaConferenciaAtual, setPecaConferenciaAtual] = useState(0);
    const [tipoVidroSelecionado, setTipoVidroSelecionado] = useState(null);
    const [clienteInfo, setClienteInfo] = useState({ nome: '', telefone: '', email: '' });
    const [unidadeOriginal, setUnidadeOriginal] = useState('cm');
    const [totais, setTotais] = useState({ areaTotalRealM2: 0, areaTotalCobrancaM2: 0 });

    // --- Queries ---
    const { data: categorias = [] } = useQuery({
        queryKey: ['categorias'],
        queryFn: () => entities.Categoria.filter({ ativo: true }, 'ordem')
    });

    const categoriaId = categoriaSelecionada?.id;
    const { data: tipologiasDaCategoria = [], isLoading: loadingTipologias } = useQuery({
        queryKey: ['tipologias', 'categoria', categoriaId],
        queryFn: async () => {
            const list = await entities.Tipologia.listByCategoria(categoriaId, 'ordem');
            return (list || []).filter((t) => t?.ativo !== false);
        },
        enabled: !!categoriaId,
    });

    const tipologiaIdSelecionado = tipologiaSelecionada?.id;
    const { data: tipologiaCompleta, isLoading: loadingTipologiaCompleta } = useQuery({
        queryKey: ['tipologia', tipologiaIdSelecionado],
        queryFn: () => entities.Tipologia.getById(tipologiaIdSelecionado),
        enabled: !!tipologiaIdSelecionado,
    });

    // Normalizar tipologia completa ao carregar
    useEffect(() => {
        if (!tipologiaCompleta || tipologiaCompleta.id !== tipologiaIdSelecionado) return;
        const pecas = (tipologiaCompleta.pecas || []).map((p) => ({
            ...p,
            formula_largura: p.formula_largura ?? p.formulaLargura ?? '',
            formula_altura: p.formula_altura ?? p.formulaAltura ?? '',
            configuracoes_tecnicas: p.configuracoes_tecnicas ?? p.configuracoesTecnicas ?? [],
        }));
        const tipologiaNormalizada = {
            ...tipologiaCompleta,
            pecas,
            tipos_vidro_ids: tipologiaCompleta.tipos_vidro_ids ?? tipologiaCompleta.tiposVidroIds ?? [],
            acessorio_ids: tipologiaCompleta.acessorio_ids ?? tipologiaCompleta.acessorioIds ?? [],
        };
        setTipologiaSelecionada(tipologiaNormalizada);
        const getUnidade = (v) => v?.unidade_padrao ?? v?.unidadePadrao ?? 'cm';
        const vars = (tipologiaCompleta.variaveis || []).map((v) => ({
            ...v,
            valor: '',
            unidade: getUnidade(v),
            unidade_padrao: getUnidade(v),
        }));
        setVariaveisPreenchidas(vars);
    }, [tipologiaCompleta, tipologiaIdSelecionado]);

    const { data: tiposVidroTecnicos = [] } = useQuery({
        queryKey: ['tiposVidroTecnicos'],
        queryFn: () => entities.TipoVidroTecnico.filter({ ativo: true }, 'ordem')
    });

    const { data: produtos = [] } = useQuery({
        queryKey: ['produtos'],
        queryFn: () => entities.Produto.filter({ ativo: true }, 'ordem')
    });

    // Filtrar tipos de vidro baseado na tipologia
    const tiposVidroDisponiveis = useMemo(() => {
        const tiposVidroIds = tipologiaSelecionada?.tiposVidroIds ?? tipologiaSelecionada?.tipos_vidro_ids ?? [];
        if (tiposVidroIds.length > 0) {
            return tiposVidroTecnicos.filter(tipo => tiposVidroIds.includes(tipo.id));
        }
        return tiposVidroTecnicos;
    }, [tipologiaSelecionada, tiposVidroTecnicos]);

    // Itens de configuração técnica (placeholder)
    const itensConfiguracao = useMemo(() => ({}), []);

    // --- Handlers ---
    const selecionarTipologia = (tipologia) => {
        setTipologiaSelecionada(tipologia);
        const getUnidade = (v) => v?.unidade_padrao ?? v?.unidadePadrao ?? 'cm';
        const vars = tipologia.variaveis?.map(v => ({
            ...v,
            valor: '',
            unidade: getUnidade(v),
            unidade_padrao: getUnidade(v),
        })) || [];
        setVariaveisPreenchidas(vars);
    };

    const atualizarVariavel = (index, { valor, unidade }) => {
        const novasVars = [...variaveisPreenchidas];
        novasVars[index] = { ...novasVars[index], valor, unidade };
        setVariaveisPreenchidas(novasVars);
        if (valor !== '') {
            setUnidadeOriginal(unidade);
        }
    };

    const executarCalculo = (etapaConferencia = 3) => {
        if (!tipologiaSelecionada) return;
        const resultado = calcularPecas(tipologiaSelecionada, variaveisPreenchidas);
        if (resultado.erros?.length > 0) {
            toast({
                title: "Erro no cálculo das peças",
                description: resultado.erros.map((e) => e.mensagem).join("\n"),
                variant: "destructive"
            });
            return;
        }
        setPecasCalculadas(resultado.pecas);
        setTotais({
            areaTotalRealM2: resultado.areaTotalRealM2,
            areaTotalCobrancaM2: resultado.areaTotalCobrancaM2
        });
        setPecaConferenciaAtual(0);
        setEtapaAtual(etapaConferencia);
    };

    const confirmarPeca = (index, etapaPosFinalizar = 4) => {
        const novasPecas = [...pecasCalculadas];
        novasPecas[index] = { ...novasPecas[index], conferido: true };
        setPecasCalculadas(novasPecas);
        if (index < pecasCalculadas.length - 1) {
            setPecaConferenciaAtual(index + 1);
        } else {
            setEtapaAtual(etapaPosFinalizar);
        }
    };

    const atualizarConfiguracaoTecnicaPeca = (pecaIndex, configIndex, valor) => {
        const novasPecas = [...pecasCalculadas];
        const peca = novasPecas[pecaIndex];
        if (!peca.configuracoes_tecnicas) peca.configuracoes_tecnicas = [];
        if (!peca.configuracoes_tecnicas[configIndex]) {
            peca.configuracoes_tecnicas[configIndex] = { valor: '' };
        }
        peca.configuracoes_tecnicas[configIndex] = {
            ...peca.configuracoes_tecnicas[configIndex],
            valor
        };
        setPecasCalculadas(novasPecas);
    };

    const obterConfiguracoesTecnicasPeca = (pecaCalculada) => {
        if (!tipologiaSelecionada) return [];
        const pecaTipologia = tipologiaSelecionada.pecas?.find(
            p => p.nome === pecaCalculada.nome
        );
        return pecaTipologia?.configuracoes_tecnicas || [];
    };

    const precoFinal = useMemo(() => {
        if (!tipoVidroSelecionado) return 0;
        return calcularPreco(totais.areaTotalCobrancaM2, tipoVidroSelecionado.preco_m2);
    }, [totais.areaTotalCobrancaM2, tipoVidroSelecionado]);

    const variaveisCompletas = useMemo(() => {
        return variaveisPreenchidas.every(v => v.valor !== '' && v.valor !== null && Number.isFinite(Number(v.valor)));
    }, [variaveisPreenchidas]);

    const resetWizard = () => {
        setCategoriaSelecionada(null);
        setTipologiaSelecionada(null);
        setVariaveisPreenchidas([]);
        setPecasCalculadas([]);
        setTipoVidroSelecionado(null);
        setClienteInfo({ nome: '', telefone: '', email: '' });
        setUnidadeOriginal('cm');
        setTotais({ areaTotalRealM2: 0, areaTotalCobrancaM2: 0 });
        setPecaConferenciaAtual(0);
        setEtapaAtual(1);
    };

    return {
        // State
        etapaAtual, setEtapaAtual,
        categoriaSelecionada, setCategoriaSelecionada,
        tipologiaSelecionada, setTipologiaSelecionada,
        variaveisPreenchidas, setVariaveisPreenchidas,
        pecasCalculadas, setPecasCalculadas,
        pecaConferenciaAtual, setPecaConferenciaAtual,
        tipoVidroSelecionado, setTipoVidroSelecionado,
        clienteInfo, setClienteInfo,
        unidadeOriginal,
        totais,
        precoFinal,
        variaveisCompletas,

        // Queries data
        categorias,
        tipologiasDaCategoria,
        loadingTipologias,
        loadingTipologiaCompleta,
        tiposVidroDisponiveis,
        produtos,
        itensConfiguracao,

        // Handlers
        selecionarTipologia,
        atualizarVariavel,
        executarCalculo,
        confirmarPeca,
        atualizarConfiguracaoTecnicaPeca,
        obterConfiguracoesTecnicasPeca,
        resetWizard,
    };
}
