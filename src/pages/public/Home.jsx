import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { entities } from '@/api/api';
import { motion } from 'framer-motion';
import { Plus, FileText, Clock, MessageCircle, ChevronRight, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCompanyTheme } from '@/hooks/useCompanyTheme';
import { useVidraceiro } from '@/lib/VidracerioContext';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function Home() {
  const navigate = useNavigate();
  const { company, primaryColor } = useCompanyTheme();
  const { vidraceiro } = useVidraceiro();

  const { data: allOrcamentos = [] } = useQuery({
    queryKey: ['vidraceiro-orcamentos'],
    queryFn: () => entities.Orcamento.listMyQuotes()
  });

  const openQuotesCount = useMemo(() => allOrcamentos.filter(o => !['AGUARDANDO_RETIRADA', 'CANCELADO'].includes(o.status)).length, [allOrcamentos]);
  const completedQuotesCount = useMemo(() => allOrcamentos.filter(o => ['AGUARDANDO_RETIRADA', 'CANCELADO'].includes(o.status)).length, [allOrcamentos]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#1a3a8f] via-[#1e4ba3] to-[#2962cc] pb-20">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />

        {/* Floating header */}
        <div className="sticky top-0 z-30 px-4 pt-3">
          <header className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/[0.08] ring-1 ring-black/[0.06] px-4 py-2.5 flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center">
              {company?.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="h-7 w-auto object-contain" />
              ) : (
                <h1 className="font-bold text-lg text-slate-900 tracking-tight">{company?.name || 'Vidros Express'}</h1>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}
              >
                <span className="text-white font-bold text-xs">
                  {vidraceiro?.name?.charAt(0)?.toUpperCase() || 'V'}
                </span>
              </div>
            </div>
          </header>
        </div>

        {/* Greeting */}
        <div className="relative px-5 pt-5 pb-2 max-w-2xl mx-auto">
          <p className="text-white/40 text-xs font-medium tracking-wider uppercase mb-3 flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
          <h2 className="text-[26px] font-extrabold text-white tracking-tight leading-tight">
            {getGreeting()},{' '}
            <span className="text-white/90">{vidraceiro?.name?.split(' ')[0] || 'Bem-vindo'}</span>
          </h2>
          <p className="text-white/50 text-sm mt-1.5">
            {allOrcamentos.length === 0
              ? 'Comece solicitando seu primeiro orçamento.'
              : openQuotesCount > 0
                ? `Você tem ${openQuotesCount} orçamento${openQuotesCount > 1 ? 's' : ''} em andamento.`
                : 'Todos os seus orçamentos estão em dia.'}
          </p>
        </div>
      </div>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 px-4 max-w-2xl mx-auto -mt-14 pb-8 space-y-4"
      >
        {/* CTA - Novo Orcamento */}
        <motion.button
          variants={item}
          className="w-full p-5 rounded-2xl text-left transition-all hover:scale-[1.01] active:scale-[0.98] shadow-xl bg-white ring-1 ring-black/[0.04]"
          onClick={() => navigate('/orcamento')}
        >
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 shadow-lg bg-gradient-to-br from-[#e8751a] to-[#d4650f]">
              <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base text-slate-900">Novo Orçamento</h3>
              <p className="text-slate-500 text-sm mt-0.5">Solicitar nova cotação</p>
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-[#e8751a]/10">
              <ChevronRight className="w-4 h-4 text-[#e8751a]" />
            </div>
          </div>
        </motion.button>

        {/* Grid Cards */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            variants={item}
            className="relative p-4 rounded-2xl bg-white text-left transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] shadow-md ring-1 ring-black/[0.04] overflow-hidden"
            onClick={() => navigate('/em-aberto')}
          >
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-[#1a3a8f] to-[#2962cc]" />
            <div className="flex items-center justify-between mb-3 mt-1">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm bg-[#1a3a8f]/8">
                <FileText className="w-5 h-5 text-[#1a3a8f]" />
              </div>
              {openQuotesCount > 0 && (
                <span className="min-w-[26px] h-6 px-2 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-sm bg-[#1a3a8f]">
                  {openQuotesCount}
                </span>
              )}
            </div>
            <h3 className="text-slate-900 font-semibold text-sm">Em Aberto</h3>
            <p className="text-slate-400 text-xs mt-0.5">Acompanhar pedidos</p>
          </motion.button>

          <motion.button
            variants={item}
            className="relative p-4 rounded-2xl bg-white text-left transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] shadow-md ring-1 ring-black/[0.04] overflow-hidden"
            onClick={() => navigate('/historico')}
          >
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-emerald-500 to-emerald-300" />
            <div className="flex items-center justify-between mb-3 mt-1">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 flex items-center justify-center shadow-sm">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              {completedQuotesCount > 0 && (
                <span className="min-w-[26px] h-6 px-2 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  {completedQuotesCount}
                </span>
              )}
            </div>
            <h3 className="text-slate-900 font-semibold text-sm">Histórico</h3>
            <p className="text-slate-400 text-xs mt-0.5">Finalizados</p>
          </motion.button>
        </div>

        {/* WhatsApp Help */}
        <motion.button
          variants={item}
          className="w-full p-4 rounded-2xl bg-white text-left transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] shadow-md ring-1 ring-black/[0.04] overflow-hidden"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center shrink-0 shadow-sm">
              <MessageCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-900 font-semibold text-sm">Precisa de ajuda?</h3>
              <p className="text-slate-400 text-xs mt-0.5">Fale conosco no WhatsApp</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <ChevronRight className="w-4 h-4 text-amber-500" />
            </div>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
