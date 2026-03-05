/**
 * Converte status do backend (UPPERCASE) para formato do frontend (en).
 */
export function convertStatusToFrontend(backendStatus) {
    const map = {
        AGUARDANDO_APROVACAO: 'pending',
        AGUARDANDO_PAGAMENTO: 'sent',
        EM_PRODUCAO: 'sent',
        AGUARDANDO_RETIRADA: 'approved',
        CANCELADO: 'rejected',
    };
    return map[backendStatus] || 'pending';
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
