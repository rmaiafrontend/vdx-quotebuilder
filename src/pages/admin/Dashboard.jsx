import React from "react";
import { Link } from "react-router-dom";
import { entities } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Clock,
  CheckCircle2,
  Package,
  DollarSign,
  Plus,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const formatDate = () => {
  const now = new Date();
  const options = { weekday: "long", day: "numeric", month: "long" };
  return now.toLocaleDateString("pt-BR", options);
};

const STATUS_CONFIG = {
  rascunho: { label: "Rascunho", color: "bg-slate-100 text-slate-700" },
  aguardando_aprovacao: { label: "Aguardando Aprovação", color: "bg-amber-100 text-amber-700" },
  aguardando_pagamento: { label: "Aguardando Pagamento", color: "bg-orange-100 text-orange-700" },
  em_producao: { label: "Em Produção", color: "bg-blue-100 text-blue-700" },
  aguardando_retirada: { label: "Pronto", color: "bg-green-100 text-green-700" },
  concluido: { label: "Concluído", color: "bg-emerald-100 text-emerald-700" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-700" }
};

export default function Dashboard() {
  const { data: orcamentos, isLoading: loadingOrcamentos } = useQuery({
    queryKey: ['orcamentos'],
    queryFn: () => entities.Orcamento.list('-created_date', 10),
    initialData: []
  });

  const { data: tipologias, isLoading: loadingTipologias } = useQuery({
    queryKey: ['tipologias'],
    queryFn: () => entities.Tipologia.filter({ ativo: true }),
    initialData: []
  });

  const stats = React.useMemo(() => {
    const total = orcamentos.length;
    const emAndamento = orcamentos.filter(o => 
      ['aguardando_aprovacao', 'aguardando_pagamento', 'em_producao'].includes(o.status)
    ).length;
    const concluidos = orcamentos.filter(o => o.status === 'concluido').length;
    const valorTotal = orcamentos
      .filter(o => o.status !== 'cancelado')
      .reduce((sum, o) => sum + (o.preco_total || 0), 0);
    
    return { total, emAndamento, concluidos, valorTotal };
  }, [orcamentos]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header com boas-vindas */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              {formatDate().replace(/^./, (c) => c.toUpperCase())}
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Visão geral do sistema de orçamentos
          </p>
        </div>
      </motion.header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0, duration: 0.3 }}>
          <Card className="relative overflow-hidden border-0 bg-white rounded-2xl shadow-sm shadow-slate-200/60 hover:shadow-md transition-shadow h-full min-h-[120px]">
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-l-2xl" />
            <CardContent className="p-5 pl-6 flex flex-col h-full">
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Orçamentos</span>
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" strokeWidth={2.25} />
                </div>
              </div>
              <p className="text-3xl lg:text-4xl font-bold text-slate-900 tabular-nums tracking-tight mt-auto">
                {stats.total}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.3 }}>
          <Card className="relative overflow-hidden border-0 bg-white rounded-2xl shadow-sm shadow-slate-200/60 hover:shadow-md transition-shadow h-full min-h-[120px]">
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-amber-600 rounded-l-2xl" />
            <CardContent className="p-5 pl-6 flex flex-col h-full">
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Em Andamento</span>
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-amber-600" strokeWidth={2.25} />
                </div>
              </div>
              <p className="text-3xl lg:text-4xl font-bold text-slate-900 tabular-nums tracking-tight mt-auto">
                {stats.emAndamento}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
          <Card className="relative overflow-hidden border-0 bg-white rounded-2xl shadow-sm shadow-slate-200/60 hover:shadow-md transition-shadow h-full min-h-[120px]">
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-green-600 rounded-l-2xl" />
            <CardContent className="p-5 pl-6 flex flex-col h-full">
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Concluídos</span>
                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-600" strokeWidth={2.25} />
                </div>
              </div>
              <p className="text-3xl lg:text-4xl font-bold text-slate-900 tabular-nums tracking-tight mt-auto">
                {stats.concluidos}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.3 }}>
          <Card className="relative overflow-hidden border-0 bg-white rounded-2xl shadow-sm shadow-slate-200/60 hover:shadow-md transition-shadow h-full min-h-[120px]">
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-l-2xl" />
            <CardContent className="p-5 pl-6 flex flex-col h-full">
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Valor Total</span>
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4 text-emerald-600" strokeWidth={2.25} />
                </div>
              </div>
              <p className="text-xl lg:text-2xl font-bold text-slate-900 tabular-nums tracking-tight mt-auto leading-tight">
                R$ {stats.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Card className="border-slate-200/80 bg-white h-full overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/admin/orcamentos/novo">
                <Button className="w-full justify-start h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md shadow-blue-500/25 font-medium">
                  <Plus className="w-4 h-4 mr-3" />
                  Novo Orçamento
                </Button>
              </Link>
              <Link to="/admin/tipologias">
                <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-medium">
                  <Package className="w-4 h-4 mr-3" />
                  Gerenciar Tipologias
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orçamentos Recentes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="border-slate-200/80 bg-white h-full overflow-hidden">
            <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-base font-semibold">Orçamentos Recentes</CardTitle>
              {orcamentos.length > 0 && (
                <span className="text-xs text-slate-500 font-medium">
                  Últimos 5
                </span>
              )}
            </CardHeader>
            <CardContent>
              {loadingOrcamentos ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : orcamentos.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <FileText className="w-7 h-7 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Nenhum orçamento ainda</p>
                  <p className="text-xs text-slate-500 mt-1">Crie o primeiro para começar</p>
                  <Link to="/admin/orcamentos/novo">
                    <Button className="mt-5 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar orçamento
                    </Button>
                  </Link>
                </div>
              ) : (
                <ul className="space-y-2">
                  {orcamentos.slice(0, 5).map((orcamento) => (
                    <li key={orcamento.id}>
                      <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-slate-200/80 bg-slate-50/30 hover:bg-slate-100/60 hover:border-slate-200 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="shrink-0 w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-slate-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                              {orcamento.numero || `#${String(orcamento.id || "").slice(-6)}`}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {orcamento.tipologia_nome || "Tipologia"} · {orcamento.cliente_nome || "Cliente"}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-3 text-right">
                          {orcamento.preco_total != null && (
                            <span className="text-sm font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                              R$ {Number(orcamento.preco_total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                          )}
                          <Badge className={`shrink-0 ${STATUS_CONFIG[orcamento.status]?.color || STATUS_CONFIG.rascunho.color}`}>
                            {STATUS_CONFIG[orcamento.status]?.label || "Rascunho"}
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}