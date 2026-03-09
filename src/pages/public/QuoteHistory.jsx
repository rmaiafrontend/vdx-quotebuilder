import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { entities } from '@/api/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Plus, Archive } from 'lucide-react';
import QuoteCard from '@/components/quotes/QuoteCard';
import { useCompanyTheme } from '@/hooks/useCompanyTheme';
import { orcamentoToQuote } from '@/utils/statusUtils';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function QuoteHistory() {
  const navigate = useNavigate();
  const { primaryColor } = useCompanyTheme();

  const { data: allOrcamentos = [] } = useQuery({
    queryKey: ['vidraceiro-orcamentos'],
    queryFn: () => entities.Orcamento.listMyQuotes()
  });

  const completedQuotes = allOrcamentos
    .filter(q => ['AGUARDANDO_RETIRADA', 'CANCELADO'].includes(q.status))
    .map(orcamentoToQuote);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      {/* Header section */}
      <div className="relative px-5 pt-5 pb-10 overflow-hidden bg-gradient-to-br from-emerald-50/60 to-emerald-50/20">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 mb-4 text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: primaryColor }}>
            <ArrowLeft className="w-4 h-4" /><span>Voltar</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center shrink-0 shadow-sm">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Historico</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {completedQuotes.length === 0 ? 'Nenhum orcamento finalizado' : `${completedQuotes.length} orcamento${completedQuotes.length > 1 ? 's' : ''} finalizado${completedQuotes.length > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 max-w-2xl mx-auto -mt-4 pb-8">
        {completedQuotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 text-center bg-white rounded-2xl shadow-md ring-1 ring-black/[0.04]"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <Archive className="w-8 h-8 text-emerald-300" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1.5">Nenhum historico</h3>
            <p className="text-sm text-slate-500 mb-6">Seus orcamentos finalizados aparecerao aqui</p>
            <button
              onClick={() => navigate('/orcamento')}
              className="inline-flex items-center gap-2 text-white px-6 py-2.5 rounded-xl font-semibold hover:brightness-110 transition-all active:scale-[0.98] shadow-lg"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}
            >
              <Plus className="w-4 h-4" /> Novo Orcamento
            </button>
          </motion.div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
            {completedQuotes.map((quote) => (
              <motion.div key={quote.id} variants={item}>
                <QuoteCard quote={quote} primaryColor={primaryColor} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
