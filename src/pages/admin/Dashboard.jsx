import React from "react";
import { Link } from "react-router-dom";
import { entities } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import {
  FileText, Clock, CheckCircle2, DollarSign,
  Package, ShoppingCart, LayoutGrid, Wrench,
  ChevronRight, ArrowUpRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";

const fmt = (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
};

const STATUS_CONFIG = {
  AGUARDANDO_APROVACAO: { label: "Aguardando Aprovação", color: "#f59e0b" },
  AGUARDANDO_PAGAMENTO: { label: "Aguardando Pagamento", color: "#f97316" },
  EM_PRODUCAO:          { label: "Em Produção",          color: "#1a3a8f" },
  AGUARDANDO_RETIRADA:  { label: "Pronto p/ Retirada",   color: "#10b981" },
  CANCELADO:            { label: "Cancelado",             color: "#ef4444" },
};

const QUICK_LINKS = [
  { label: "Tipologias",       desc: "Modelos e configurações",    icon: Package,    to: "/admin/tipologias",              color: "#1a3a8f" },
  { label: "Categorias",       desc: "Grupos de tipologias",       icon: LayoutGrid, to: "/admin/categorias",              color: "#0891b2" },
  { label: "Produtos",         desc: "Vidros e acessórios",        icon: ShoppingCart, to: "/admin/produtos",             color: "#059669" },
  { label: "Config. Técnicas", desc: "Parâmetros do sistema",      icon: Wrench,     to: "/admin/configuracoes-tecnicas",  color: "#7c3aed" },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-xl bg-white px-3 py-2 shadow-lg border border-[#0f0f12]/[0.08] text-[12px]">
      <p className="font-semibold text-[#0f0f12]">{d.name}</p>
      <p className="text-[#0f0f12]/40">{d.value} orçamento{d.value !== 1 ? "s" : ""}</p>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();

  const { data: orcamentos = [], isLoading } = useQuery({
    queryKey: ["admin-orcamentos"],
    queryFn: () => entities.Orcamento.listAll(),
    initialData: [],
  });

  const { data: tipologias = [] } = useQuery({
    queryKey: ["tipologias"],
    queryFn: () => entities.Tipologia.filter({ ativo: true }),
    initialData: [],
  });

  const stats = React.useMemo(() => {
    const total      = orcamentos.length;
    const emAndamento = orcamentos.filter(o => ["AGUARDANDO_APROVACAO", "AGUARDANDO_PAGAMENTO", "EM_PRODUCAO"].includes(o.status)).length;
    const concluidos  = orcamentos.filter(o => o.status === "AGUARDANDO_RETIRADA").length;
    const valorTotal  = orcamentos.filter(o => o.status !== "CANCELADO").reduce((s, o) => s + (o.preco_total || 0), 0);
    return { total, emAndamento, concluidos, valorTotal };
  }, [orcamentos]);

  const chartData = React.useMemo(() => {
    const counts = {};
    orcamentos.forEach(o => {
      const s = o.status || "AGUARDANDO_APROVACAO";
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([key, value]) => ({ name: STATUS_CONFIG[key]?.label || key, value, color: STATUS_CONFIG[key]?.color || "#94a3b8" }))
      .sort((a, b) => b.value - a.value);
  }, [orcamentos]);

  const firstName = user?.nome?.split(" ")[0] || "Admin";

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a8f] via-[#17348a] to-[#122a6b]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }} />
        <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-white/[0.04] rounded-full blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 w-40 h-40 bg-[#e8751a]/[0.08] rounded-full blur-2xl" />

        <div className="relative px-6 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[12px] font-medium text-white/35 uppercase tracking-[0.15em] mb-1">
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" }).replace(/^./, c => c.toUpperCase())}
            </p>
            <h1 className="text-[22px] font-semibold text-white tracking-tight">
              {getGreeting()}, {firstName}
            </h1>
            <p className="text-[13px] text-white/40 mt-0.5">
              {stats.emAndamento > 0
                ? `${stats.emAndamento} orçamento${stats.emAndamento > 1 ? "s" : ""} em andamento`
                : "Todos os orçamentos estão em dia"}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.08] border border-white/[0.08] px-4 py-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.12] flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-white" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[10px] text-white/35 uppercase tracking-wider leading-none">Tipologias ativas</p>
                <p className="text-[20px] font-bold text-white tabular-nums leading-tight">{tipologias.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total",        value: stats.total,        icon: FileText,     color: "#1a3a8f" },
          { label: "Em andamento", value: stats.emAndamento,  icon: Clock,        color: "#f59e0b" },
          { label: "Finalizados",  value: stats.concluidos,   icon: CheckCircle2, color: "#10b981" },
          { label: "Valor total",  value: fmt(stats.valorTotal), icon: DollarSign, color: "#7c3aed", small: true },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-[#0f0f12]/[0.06] p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.color + "15" }}>
                <card.icon className="w-4 h-4" style={{ color: card.color }} strokeWidth={2} />
              </div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: card.color }} />
            </div>
            <p className={`font-bold text-[#0f0f12] tabular-nums tracking-tight leading-none ${card.small ? "text-[18px] sm:text-[20px]" : "text-[28px] sm:text-[32px]"}`}>
              {card.value}
            </p>
            <p className="text-[11px] text-[#0f0f12]/35 font-medium mt-1.5 uppercase tracking-wider">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Middle: Chart + Quick Links ── */}
      <div className="grid lg:grid-cols-5 gap-4">

        {/* Pie chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#0f0f12]/[0.06] p-5">
          <p className="text-[14px] font-semibold text-[#0f0f12] leading-none">Distribuição</p>
          <p className="text-[12px] text-[#0f0f12]/35 mt-0.5 mb-4">{orcamentos.length} orçamentos</p>

          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-[180px] text-[13px] text-[#0f0f12]/25">
              Nenhum dado ainda
            </div>
          ) : (
            <>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value" stroke="none">
                      {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-3">
                {chartData.map(e => (
                  <div key={e.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
                      <span className="text-[12px] text-[#0f0f12]/50 truncate">{e.name}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-[#0f0f12] tabular-nums ml-2 shrink-0">{e.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Quick links */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#0f0f12]/[0.06] p-5">
          <p className="text-[14px] font-semibold text-[#0f0f12] leading-none mb-0.5">Acesso rápido</p>
          <p className="text-[12px] text-[#0f0f12]/35 mb-4">Navegue pelas seções do painel</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center gap-3 p-3.5 rounded-xl border border-[#0f0f12]/[0.05] hover:border-[#0f0f12]/[0.1] hover:bg-[#0f0f12]/[0.015] transition-all duration-150"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: link.color + "15" }}>
                  <link.icon className="w-4 h-4" style={{ color: link.color }} strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[#0f0f12]">{link.label}</p>
                  <p className="text-[11px] text-[#0f0f12]/35 truncate">{link.desc}</p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#0f0f12]/15 group-hover:text-[#0f0f12]/35 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-white rounded-2xl border border-[#0f0f12]/[0.06] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#0f0f12]/[0.05]">
          <div>
            <p className="text-[14px] font-semibold text-[#0f0f12]">Orçamentos recentes</p>
            <p className="text-[12px] text-[#0f0f12]/35 mt-0.5">Últimas movimentações</p>
          </div>
          {orcamentos.length > 5 && (
            <Link
              to="/admin/orcamentos"
              className="flex items-center gap-1 text-[12px] font-medium text-[#1a3a8f] hover:text-[#122a6b] transition-colors"
            >
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {orcamentos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-[#0f0f12]/[0.03] flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-[#0f0f12]/20" />
            </div>
            <p className="text-[14px] font-medium text-[#0f0f12]/40">Nenhum orçamento ainda</p>
            <p className="text-[12px] text-[#0f0f12]/25 mt-1">Os orçamentos criados aparecerão aqui</p>
          </div>
        ) : (
          <div className="divide-y divide-[#0f0f12]/[0.04]">
            {orcamentos.slice(0, 5).map(orc => {
              const cfg = STATUS_CONFIG[orc.status] || STATUS_CONFIG.AGUARDANDO_APROVACAO;
              return (
                <div key={orc.id} className="group flex items-center gap-4 px-5 py-3.5 hover:bg-[#0f0f12]/[0.015] transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-[#0f0f12] truncate">
                      {orc.numero || `#${String(orc.id || "").slice(-6)}`}
                    </p>
                    <p className="text-[12px] text-[#0f0f12]/35 truncate mt-0.5">
                      {[orc.tipologia_nome, orc.cliente_nome].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <span className="text-[12px] text-[#0f0f12]/40">{cfg.label}</span>
                  </div>
                  {orc.preco_total != null && (
                    <span className="text-[13px] font-semibold text-[#0f0f12] tabular-nums shrink-0 hidden sm:block">
                      {fmt(orc.preco_total)}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-[#0f0f12]/10 group-hover:text-[#0f0f12]/30 transition-colors shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Skeleton className="h-[120px] w-full rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-[110px] rounded-2xl" />)}
      </div>
      <div className="grid lg:grid-cols-5 gap-4">
        <Skeleton className="h-[340px] rounded-2xl lg:col-span-2" />
        <Skeleton className="h-[340px] rounded-2xl lg:col-span-3" />
      </div>
      <Skeleton className="h-[280px] rounded-2xl" />
    </div>
  );
}
