import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { entities } from '@/api/api';
import { 
  Plus, 
  FileText, 
  Clock, 
  Bell,
  MessageCircle,
  ChevronRight,
  LogOut
} from 'lucide-react';

// Mock data para Company
const mockCompany = {
  id: 'comp-1',
  name: 'Vidraçaria Digital Express',
  logo_url: null,
  primary_color: '#1e88e5'
};

// Mock data para QuoteTypes
const mockQuoteTypes = [
  {
    id: 'qt-1',
    name: 'Orçamento de Vidraçaria',
    slug: 'vidracaria',
    status: 'published'
  }
];

export default function Home() {
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
  const quoteTypes = mockQuoteTypes.filter(qt => qt.status === 'published');
  
  // Converter orçamentos para formato de Quote
  const customerQuotes = allOrcamentos.map(orc => ({
    id: orc.id,
    status: orc.status === 'concluido' ? 'approved' : 
            orc.status === 'cancelado' ? 'rejected' : 
            orc.status === 'rascunho' ? 'draft' :
            orc.status === 'aguardando_aprovacao' ? 'pending' : 
            orc.status === 'aguardando_pagamento' ? 'sent' : 
            orc.status === 'em_producao' ? 'sent' : 
            orc.status === 'aguardando_retirada' ? 'sent' : 'draft',
    customer_id: orc.cliente_email
  }));

  // Cache company colors
  React.useEffect(() => {
    if (company?.primary_color) {
      localStorage.setItem('company_primary_color', company.primary_color);
    }
  }, [company?.primary_color]);

  // Calculate quote counts
  const openQuotesCount = useMemo(() => {
    return customerQuotes.filter(q => ['draft', 'pending', 'sent'].includes(q.status)).length;
  }, [customerQuotes]);

  const completedQuotesCount = useMemo(() => {
    return customerQuotes.filter(q => ['approved', 'rejected', 'expired'].includes(q.status)).length;
  }, [customerQuotes]);

  // Get greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const handleLogout = () => {
    localStorage.removeItem('customer');
    navigate('/');
  };

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
        <div className="flex items-center gap-0.5">
          <button
            className="relative p-2.5 hover:bg-white/15 rounded-xl transition-colors"
            onClick={() => navigate('/admin/dashboard')}
          >
            <Bell className="w-5 h-5 text-white/90" />
            {openQuotesCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-400 rounded-full ring-2 ring-white/30" />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="p-2.5 hover:bg-white/15 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 text-white/90" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Greeting */}
        <div className="mb-6">
          <p className="text-slate-500 text-sm">{getGreeting()}</p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            {customer?.name?.split(' ')[0] || 'Bem-vindo'}
          </h2>
        </div>

        {/* CTA - Novo Orçamento */}
        <button
          className="w-full mb-6 p-5 rounded-2xl text-left transition-all hover:brightness-110 active:scale-[0.98] shadow-lg ring-1 ring-black/5"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}
          onClick={() => {
            if (quoteTypes.length === 0) {
              alert('Nenhum tipo de orçamento disponível no momento.');
            } else {
              navigate('/orcamento');
            }
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 ring-1 ring-white/20">
              <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-base">Novo Orçamento</h3>
              <p className="text-white/70 text-sm mt-0.5">Solicitar nova cotação</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50 shrink-0" />
          </div>
        </button>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            className="p-4 rounded-2xl bg-white border border-slate-200/80 text-left transition-all hover:shadow-md hover:border-slate-300/60 active:scale-[0.98] shadow-sm"
            onClick={() => navigate('/em-aberto')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              {openQuotesCount > 0 && (
                <span className="min-w-[24px] h-6 px-2 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                  {openQuotesCount}
                </span>
              )}
            </div>
            <h3 className="text-slate-900 font-semibold text-sm">Em Aberto</h3>
            <p className="text-slate-500 text-xs mt-0.5">Acompanhar pedidos</p>
          </button>

          <button
            className="p-4 rounded-2xl bg-white border border-slate-200/80 text-left transition-all hover:shadow-md hover:border-slate-300/60 active:scale-[0.98] shadow-sm"
            onClick={() => navigate('/historico')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              {completedQuotesCount > 0 && (
                <span className="min-w-[24px] h-6 px-2 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                  {completedQuotesCount}
                </span>
              )}
            </div>
            <h3 className="text-slate-900 font-semibold text-sm">Histórico</h3>
            <p className="text-slate-500 text-xs mt-0.5">Finalizados</p>
          </button>
        </div>

        {/* Help Card */}
        <button
          className="w-full p-4 rounded-2xl bg-white border border-slate-200/80 text-left transition-all hover:shadow-md hover:border-slate-300/60 active:scale-[0.98] shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-900 font-semibold text-sm">Precisa de ajuda?</h3>
              <p className="text-slate-500 text-xs mt-0.5">Fale conosco no WhatsApp</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </button>
      </div>
    </div>
  );
}
