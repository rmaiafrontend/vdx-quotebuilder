import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2, XCircle, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STATUS_CONFIG = {
  // Status finais (histórico)
  approved: { 
    label: 'Aprovado', 
    color: 'bg-green-100 text-green-700', 
    icon: CheckCircle2 
  },
  rejected: { 
    label: 'Rejeitado', 
    color: 'bg-red-100 text-red-700', 
    icon: XCircle 
  },
  expired: { 
    label: 'Expirado', 
    color: 'bg-slate-100 text-slate-700', 
    icon: Clock 
  },
  // Status em aberto
  pending: {
    label: 'Aguardando Aprovação',
    color: 'bg-amber-100 text-amber-700',
    icon: Clock
  },
  sent: {
    label: 'Em Andamento',
    color: 'bg-blue-100 text-blue-700',
    icon: Clock
  },
  draft: {
    label: 'Rascunho',
    color: 'bg-slate-100 text-slate-700',
    icon: FileText
  }
};

export default function QuoteCard({ quote, primaryColor }) {
  const navigate = useNavigate();
  const statusConfig = STATUS_CONFIG[quote.status] || STATUS_CONFIG.expired;
  const StatusIcon = statusConfig.icon;

  const handleClick = () => {
    navigate(`/orcamento/${quote.id}`);
  };

  return (
    <Card
      className="cursor-pointer border-slate-200/80 bg-white rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all duration-200 active:scale-[0.98] overflow-hidden"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-3 p-4">
          <div className="shrink-0 w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-slate-500" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-semibold text-slate-900 truncate">
                {quote.quote_number || quote.quote_type_name || 'Orçamento'}
              </span>
            </div>
            {quote.quote_type_name && (
              <p className="text-xs text-slate-500 truncate">{quote.quote_type_name}</p>
            )}
          </div>

          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
        </div>

        <div className="flex items-center justify-between gap-3 px-4 pb-4 pt-0">
          <div className="flex items-center gap-2">
            <Badge className={`${statusConfig.color} text-xs`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </Badge>
            {quote.created_date && (
              <span className="text-xs text-slate-400">
                {format(new Date(quote.created_date), "dd MMM yyyy", { locale: ptBR })}
              </span>
            )}
          </div>

          {quote.total_value != null && (
            <span className="text-sm font-bold tabular-nums whitespace-nowrap" style={{ color: primaryColor }}>
              R$ {Number(quote.total_value).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
