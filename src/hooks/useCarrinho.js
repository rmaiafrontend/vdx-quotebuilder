import { useState, useMemo } from 'react';
import { calcularPreco } from '@/components/utils/calculoUtils';

/**
 * Hook para gerenciar o carrinho de orçamento público.
 */
export function useCarrinho() {
    const [carrinho, setCarrinho] = useState([]);

    const precoTotalCarrinho = useMemo(() => {
        return carrinho.reduce((sum, item) => sum + item.preco_total_item, 0);
    }, [carrinho]);

    const criarItemCarrinho = ({ tipologiaSelecionada, tipoVidroSelecionado, variaveisPreenchidas, pecasCalculadas, acessoriosSelecionados, totais, precoAcessorios }) => {
        const precoVidro = calcularPreco(totais.areaTotalCobrancaM2, tipoVidroSelecionado.preco_m2);
        return {
            id: Date.now(),
            tipologia_id: tipologiaSelecionada.id,
            tipologia_nome: tipologiaSelecionada.nome,
            tipo_vidro_id: tipoVidroSelecionado.id,
            tipo_vidro_nome: tipoVidroSelecionado.nome,
            tipo_vidro_cor: tipoVidroSelecionado.cor,
            variaveis_entrada: variaveisPreenchidas.map(v => ({
                nome: v.nome, label: v.label, valor: v.valor, unidade: v.unidade
            })),
            pecas_calculadas: pecasCalculadas.map(p => ({ ...p })),
            acessorios_selecionados: acessoriosSelecionados.map(a => ({ ...a })),
            area_total_real_m2: totais.areaTotalRealM2,
            area_total_cobranca_m2: totais.areaTotalCobrancaM2,
            preco_m2: tipoVidroSelecionado.preco_m2,
            preco_vidro: precoVidro,
            preco_acessorios: precoAcessorios,
            preco_total_item: precoVidro + precoAcessorios
        };
    };

    const adicionarAoCarrinho = (dadosItem) => {
        const item = criarItemCarrinho(dadosItem);
        setCarrinho(prev => [...prev, item]);
        return item;
    };

    const removerDoCarrinho = (itemId) => {
        setCarrinho(prev => prev.filter(item => item.id !== itemId));
    };

    const limparCarrinho = () => setCarrinho([]);

    return {
        carrinho,
        setCarrinho,
        precoTotalCarrinho,
        adicionarAoCarrinho,
        removerDoCarrinho,
        limparCarrinho,
        criarItemCarrinho,
    };
}
