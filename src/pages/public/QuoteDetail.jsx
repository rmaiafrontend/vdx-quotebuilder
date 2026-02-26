import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { entities } from '@/api/api';
import { ArrowLeft, Bell, History, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data para Company
const mockCompany = {
  id: 'comp-1',
  name: 'Vidraçaria Digital Express',
  logo_url: null,
  primary_color: '#1e88e5'
};

const STATUS_CONFIG = {
  approved: { 
    label: 'Aprovado', 
    color: 'bg-green-100 text-green-700'
  },
  rejected: { 
    label: 'Rejeitado', 
    color: 'bg-red-100 text-red-700'
  },
  expired: { 
    label: 'Expirado', 
    color: 'bg-slate-100 text-slate-700'
  },
  pending: {
    label: 'Pendente',
    color: 'bg-amber-100 text-amber-700'
  },
  sent: {
    label: 'Enviado',
    color: 'bg-blue-100 text-blue-700'
  }
};

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer] = useState(() => {
    const saved = localStorage.getItem('customer');
    return saved ? JSON.parse(saved) : null;
  });

  // Buscar orçamento - por enquanto usando mock, depois usar entities.Quote
  const { data: orcamentos = [] } = useQuery({
    queryKey: ['orcamentos'],
    queryFn: () => entities.Orcamento.list()
  });

  const quote = orcamentos.find(o => o.id === id);

  const company = mockCompany;
  const primaryColor = company?.primary_color || localStorage.getItem('company_primary_color') || '#1e88e5';
  const statusConfig = STATUS_CONFIG[quote?.status] || STATUS_CONFIG.pending;

  if (!quote) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h2 className="text-xl font-semibold mb-2">Orçamento não encontrado</h2>
          <p className="text-slate-600 mb-6">Este orçamento não existe ou não está disponível.</p>
          <button
            onClick={() => navigate('/historico')}
            className="text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            Voltar ao Histórico
          </button>
        </Card>
      </div>
    );
  }

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
            Detalhes do Orçamento
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
          onClick={() => navigate('/historico')}
          className="flex items-center gap-1.5 mb-5 text-sm font-medium hover:opacity-70 transition-opacity"
          style={{ color: primaryColor }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        {/* Quote Info */}
        <Card className="mb-5 rounded-2xl border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-lg tracking-tight">
                {quote.numero || 'Orçamento'}
              </CardTitle>
              <Badge className={`${statusConfig.color} shrink-0`}>
                {statusConfig.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quote.tipologia_nome && (
                <div className="rounded-xl bg-slate-50 p-3.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Produto</p>
                  <p className="font-semibold text-slate-900 text-sm">{quote.tipologia_nome}</p>
                </div>
              )}

              {quote.tipo_vidro_nome && (
                <div className="rounded-xl bg-slate-50 p-3.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Tipo de Vidro</p>
                  <p className="font-semibold text-slate-900 text-sm">{quote.tipo_vidro_nome}</p>
                </div>
              )}

              {quote.created_date && (
                <div className="rounded-xl bg-slate-50 p-3.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Criado em</p>
                  <p className="font-semibold text-slate-900 text-sm">
                    {format(new Date(quote.created_date), "dd 'de' MMM 'de' yyyy · HH:mm", { locale: ptBR })}
                  </p>
                </div>
              )}
            </div>

            {quote.preco_total != null && (
              <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Valor Total</span>
                <span className="text-2xl font-bold tabular-nums" style={{ color: primaryColor }}>
                  R$ {Number(quote.preco_total).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        {quote.history && quote.history.length > 0 && (
          <Card className="rounded-2xl border-slate-200/80 shadow-sm overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                <CardTitle className="text-base">Histórico</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 space-y-4">
                <span className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-slate-200 rounded-full" />
                {quote.history
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((entry, index) => (
                    <div key={index} className="relative">
                      <span
                        className="absolute -left-6 top-3 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: index === 0 ? primaryColor : '#cbd5e1' }}
                      />
                      <div className="rounded-xl bg-slate-50 p-3.5">
                        <p className="text-sm font-medium text-slate-900">{entry.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-slate-500">
                            {format(new Date(entry.date), "dd MMM yyyy · HH:mm", { locale: ptBR })}
                          </p>
                          {entry.user && (
                            <>
                              <span className="text-xs text-slate-300">·</span>
                              <p className="text-xs text-slate-500">{entry.user}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
