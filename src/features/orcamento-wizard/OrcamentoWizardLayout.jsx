import React from "react";
import { Check } from "lucide-react";

export default function OrcamentoWizardLayout({
  etapas,
  etapaAtual,
  company,
  primaryColor,
  rightSlot,
  backButton,
  children,
}) {
  const color = primaryColor || company?.primary_color || "#1e88e5";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      {/* Header */}
      <header
        className="px-5 py-4 flex items-center justify-between sticky top-0 z-30 shadow-lg"
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
        {rightSlot && <div className="relative flex items-center gap-1">{rightSlot}</div>}
      </header>

      {/* Stepper */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/80 sticky top-[60px] z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between">
            {etapas.map((etapa, i) => (
              <React.Fragment key={etapa.id}>
                <div className="flex items-center gap-2.5 transition-colors">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      etapaAtual > etapa.id
                        ? "text-white shadow-lg"
                        : etapaAtual === etapa.id
                        ? "ring-2 shadow-sm"
                        : "bg-slate-100 text-slate-400"
                    }`}
                    style={
                      etapaAtual > etapa.id
                        ? { background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 4px 12px ${color}40` }
                        : etapaAtual === etapa.id
                        ? { backgroundColor: `${color}12`, color: color, ringColor: color, borderColor: color, boxShadow: `0 0 0 2px ${color}` }
                        : {}
                    }
                  >
                    {etapaAtual > etapa.id ? (
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    ) : (
                      <etapa.icone className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${
                    etapaAtual === etapa.id ? "font-semibold" : etapaAtual > etapa.id ? "" : "text-slate-400"
                  }`} style={etapaAtual >= etapa.id ? { color: etapaAtual === etapa.id ? color : '#334155' } : {}}>
                    {etapa.nome}
                  </span>
                </div>
                {i < etapas.length - 1 && (
                  <div className="flex-1 mx-3 h-1 rounded-full overflow-hidden bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: etapaAtual > etapa.id ? "100%" : "0%",
                        background: `linear-gradient(90deg, ${color}, ${color}cc)`
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {backButton && <div className="mb-5">{backButton}</div>}
        {children}
      </div>
    </div>
  );
}
