/**
 * Converte status do backend (pt-BR) para formato do frontend (en).
 */
export function convertStatusToFrontend(backendStatus) {
    const map = {
        concluido: 'approved',
        cancelado: 'rejected',
        rascunho: 'draft',
        aguardando_aprovacao: 'pending',
        aguardando_pagamento: 'sent',
        em_producao: 'sent',
        aguardando_retirada: 'sent',
    };
    return map[backendStatus] || 'draft';
}

/**
 * Converte um orçamento do backend para o formato de Quote do frontend.
 */
export function orcamentoToQuote(orc) {
    return {
        id: orc.id,
        quote_number: orc.numero,
        quote_type_name: orc.tipologia_nome,
        status: convertStatusToFrontend(orc.status),
        total_value: orc.preco_total,
        created_date: orc.created_date,
        customer_id: orc.cliente_email,
    };
}
