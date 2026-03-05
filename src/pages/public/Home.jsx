import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { entities } from '@/api/api';
import { motion } from 'framer-motion';
import { Plus, FileText, Clock, MessageCircle, ChevronRight, LogOut, Bell, Sparkles } from 'lucide-react';
import PublicHeader from '@/components/public/PublicHeader';
import { useCompanyTheme } from '@/hooks/useCompanyTheme';
import { convertStatusToFrontend } from '@/utils/statusUtils';
import { useVidraceiro } from '@/lib/VidracerioContext';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function Home() {
  const navigate = useNavigate();
  const { company, primaryColor } = useCompanyTheme();
  const { vidraceiro, logout } = useVidraceiro();

  const { data: allOrcamentos = [] } = useQuery({
    queryKey: ['orcamentos'],
    queryFn: () => entities.Orcamento.list()
  });

  const customerQuotes = allOrcamentos.map(orc => ({
    id: orc.id,
    status: convertStatusToFrontend(orc.status),
    customer_id: orc.cliente_email
  }));

  const openQuotesCount = useMemo(() => customerQuotes.filter(q => ['draft', 'pending', 'sent'].includes(q.status)).length, [customerQuotes]);
  const completedQuotesCount = useMemo(() => customerQuotes.filter(q => ['approved', 'rejected', 'expired'].includes(q.status)).length, [customerQuotes]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const handleLogout = () => {
    logout();
  };

  const headerRightSlot = (
    <>
      <button className="relative p-2.5 hover:bg-white/15 rounded-xl transition-colors" onClick={() => navigate('/admin/dashboard')}>
        <Bell className="w-5 h-5 text-white/90" />
        {openQuotesCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-400 rounded-full ring-2 ring-white/30 animate-pulse" />}
      </button>
      <button onClick={handleLogout} className="p-2.5 hover:bg-white/15 rounded-xl transition-colors">
        <LogOut className="w-5 h-5 text-white/90" />
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      <PublicHeader company={company} primaryColor={primaryColor} rightSlot={headerRightSlot} />

      {/* Hero Section */}
      <div
        className="relative px-5 pt-6 pb-16 overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${primaryColor}, ${primaryColor}dd)` }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA3KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-60" />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-white/70 text-sm font-medium">{getGreeting()}</p>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            {vidraceiro?.name?.split(' ')[0] || 'Bem-vindo'}
          </h2>
        </div>
      </div>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-4 max-w-2xl mx-auto -mt-12 pb-8 space-y-4"
      >
        {/* CTA - Novo Orcamento */}
        <motion.button
          variants={item}
          className="w-full p-5 rounded-2xl text-left transition-all hover:scale-[1.01] active:scale-[0.98] shadow-xl bg-white ring-1 ring-black/[0.04]"
          onClick={() => navigate('/orcamento')}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}
            >
              <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base text-slate-900">Novo Orcamento</h3>
              <p className="text-slate-500 text-sm mt-0.5">Solicitar nova cotacao</p>
            </div>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${primaryColor}10` }}
            >
              <ChevronRight className="w-4 h-4" style={{ color: primaryColor }} />
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
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}88)` }} />
            <div className="flex items-center justify-between mb-3 mt-1">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: `linear-gradient(135deg, ${primaryColor}18, ${primaryColor}08)` }}
              >
                <FileText className="w-5 h-5" style={{ color: primaryColor }} />
              </div>
              {openQuotesCount > 0 && (
                <span
                  className="min-w-[26px] h-6 px-2 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
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
            <h3 className="text-slate-900 font-semibold text-sm">Historico</h3>
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
