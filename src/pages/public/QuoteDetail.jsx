import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { entities } from '@/api/api';
import { motion } from 'framer-motion';
import { ArrowLeft, History, FileText, Calendar, Layers, Palette, DollarSign, CheckCircle2, XCircle, Clock, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PublicHeader from '@/components/public/PublicHeader';
import { useCompanyTheme } from '@/hooks/useCompanyTheme';

const STATUS_CONFIG = {
  AGUARDANDO_APROVACAO: { label: 'Aguardando Aprovação', bgColor: 'bg-amber-100', textColor: 'text-amber-700', gradientFrom: '#f59e0b', gradientTo: '#d97706', icon: Clock },
  AGUARDANDO_PAGAMENTO: { label: 'Aguardando Pagamento', bgColor: 'bg-orange-100', textColor: 'text-orange-700', gradientFrom: '#f97316', gradientTo: '#ea580c', icon: Clock },
  EM_PRODUCAO: { label: 'Em Produção', bgColor: 'bg-blue-100', textColor: 'text-blue-700', gradientFrom: '#3b82f6', gradientTo: '#2563eb', icon: Send },
  AGUARDANDO_RETIRADA: { label: 'Pronto para Retirada', bgColor: 'bg-emerald-100', textColor: 'text-emerald-700', gradientFrom: '#10b981', gradientTo: '#059669', icon: CheckCircle2 },
  CANCELADO: { label: 'Cancelado', bgColor: 'bg-red-100', textColor: 'text-red-700', gradientFrom: '#ef4444', gradientTo: '#dc2626', icon: XCircle },
};

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { company, primaryColor } = useCompanyTheme();

  const { data: quote } = useQuery({
    queryKey: ['vidraceiro-orcamento', id],
    queryFn: () => entities.Orcamento.getMyQuote(id),
    enabled: !!id,
  });

  const statusConfig = STATUS_CONFIG[quote?.status] || STATUS_CONFIG.AGUARDANDO_APROVACAO;
  const StatusIcon = statusConfig.icon;

  if (!quote) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 text-center max-w-md bg-white rounded-2xl shadow-lg ring-1 ring-black/[0.04]"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Orcamento nao encontrado</h2>
          <p className="text-slate-500 mb-6">Este orcamento nao existe ou nao esta disponivel.</p>
          <button
            onClick={() => navigate('/historico')}
            className="text-white px-6 py-2.5 rounded-xl font-semibold hover:brightness-110 transition-all active:scale-[0.98] shadow-lg"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}
          >
            Voltar ao Historico
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      <PublicHeader company={company} primaryColor={primaryColor} />

      {/* Status Header */}
      <div
        className="relative px-5 pt-5 pb-12 overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${statusConfig.gradientFrom}15, ${statusConfig.gradientTo}08)` }}
      >
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate('/historico')} className="flex items-center gap-1.5 mb-4 text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: primaryColor }}>
            <ArrowLeft className="w-4 h-4" /><span>Voltar</span>
          </button>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{quote.numero || 'Orcamento'}</h2>
              {quote.tipologia_nome && (
                <p className="text-sm text-slate-500 mt-0.5">{quote.tipologia_nome}</p>
              )}
            </div>
            <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} px-3 py-1.5 text-xs font-semibold rounded-lg`}>
              <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
              {statusConfig.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-4 max-w-2xl mx-auto -mt-6 pb-8 space-y-4"
      >
        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          {quote.tipologia_nome && (
            <div className="p-4 bg-white rounded-2xl shadow-md ring-1 ring-black/[0.04]">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-2.5">
                <Layers className="w-4.5 h-4.5 text-blue-600" />
              </div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-0.5">Produto</p>
              <p className="font-semibold text-slate-900 text-sm">{quote.tipologia_nome}</p>
            </div>
          )}
          {quote.tipo_vidro_nome && (
            <div className="p-4 bg-white rounded-2xl shadow-md ring-1 ring-black/[0.04]">
              <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center mb-2.5">
                <Palette className="w-4.5 h-4.5 text-violet-600" />
              </div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-0.5">Tipo de Vidro</p>
              <p className="font-semibold text-slate-900 text-sm">{quote.tipo_vidro_nome}</p>
            </div>
          )}
          {quote.created_date && (
            <div className="p-4 bg-white rounded-2xl shadow-md ring-1 ring-black/[0.04]">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mb-2.5">
                <Calendar className="w-4.5 h-4.5 text-amber-600" />
              </div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-0.5">Criado em</p>
              <p className="font-semibold text-slate-900 text-sm">
                {format(new Date(quote.created_date), "dd 'de' MMM yyyy", { locale: ptBR })}
              </p>
            </div>
          )}
        </div>

        {/* Price Card */}
        {quote.preco_total != null && (
          <div
            className="p-5 rounded-2xl text-white shadow-lg overflow-hidden relative"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA3KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-60" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Valor Total</p>
                <p className="text-3xl font-bold tabular-nums mt-1">
                  R$ {Number(quote.preco_total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white/80" />
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        {quote.history && quote.history.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md ring-1 ring-black/[0.04] overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <History className="w-4 h-4 text-slate-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Historico</h3>
            </div>
            <div className="px-5 pb-5">
              <div className="relative pl-6 space-y-3">
                <span className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-slate-200 to-slate-100 rounded-full" />
                {quote.history.sort((a, b) => new Date(b.date) - new Date(a.date)).map((entry, index) => (
                  <div key={index} className="relative">
                    <span
                      className="absolute -left-6 top-3 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: index === 0 ? primaryColor : '#e2e8f0' }}
                    />
                    <div className={`rounded-xl p-3.5 ${index === 0 ? 'bg-slate-50 ring-1 ring-slate-200/50' : 'bg-slate-50/50'}`}>
                      <p className="text-sm font-medium text-slate-900">{entry.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-slate-400">{format(new Date(entry.date), "dd MMM yyyy · HH:mm", { locale: ptBR })}</p>
                        {entry.user && (<><span className="text-xs text-slate-300">·</span><p className="text-xs text-slate-400">{entry.user}</p></>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
