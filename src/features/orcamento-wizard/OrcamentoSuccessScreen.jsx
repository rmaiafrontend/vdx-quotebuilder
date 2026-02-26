import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Tela exibida após envio do orçamento (fluxo público).
 */
export default function OrcamentoSuccessScreen({
  company,
  primaryColor,
  onRestart,
  onNavigateHome,
}) {
  const color = primaryColor || company?.primary_color || "#1e88e5";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white">
      <header
        className="px-5 py-3.5 flex items-center justify-between"
        style={{ backgroundColor: color }}
      >
        <div className="flex items-center gap-2.5">
          {company?.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              className="w-9 h-9 rounded-lg bg-white p-1 object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
              <span className="font-bold text-lg" style={{ color }}>
                {company?.name?.charAt(0) || "V"}
              </span>
            </div>
          )}
          <h1 className="text-white font-semibold">{company?.name || "Orçamentos"}</h1>
        </div>
        {onNavigateHome && (
          <button
            type="button"
            onClick={onNavigateHome}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Sair"
          >
            <LogOut className="w-5 h-5 text-white" />
          </button>
        )}
      </header>

      <div className="flex items-center justify-center min-h-[calc(100vh-57px)] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Orçamento Enviado!</h2>
              <p className="text-slate-600 mb-6">
                Recebemos seu orçamento com sucesso. Entraremos em contato em breve através do
                telefone informado.
              </p>
              <Button onClick={onRestart} className="w-full" style={{ backgroundColor: color }}>
                Fazer Novo Orçamento
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
