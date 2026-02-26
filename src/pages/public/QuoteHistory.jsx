import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { entities } from '@/api/api';
import { ArrowLeft, Bell, FileText, Clock } from 'lucide-react';
import QuoteCard from '@/components/quotes/QuoteCard';

// Mock data para Company
const mockCompany = {
  id: 'comp-1',
  name: 'Vidraçaria Digital Express',
  logo_url: null,
  primary_color: '#1e88e5'
};

export default function QuoteHistory() {
  const navigate = useNavigate();
  const [customer] = useState(() => {
    const saved = localStorage.getItem('customer');
    return saved ? JSON.parse(saved) : null;
  });

  // Buscar orçamentos
  const { data: allOrcamentos = [] } = useQuery({
    queryKey: ['orcamentos'],
    queryFn: () => entities.Orcamento.list()
  });

  // Usar dados mockados
  const company = mockCompany;
  
  // Filtrar orçamentos do cliente e converter para formato de Quote
  // Por enquanto, mostrar todos os orçamentos finalizados como exemplo
  const completedQuotes = allOrcamentos
    .filter(q => ['concluido', 'cancelado'].includes(q.status))
    .map(orc => ({
      id: orc.id,
      quote_number: orc.numero,
      quote_type_name: orc.tipologia_nome,
      status: orc.status === 'concluido' ? 'approved' : 'rejected',
      total_value: orc.preco_total,
      created_date: orc.created_date,
      customer_id: orc.cliente_email // Usar email como identificador temporário
    }));

  React.useEffect(() => {
    if (company?.primary_color) {
      localStorage.setItem('company_primary_color', company.primary_color);
    }
  }, [company?.primary_color]);

  const primaryColor = company?.primary_color || localStorage.getItem('company_primary_color') || '#1e88e5';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header
        className="px-5 py-4 flex items-center justify-between shadow-md"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}
      >
        <div className="flex items-center gap-3">
          {company?.logo_url ? (
            <img src={company.logo_url} alt={company.name} className="w-10 h-10 rounded-xl bg-white p-1 object-cover shadow-sm" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30">
              <span className="font-bold text-lg text-white">
                {company?.name?.charAt(0) || 'V'}
              </span>
            </div>
          )}
          <h1 className="text-white font-semibold text-lg tracking-tight">
            {company?.name || 'Orçamentos'}
          </h1>
        </div>
        <button className="relative p-2.5 hover:bg-white/15 rounded-xl transition-colors">
          <Bell className="w-5 h-5 text-white/90" />
        </button>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 mb-5 text-sm font-medium hover:opacity-70 transition-opacity"
          style={{ color: primaryColor }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        {/* Title */}
        <div className="mb-5 p-5 rounded-2xl bg-white shadow-sm border border-slate-200/80">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${primaryColor}12` }}
            >
              <Clock className="w-6 h-6" style={{ color: primaryColor }} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Histórico</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {completedQuotes.length === 0
                  ? 'Nenhum orçamento finalizado'
                  : `${completedQuotes.length} orçamento${completedQuotes.length > 1 ? 's' : ''} finalizado${completedQuotes.length > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {completedQuotes.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl shadow-sm border border-dashed border-slate-200">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-700 mb-1">Nenhum histórico</h3>
              <p className="text-sm text-slate-500 mb-6">Seus orçamentos finalizados aparecerão aqui</p>
              <button
                onClick={() => navigate('/orcamento')}
                className="text-white px-6 py-2.5 rounded-xl font-medium hover:brightness-110 transition-all active:scale-[0.98] shadow-md"
                style={{ backgroundColor: primaryColor }}
              >
                Novo Orçamento
              </button>
            </div>
          ) : (
            completedQuotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} primaryColor={primaryColor} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
