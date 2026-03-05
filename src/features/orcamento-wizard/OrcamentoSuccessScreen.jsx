import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, LogOut, PartyPopper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrcamentoSuccessScreen({
  company,
  primaryColor,
  onRestart,
  onNavigateHome,
}) {
  const color = primaryColor || company?.primary_color || "#1e88e5";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      <header
        className="px-5 py-4 flex items-center justify-between shadow-lg"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA3KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative flex items-center gap-3">
          {company?.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              className="w-10 h-10 rounded-xl bg-white p-1 object-cover shadow-md ring-2 ring-white/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 shadow-md">
              <span className="font-bold text-lg text-white">
                {company?.name?.charAt(0) || "V"}
              </span>
            </div>
          )}
          <h1 className="text-white font-bold text-lg tracking-tight">{company?.name || "Orcamentos"}</h1>
        </div>
        {onNavigateHome && (
          <button
            type="button"
            onClick={onNavigateHome}
            className="relative p-2.5 hover:bg-white/15 rounded-xl transition-colors"
            aria-label="Sair"
          >
            <LogOut className="w-5 h-5 text-white/90" />
          </button>
        )}
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black/[0.04] p-8 text-center overflow-hidden relative">
            {/* Decorative gradient top */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30"
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Orcamento Enviado!</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Recebemos seu orcamento com sucesso. Entraremos em contato em breve atraves do
                telefone informado.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Button
                onClick={onRestart}
                className="w-full h-12 rounded-xl font-semibold text-base shadow-lg"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 4px 14px ${color}40` }}
              >
                Fazer Novo Orcamento
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              {onNavigateHome && (
                <Button
                  onClick={onNavigateHome}
                  variant="outline"
                  className="w-full h-11 rounded-xl font-medium"
                >
                  Voltar para Inicio
                </Button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
