import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2, XCircle, Clock, ChevronRight, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STATUS_CONFIG = {
  approved: {
    label: 'Aprovado',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-100 text-emerald-700',
    accentColor: '#10b981',
    icon: CheckCircle2
  },
  rejected: {
    label: 'Rejeitado',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    badgeBg: 'bg-red-100 text-red-700',
    accentColor: '#ef4444',
    icon: XCircle
  },
  expired: {
    label: 'Expirado',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-600',
    badgeBg: 'bg-slate-100 text-slate-600',
    accentColor: '#94a3b8',
    icon: Clock
  },
  pending: {
    label: 'Aguardando',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    badgeBg: 'bg-amber-100 text-amber-700',
    accentColor: '#f59e0b',
    icon: Clock
  },
  sent: {
    label: 'Em Andamento',
    bgColor: 'bg-[#1a3a8f]/10',
    textColor: 'text-[#1a3a8f]',
    badgeBg: 'bg-[#1a3a8f]/15 text-[#1a3a8f]',
    accentColor: '#1a3a8f',
    icon: Send
  },
  draft: {
    label: 'Rascunho',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-600',
    badgeBg: 'bg-slate-100 text-slate-600',
    accentColor: '#94a3b8',
    icon: FileText
  }
};

export default function QuoteCard({ quote, primaryColor }) {
  const navigate = useNavigate();
  const config = STATUS_CONFIG[quote.status] || STATUS_CONFIG.expired;
  const StatusIcon = config.icon;

  return (
    <div
      className="relative cursor-pointer bg-white rounded-2xl shadow-md ring-1 ring-black/[0.04] hover:shadow-lg hover:scale-[1.005] transition-all duration-200 active:scale-[0.98] overflow-hidden"
      onClick={() => navigate(`/orcamento/${quote.id}`)}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ backgroundColor: config.accentColor }}
      />

      <div className="flex items-center gap-3.5 p-4 pl-5">
        {/* Status icon */}
        <div
          className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${config.bgColor}`}
        >
          <StatusIcon className={`w-5 h-5 ${config.textColor}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-slate-900 truncate">
              {quote.quote_number || quote.quote_type_name || 'Orcamento'}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`${config.badgeBg} text-[11px] px-2 py-0.5 font-medium`}>
              {config.label}
            </Badge>
            {quote.created_date && (
              <span className="text-[11px] text-slate-400 font-medium">
                {format(new Date(quote.created_date), "dd MMM yyyy", { locale: ptBR })}
              </span>
            )}
          </div>
        </div>

        {/* Price + Arrow */}
        <div className="flex items-center gap-2 shrink-0">
          {quote.total_value != null && (
            <span className="text-sm font-bold tabular-nums whitespace-nowrap" style={{ color: primaryColor }}>
              R$ {Number(quote.total_value).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          )}
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </div>
      </div>
    </div>
  );
}
