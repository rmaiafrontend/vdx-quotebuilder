import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { entities } from '@/api/api';
import { motion } from 'framer-motion';
import {
  ArrowLeft, History, FileText, Calendar, Layers, Palette, DollarSign,
  CheckCircle2, XCircle, Clock, Send, User, Phone, Mail, Ruler,
  Package, CreditCard, Truck, Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCompanyTheme } from '@/hooks/useCompanyTheme';
import { formatarMedida } from '@/components/utils/calculoUtils';

const STATUS_CONFIG = {
  AGUARDANDO_APROVACAO: { label: 'Aguardando Aprovação', bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200', dotColor: 'bg-amber-400', icon: Clock },
  AGUARDANDO_PAGAMENTO: { label: 'Aguardando Pagamento', bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-200', dotColor: 'bg-orange-400', icon: CreditCard },
  EM_PRODUCAO: { label: 'Em Produção', bgColor: 'bg-blue-50', textColor: 'text-[#1a3a8f]', borderColor: 'border-blue-200', dotColor: 'bg-[#1a3a8f]', icon: Truck },
  AGUARDANDO_RETIRADA: { label: 'Pronto para Retirada', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200', dotColor: 'bg-emerald-400', icon: CheckCircle2 },
  CANCELADO: { label: 'Cancelado', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', dotColor: 'bg-red-400', icon: XCircle },
};

const STATUS_STEPS = [
  'AGUARDANDO_APROVACAO',
  'AGUARDANDO_PAGAMENTO',
  'EM_PRODUCAO',
  'AGUARDANDO_RETIRADA',
];

function StatusTracker({ currentStatus, primaryColor }) {
  if (currentStatus === 'CANCELADO') {
    const config = STATUS_CONFIG.CANCELADO;
    const Icon = config.icon;
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <p className="font-semibold text-red-700 text-sm">Orçamento Cancelado</p>
          <p className="text-xs text-red-500 mt-0.5">Este orçamento foi cancelado</p>
        </div>
      </div>
    );
  }

  const currentIdx = STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-1">
      {STATUS_STEPS.map((step, idx) => {
        const config = STATUS_CONFIG[step];
        const Icon = config.icon;
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;

        return (
          <div key={step} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full flex items-center">
              {idx > 0 && (
                <div className={`flex-1 h-0.5 rounded-full transition-colors ${isCompleted ? 'bg-emerald-400' : 'bg-slate-200'}`} />
              )}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-600'
                    : isCurrent
                    ? 'ring-2 ring-offset-1 text-white'
                    : 'bg-slate-100 text-slate-300'
                }`}
                style={isCurrent ? { backgroundColor: primaryColor, ringColor: primaryColor } : undefined}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              {idx < STATUS_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full transition-colors ${isCompleted ? 'bg-emerald-400' : 'bg-slate-200'}`} />
              )}
            </div>
            <span className={`text-[10px] text-center leading-tight font-medium ${isCurrent ? 'text-slate-900' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
              {config.label.split(' ').slice(-1)[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Section({ icon: Icon, title, children, iconBg = 'bg-slate-100', iconColor = 'text-slate-500' }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/80 overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-2.5 border-b border-slate-100">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, mono = false }) {
  if (value == null || value === '') return null;
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-semibold text-slate-900 ${mono ? 'tabular-nums' : ''}`}>{value}</span>
    </div>
  );
}

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { primaryColor } = useCompanyTheme();
  const color = primaryColor || '#1a3a8f';

  const { data: quote, isLoading } = useQuery({
    queryKey: ['vidraceiro-orcamento', id],
    queryFn: () => entities.Orcamento.getMyQuote(id),
    enabled: !!id,
  });

  const statusConfig = STATUS_CONFIG[quote?.status] || STATUS_CONFIG.AGUARDANDO_APROVACAO;
  const StatusIcon = statusConfig.icon;

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-[#1a3a8f] rounded-full animate-spin" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 text-center max-w-sm bg-white rounded-2xl shadow-lg ring-1 ring-black/[0.04]"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Orçamento não encontrado</h2>
          <p className="text-slate-500 mb-6 text-sm">Este orçamento não existe ou não está disponível.</p>
          <button
            onClick={() => navigate(-1)}
            className="text-white px-6 py-2.5 rounded-xl font-semibold hover:brightness-110 transition-all active:scale-[0.98] shadow-lg"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
          >
            Voltar ao Histórico
          </button>
        </motion.div>
      </div>
    );
  }

  const precoAcessorios = quote.acessorios_selecionados?.reduce((sum, a) => sum + (a.preco_total || a.preco || 0), 0) || 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-5 pb-24">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity mb-5"
        style={{ color }}
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{quote.numero || 'Orçamento'}</h1>
            {quote.created_date && (
              <p className="text-sm text-slate-400 mt-0.5">
                {format(new Date(quote.created_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            )}
          </div>
          <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border px-3 py-1.5 text-xs font-semibold rounded-lg flex-shrink-0`}>
            <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Status Tracker */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/80 p-4">
          <StatusTracker currentStatus={quote.status} primaryColor={color} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {/* Valor Total */}
        {quote.preco_total != null && (
          <div
            className="p-5 rounded-2xl text-white shadow-lg relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
          >
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

        {/* Dados do Cliente */}
        {(quote.cliente_nome || quote.cliente_telefone || quote.cliente_email) && (
          <Section icon={User} title="Dados do Cliente" iconBg="bg-violet-50" iconColor="text-violet-600">
            <div className="space-y-0 divide-y divide-slate-100">
              {quote.cliente_nome && (
                <div className="flex items-center gap-3 py-2.5">
                  <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Nome</p>
                    <p className="text-sm font-semibold text-slate-900">{quote.cliente_nome}</p>
                  </div>
                </div>
              )}
              {quote.cliente_telefone && (
                <div className="flex items-center gap-3 py-2.5">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Telefone</p>
                    <p className="text-sm font-semibold text-slate-900">{quote.cliente_telefone}</p>
                  </div>
                </div>
              )}
              {quote.cliente_email && (
                <div className="flex items-center gap-3 py-2.5">
                  <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">E-mail</p>
                    <p className="text-sm font-semibold text-slate-900">{quote.cliente_email}</p>
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Produto */}
        <Section icon={Layers} title="Produto" iconBg="bg-[#1a3a8f]/10" iconColor="text-[#1a3a8f]">
          <div className="space-y-0 divide-y divide-slate-100">
            <InfoRow label="Tipologia" value={quote.tipologia_nome} />
            <InfoRow label="Tipo de Vidro" value={quote.tipo_vidro_nome} />
          </div>
        </Section>

        {/* Medidas do Vão */}
        {quote.variaveis_entrada?.length > 0 && (
          <Section icon={Ruler} title="Medidas do Vão" iconBg="bg-amber-50" iconColor="text-amber-600">
            <div className="grid grid-cols-3 gap-2">
              {quote.variaveis_entrada.map((v, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-1">{v.label || v.nome}</p>
                  <p className="font-bold text-slate-900 tabular-nums text-sm">
                    {v.valor} <span className="text-slate-400 font-normal text-xs">{v.unidade}</span>
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Peças */}
        {quote.pecas_calculadas?.length > 0 && (
          <Section icon={Package} title={`Peças (${quote.pecas_calculadas.length})`} iconBg="bg-sky-50" iconColor="text-sky-600">
            <div className="space-y-2">
              {quote.pecas_calculadas.map((peca, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                    style={{ backgroundColor: color }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{peca.nome}</p>
                    <p className="text-xs text-slate-500 tabular-nums mt-0.5">
                      {formatarMedida(peca.largura_real_mm, 'mm')} × {formatarMedida(peca.altura_real_mm, 'mm')}
                      {peca.largura_arredondada_mm && peca.largura_arredondada_mm !== peca.largura_real_mm && (
                        <span className="text-slate-400 ml-1">
                          (arred. {formatarMedida(peca.largura_arredondada_mm, 'mm')} × {formatarMedida(peca.altura_arredondada_mm, 'mm')})
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-900 tabular-nums">{peca.area_cobranca_m2?.toFixed(2)} m²</p>
                    {peca.area_real_m2 != null && peca.area_real_m2 !== peca.area_cobranca_m2 && (
                      <p className="text-[10px] text-slate-400 tabular-nums">real: {peca.area_real_m2?.toFixed(4)} m²</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Acessórios */}
        {quote.acessorios_selecionados?.length > 0 && (
          <Section icon={Info} title={`Acessórios (${quote.acessorios_selecionados.length})`} iconBg="bg-emerald-50" iconColor="text-emerald-600">
            <div className="space-y-2">
              {quote.acessorios_selecionados.map((acc, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-900">{acc.nome || acc.name}</span>
                    {acc.quantidade > 1 && (
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium">×{acc.quantidade}</span>
                    )}
                  </div>
                  {(acc.preco_total || acc.preco) != null && (
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      R$ {(acc.preco_total || acc.preco)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Resumo Financeiro */}
        <Section icon={DollarSign} title="Resumo Financeiro" iconBg="bg-emerald-50" iconColor="text-emerald-600">
          <div className="space-y-0 divide-y divide-slate-100">
            <InfoRow label="Área total (cobrança)" value={`${quote.area_total_cobranca_m2?.toFixed(2)} m²`} mono />
            <InfoRow label="Preço por m²" value={`R$ ${quote.preco_m2?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} mono />
            <InfoRow
              label="Vidro"
              value={`R$ ${(quote.preco_total - precoAcessorios)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              mono
            />
            {precoAcessorios > 0 && (
              <InfoRow
                label="Acessórios"
                value={`R$ ${precoAcessorios.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                mono
              />
            )}
            <div className="flex items-center justify-between pt-3 pb-1">
              <span className="font-bold text-slate-900">Total</span>
              <span className="text-lg font-bold tabular-nums" style={{ color }}>
                R$ {quote.preco_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </Section>

        {/* Histórico de Alterações */}
        {quote.history && quote.history.length > 0 && (
          <Section icon={History} title="Histórico de Alterações" iconBg="bg-slate-100" iconColor="text-slate-500">
            <div className="relative pl-6 space-y-3">
              <span className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-slate-200 to-slate-100 rounded-full" />
              {[...quote.history]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((entry, index) => {
                  const entryStatus = STATUS_CONFIG[entry.status];
                  return (
                    <div key={index} className="relative">
                      <span
                        className="absolute -left-6 top-3 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: index === 0 ? color : '#e2e8f0' }}
                      />
                      <div className={`rounded-xl p-3.5 ${index === 0 ? 'bg-slate-50 ring-1 ring-slate-200/60' : 'bg-slate-50/50'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-slate-900">{entry.action}</p>
                          {entryStatus && (
                            <Badge className={`${entryStatus.bgColor} ${entryStatus.textColor} text-[10px] px-1.5 py-0.5 rounded flex-shrink-0`}>
                              {entryStatus.label}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Calendar className="w-3 h-3 text-slate-300" />
                          <p className="text-xs text-slate-400">
                            {format(new Date(entry.date), "dd 'de' MMM yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                          {entry.user && (
                            <>
                              <span className="text-xs text-slate-300">·</span>
                              <p className="text-xs text-slate-400">{entry.user}</p>
                            </>
                          )}
                        </div>
                        {entry.motivo && (
                          <p className="text-xs text-slate-500 mt-1.5 bg-white/80 rounded-lg px-2.5 py-1.5 italic">
                            "{entry.motivo}"
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </Section>
        )}
      </motion.div>
    </div>
  );
}
