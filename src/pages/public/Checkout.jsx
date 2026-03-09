import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Send, Loader2, ShoppingCart, Trash2, Plus, ArrowLeft,
  CheckCircle2, ArrowRight, Home, ClipboardList, User, Phone, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCarrinho } from "@/hooks/useCarrinho";
import { useCompanyTheme } from "@/hooks/useCompanyTheme";

export default function Checkout() {
  const navigate = useNavigate();
  const { primaryColor } = useCompanyTheme();
  const {
    carrinho, precoTotalCarrinho, removerDoCarrinho,
    clienteInfo, setClienteInfo,
    salvarOrcamento, salvarMutation, podeEnviar,
    orcamentoSalvo, resetCarrinho,
  } = useCarrinho();
  const color = primaryColor || "#1a3a8f";

  // Success state
  if (orcamentoSalvo) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-sm w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Orçamento Enviado!</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Recebemos seu orçamento com sucesso. Entraremos em contato em breve através do telefone informado.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => { resetCarrinho(); navigate("/orcamento"); }}
              className="w-full h-12 rounded-xl font-semibold text-base shadow-lg text-white"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 4px 14px ${color}40` }}
            >
              Novo Orçamento <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => { resetCarrinho(); navigate("/"); }}
              variant="outline"
              className="w-full h-11 rounded-xl font-medium"
            >
              <Home className="w-4 h-4 mr-2" /> Voltar para Início
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Empty cart redirect
  if (carrinho.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
            <ShoppingCart className="w-7 h-7 text-slate-300" />
          </div>
          <p className="font-semibold text-slate-500 mb-1">Carrinho vazio</p>
          <p className="text-sm text-slate-400 mb-5">Adicione itens antes de finalizar</p>
          <Button
            onClick={() => navigate("/orcamento")}
            className="rounded-xl font-semibold text-white h-10 px-6"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Criar Orçamento
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-5">
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
      <div className="text-center mb-6">
        <div
          className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-3 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 4px 14px ${color}30` }}
        >
          <ClipboardList className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Finalizar Orçamento</h1>
        <p className="text-slate-400 text-sm mt-1">Revise os itens e informe seus dados</p>
      </div>

      <div className="space-y-4">
        {/* Resumo dos itens */}
        <div className="bg-white rounded-2xl ring-1 ring-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">Itens</span>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md text-white" style={{ backgroundColor: color }}>
                {carrinho.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/orcamento")}
              className="flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-70"
              style={{ color }}
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {carrinho.map((item, idx) => (
              <div key={item.id} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5" style={{ backgroundColor: color }}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 leading-tight">{item.tipologia_nome}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-3 h-3 rounded-sm border border-slate-200 shadow-sm flex-shrink-0" style={{ backgroundColor: item.tipo_vidro_cor || '#e2e8f0' }} />
                      <span className="text-xs text-slate-500 truncate">{item.tipo_vidro_nome}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                        {item.pecas_calculadas.length} {item.pecas_calculadas.length === 1 ? 'peça' : 'peças'}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                        {item.area_total_cobranca_m2?.toFixed(2)} m²
                      </span>
                      {item.acessorios_selecionados?.length > 0 && (
                        <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                          {item.acessorios_selecionados.length} acess.
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      R$ {item.preco_total_item.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      type="button"
                      onClick={() => removerDoCarrinho(item.id)}
                      className="text-red-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Total</span>
              <span className="text-lg font-bold tabular-nums" style={{ color }}>
                R$ {precoTotalCarrinho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Dados do cliente */}
        <div className="bg-white rounded-2xl ring-1 ring-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">Seus Dados</span>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                Nome <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  value={clienteInfo.nome}
                  onChange={(e) => setClienteInfo({ ...clienteInfo, nome: e.target.value })}
                  placeholder="Seu nome completo"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#1a3a8f] focus:ring-[#1a3a8f]/20 transition-all placeholder:text-slate-300 pl-10"
                />
                <User className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                Telefone <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  value={clienteInfo.telefone}
                  onChange={(e) => setClienteInfo({ ...clienteInfo, telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#1a3a8f] focus:ring-[#1a3a8f]/20 transition-all placeholder:text-slate-300 pl-10"
                />
                <Phone className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                E-mail <span className="text-slate-300 text-xs font-normal">(opcional)</span>
              </Label>
              <div className="relative">
                <Input
                  value={clienteInfo.email}
                  onChange={(e) => setClienteInfo({ ...clienteInfo, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  type="email"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#1a3a8f] focus:ring-[#1a3a8f]/20 transition-all placeholder:text-slate-300 pl-10"
                />
                <Mail className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Botão enviar */}
        <Button
          onClick={salvarOrcamento}
          disabled={!podeEnviar || salvarMutation.isPending}
          className="w-full h-13 text-base font-semibold rounded-xl shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white"
          style={{ boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)' }}
        >
          {salvarMutation.isPending ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Enviando...</>
          ) : (
            <><Send className="w-4 h-4 mr-2" /> Enviar Orçamento</>
          )}
        </Button>
      </div>
    </div>
  );
}
