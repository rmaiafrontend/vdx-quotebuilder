import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { entities } from '@/api/api';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Plus, Inbox } from 'lucide-react';
import QuoteCard from '@/components/quotes/QuoteCard';
import { useCompanyTheme } from '@/hooks/useCompanyTheme';
import { orcamentoToQuote } from '@/utils/statusUtils';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function OpenQuotes() {
  const navigate = useNavigate();
  const { primaryColor } = useCompanyTheme();

  const { data: allOrcamentos = [] } = useQuery({
    queryKey: ['vidraceiro-orcamentos'],
    queryFn: () => entities.Orcamento.listMyQuotes()
  });

  const openQuotes = allOrcamentos
    .filter(q => !['AGUARDANDO_RETIRADA', 'CANCELADO'].includes(q.status))
    .map(orcamentoToQuote);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      {/* Header section */}
      <div
        className="relative px-5 pt-5 pb-10 overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${primaryColor}12, ${primaryColor}06)` }}
      >
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 mb-4 text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: primaryColor }}>
            <ArrowLeft className="w-4 h-4" /><span>Voltar</span>
          </button>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}10)` }}
            >
              <FileText className="w-6 h-6" style={{ color: primaryColor }} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Em Aberto</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {openQuotes.length === 0 ? 'Nenhum orcamento em aberto' : `${openQuotes.length} orcamento${openQuotes.length > 1 ? 's' : ''} em andamento`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 max-w-2xl mx-auto -mt-4 pb-8">
        {openQuotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 text-center bg-white rounded-2xl shadow-md ring-1 ring-black/[0.04]"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-800 mb-1.5">Nenhum orcamento em aberto</h3>
            <p className="text-sm text-slate-500 mb-6">Seus orcamentos em andamento aparecerao aqui</p>
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
            {openQuotes.map((quote) => (
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
