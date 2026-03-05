import React from "react";
import { Link } from "react-router-dom";
import { entities } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Clock,
  CheckCircle2,
  DollarSign,
  Plus,
  ChevronRight,
  Package,
  ShoppingCart,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

const formatDate = () => {
  const now = new Date();
  const options = { weekday: "long", day: "numeric", month: "long" };
  return now.toLocaleDateString("pt-BR", options);
};

const STATUS_CONFIG = {
  rascunho: { label: "Rascunho", color: "bg-slate-100 text-slate-700", chartColor: "#94a3b8" },
  aguardando_aprovacao: { label: "Aguardando Aprovação", color: "bg-amber-100 text-amber-700", chartColor: "#f59e0b" },
  aguardando_pagamento: { label: "Aguardando Pagamento", color: "bg-orange-100 text-orange-700", chartColor: "#f97316" },
  em_producao: { label: "Em Produção", color: "bg-blue-100 text-blue-700", chartColor: "#3b82f6" },
  aguardando_retirada: { label: "Pronto", color: "bg-green-100 text-green-700", chartColor: "#22c55e" },
  concluido: { label: "Concluído", color: "bg-emerald-100 text-emerald-700", chartColor: "#10b981" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-700", chartColor: "#ef4444" },
};

const STAT_CARDS = [
  {
    key: "total",
    label: "Total Orçamentos",
    icon: FileText,
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-500/10",
    text: "text-blue-600",
  },
  {
    key: "emAndamento",
    label: "Em Andamento",
    icon: Clock,
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
    text: "text-amber-600",
  },
  {
    key: "concluidos",
    label: "Concluídos",
    icon: CheckCircle2,
    gradient: "from-emerald-500 to-green-500",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
  },
  {
    key: "valorTotal",
    label: "Valor Total",
    icon: DollarSign,
    gradient: "from-violet-500 to-purple-500",
    bg: "bg-violet-500/10",
    text: "text-violet-600",
    isCurrency: true,
  },
];

const QUICK_ACTIONS = [
  {
    label: "Novo Orçamento",
    description: "Criar um novo orçamento para cliente",
    icon: Plus,
    to: "/admin/orcamentos/novo",
    gradient: "from-blue-600 to-indigo-600",
    shadow: "shadow-blue-500/25",
  },
  {
    label: "Tipologias",
    description: "Gerenciar modelos e tipologias",
    icon: Package,
    to: "/admin/tipologias",
    gradient: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/25",
  },
  {
    label: "Produtos",
    description: "Catálogo de vidros e acessórios",
    icon: ShoppingCart,
    to: "/admin/produtos",
    gradient: "from-emerald-500 to-green-500",
    shadow: "shadow-emerald-500/25",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="rounded-lg bg-white px-3 py-2 shadow-lg border border-slate-200/80 text-sm">
      <p className="font-medium text-slate-900">{data.name}</p>
      <p className="text-slate-500">
        {data.value} orçamento{data.value !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export default function Dashboard() {
  const { data: orcamentos, isLoading: loadingOrcamentos } = useQuery({
    queryKey: ["orcamentos"],
    queryFn: () => entities.Orcamento.list("-created_date", 10),
    initialData: [],
  });

  const { data: tipologias } = useQuery({
    queryKey: ["tipologias"],
    queryFn: () => entities.Tipologia.filter({ ativo: true }),
    initialData: [],
  });

  const stats = React.useMemo(() => {
    const total = orcamentos.length;
    const emAndamento = orcamentos.filter((o) =>
      ["aguardando_aprovacao", "aguardando_pagamento", "em_producao"].includes(o.status)
    ).length;
    const concluidos = orcamentos.filter((o) => o.status === "concluido").length;
    const valorTotal = orcamentos
      .filter((o) => o.status !== "cancelado")
      .reduce((sum, o) => sum + (o.preco_total || 0), 0);

    return { total, emAndamento, concluidos, valorTotal };
  }, [orcamentos]);

  const chartData = React.useMemo(() => {
    const counts = {};
    orcamentos.forEach((o) => {
      const status = o.status || "rascunho";
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([key, value]) => ({
        name: STATUS_CONFIG[key]?.label || key,
        value,
        color: STATUS_CONFIG[key]?.chartColor || "#94a3b8",
      }))
      .sort((a, b) => b.value - a.value);
  }, [orcamentos]);

  const formatStatValue = (card) => {
    if (card.isCurrency) {
      return `R$ ${stats[card.key].toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    }
    return stats[card.key];
  };

  if (loadingOrcamentos) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Welcome Banner */}
      <motion.div variants={item}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-6 sm:p-8 text-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA3KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                {formatDate().replace(/^./, (c) => c.toUpperCase())}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {getGreeting()} 👋
              </h1>
              <p className="text-blue-100 mt-1.5 text-sm sm:text-base">
                {stats.emAndamento > 0
                  ? `Você tem ${stats.emAndamento} orçamento${stats.emAndamento > 1 ? "s" : ""} em andamento`
                  : "Todos os orçamentos estão em dia"}
              </p>
            </div>
            <Link to="/admin/orcamentos/novo" className="shrink-0">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg shadow-blue-900/20 font-semibold rounded-xl h-11 px-5"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Orçamento
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {STAT_CARDS.map((card) => (
          <motion.div key={card.key} variants={item}>
            <Card className="relative overflow-hidden border-0 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-full group">
              <CardContent className="p-4 sm:p-5 flex flex-col h-full min-h-[110px]">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <card.icon className={`w-5 h-5 ${card.text}`} strokeWidth={2} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-slate-300" />
                </div>
                <p className={`font-bold tabular-nums tracking-tight mt-auto ${card.isCurrency ? "text-xl sm:text-2xl" : "text-3xl sm:text-4xl"} text-slate-900`}>
                  {formatStatValue(card)}
                </p>
                <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">
                  {card.label}
                </p>
              </CardContent>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-80`} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-slate-200/80 bg-white h-full rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-900">
                Distribuição por Status
              </CardTitle>
              <p className="text-xs text-slate-500">{orcamentos.length} orçamentos no total</p>
            </CardHeader>
            <CardContent className="pb-5">
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-[200px] text-sm text-slate-400">
                  Nenhum dado disponível
                </div>
              ) : (
                <>
                  <div className="h-[200px] -mx-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-2">
                    {chartData.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-slate-600 truncate">{entry.name}</span>
                        </div>
                        <span className="font-semibold text-slate-900 tabular-nums">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="lg:col-span-3">
          <Card className="border-slate-200/80 bg-white h-full rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">
                Ações Rápidas
              </CardTitle>
              <p className="text-xs text-slate-500">Acesse as funções mais utilizadas</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {QUICK_ACTIONS.map((action) => (
                <Link key={action.to} to={action.to}>
                  <div className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 cursor-pointer">
                    <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} shadow-md ${action.shadow} flex items-center justify-center transition-transform group-hover:scale-105`}>
                      <action.icon className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">{action.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </Link>
              ))}

              {/* Tipologias ativas info */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/50 border border-slate-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Tipologias Ativas</p>
                    <p className="text-xs text-slate-500">Modelos disponíveis no sistema</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-600 tabular-nums">{tipologias.length}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div variants={item}>
        <Card className="border-slate-200/80 bg-white rounded-2xl overflow-hidden">
          <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Orçamentos Recentes
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Últimas movimentações</p>
            </div>
            {orcamentos.length > 5 && (
              <Link to="/admin/orcamentos">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs font-medium">
                  Ver todos
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {orcamentos.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700">Nenhum orçamento ainda</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Crie seu primeiro orçamento para começar a acompanhar tudo por aqui
                </p>
                <Link to="/admin/orcamentos/novo">
                  <Button className="mt-5 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar orçamento
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {orcamentos.slice(0, 5).map((orcamento) => {
                  const statusConf = STATUS_CONFIG[orcamento.status] || STATUS_CONFIG.rascunho;
                  return (
                    <div
                      key={orcamento.id}
                      className="group flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/80 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: statusConf.chartColor + "15" }}
                        >
                          <FileText
                            className="w-5 h-5"
                            style={{ color: statusConf.chartColor }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">
                            {orcamento.numero || `#${String(orcamento.id || "").slice(-6)}`}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {orcamento.tipologia_nome || "Tipologia"} · {orcamento.cliente_nome || "Cliente"}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-3">
                        {orcamento.preco_total != null && (
                          <span className="text-sm font-semibold text-slate-900 tabular-nums whitespace-nowrap hidden sm:block">
                            R$ {Number(orcamento.preco_total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        )}
                        <Badge className={`shrink-0 text-[11px] font-medium ${statusConf.color}`}>
                          {statusConf.label}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Skeleton className="h-[140px] w-full rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[130px] w-full rounded-2xl" />
        ))}
      </div>
      <div className="grid lg:grid-cols-5 gap-4 sm:gap-6">
        <Skeleton className="h-[360px] w-full rounded-2xl lg:col-span-2" />
        <Skeleton className="h-[360px] w-full rounded-2xl lg:col-span-3" />
      </div>
      <Skeleton className="h-[300px] w-full rounded-2xl" />
    </div>
  );
}
