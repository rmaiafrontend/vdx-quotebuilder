import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrcamentoSuccessScreen({
  company,
  primaryColor,
  onRestart,
  onNavigateHome,
}) {
  const color = primaryColor || company?.primary_color || "#1a3a8f";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black/[0.04] p-8 text-center overflow-hidden relative">
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Orçamento Enviado!</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Recebemos seu orçamento com sucesso. Entraremos em contato em breve através do
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
              Fazer Novo Orçamento
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            {onNavigateHome && (
              <Button
                onClick={onNavigateHome}
                variant="outline"
                className="w-full h-11 rounded-xl font-medium"
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar para Início
              </Button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
