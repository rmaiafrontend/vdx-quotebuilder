import React, { useState, useMemo, createContext, useContext, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { entities } from '@/api/api';
import { calcularPreco } from '@/components/utils/calculoUtils';

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
    const carrinho = useCarrinhoInternal();
    return (
        <CarrinhoContext.Provider value={carrinho}>
            {children}
        </CarrinhoContext.Provider>
    );
}

export function useCarrinho() {
    const ctx = useContext(CarrinhoContext);
    if (ctx) return ctx;
    return useCarrinhoInternal();
}

function useCarrinhoInternal() {
    const [carrinho, setCarrinho] = useState([]);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [clienteInfo, setClienteInfo] = useState({ nome: '', telefone: '', email: '' });
    const [orcamentoSalvo, setOrcamentoSalvo] = useState(false);

    const precoTotalCarrinho = useMemo(() => {
        return Math.round(carrinho.reduce((sum, item) => sum + item.preco_total_item, 0) * 100) / 100;
    }, [carrinho]);

    const salvarMutation = useMutation({
        mutationFn: (/** @type {any} */ payload) => entities.Orcamento.createAsVidraceiro(payload),
        onSuccess: () => {
            setCarrinho([]);
            setOrcamentoSalvo(true);
        },
    });

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

    const adicionarAoCarrinho = useCallback((dadosItem) => {
        const item = criarItemCarrinho(dadosItem);
        setCarrinho(prev => [...prev, item]);
        return item;
    }, []);

    const removerDoCarrinho = useCallback((itemId) => {
        setCarrinho(prev => prev.filter(item => item.id !== itemId));
    }, []);

    const limparCarrinho = useCallback(() => setCarrinho([]), []);

    const salvarOrcamento = useCallback(() => {
        const payload = {
            cliente_nome: clienteInfo.nome,
            cliente_telefone: clienteInfo.telefone,
            cliente_email: clienteInfo.email || null,
            itens: carrinho.map(item => ({
                tipologia_id: item.tipologia_id,
                tipologia_nome: item.tipologia_nome,
                tipo_vidro_id: item.tipo_vidro_id,
                tipo_vidro_nome: item.tipo_vidro_nome,
                variaveis_entrada: item.variaveis_entrada,
                pecas_calculadas: item.pecas_calculadas,
                acessorios_selecionados: item.acessorios_selecionados,
                area_total_real_m2: item.area_total_real_m2,
                preco_m2: item.preco_m2,
                preco_total: Number.isFinite(item.preco_total_item) ? item.preco_total_item : 0,
            })),
        };
        salvarMutation.mutate(payload);
    }, [clienteInfo, carrinho]);

    const podeEnviar = carrinho.length > 0 && clienteInfo.nome && clienteInfo.telefone;

    const resetCarrinho = useCallback(() => {
        setCarrinho([]);
        setClienteInfo({ nome: '', telefone: '', email: '' });
        setOrcamentoSalvo(false);
    }, []);

    return {
        carrinho,
        setCarrinho,
        precoTotalCarrinho,
        adicionarAoCarrinho,
        removerDoCarrinho,
        limparCarrinho,
        criarItemCarrinho,
        // Drawer
        isDrawerOpen,
        setDrawerOpen,
        // Checkout
        clienteInfo,
        setClienteInfo,
        salvarOrcamento,
        salvarMutation,
        podeEnviar,
        orcamentoSalvo,
        setOrcamentoSalvo,
        resetCarrinho,
    };
}
