import React from "react";
import { Check } from "lucide-react";

/**
 * Layout do wizard de orçamento: header (logo, nome, ações) + barra de progresso das etapas.
 * @param {Array<{ id: number, nome: string, icone: React.Component }>} etapas - Lista de etapas (ETAPAS_PUBLICO ou ETAPAS_ADMIN)
 * @param {number} etapaAtual - Índice da etapa atual (1-based)
 * @param {object} company - { name, logo_url, primary_color }
 * @param {string} primaryColor - Cor primária (fallback)
 * @param {React.ReactNode} [rightSlot] - Conteúdo à direita do header (ex: ícone do carrinho)
 * @param {React.ReactNode} [backButton] - Botão/link Voltar (renderizado acima do conteúdo)
 * @param {React.ReactNode} children - Conteúdo da etapa
 */
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header
        className="px-5 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
      >
        <div className="flex items-center gap-3">
          {company?.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              className="w-10 h-10 rounded-xl bg-white p-1 object-cover shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30">
              <span className="font-bold text-lg text-white">
                {company?.name?.charAt(0) || "V"}
              </span>
            </div>
          )}
          <h1 className="text-white font-semibold text-lg tracking-tight">{company?.name || "Orçamentos"}</h1>
        </div>
        {rightSlot && <div className="flex items-center gap-1">{rightSlot}</div>}
      </header>

      {/* Stepper */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/80 sticky top-[60px] z-20">
        <div className="max-w-5xl mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between">
            {etapas.map((etapa, i) => (
              <React.Fragment key={etapa.id}>
                <div
                  className={`flex items-center gap-2.5 transition-colors ${
                    etapaAtual >= etapa.id ? "text-blue-600" : "text-slate-400"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      etapaAtual > etapa.id
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                        : etapaAtual === etapa.id
                        ? "bg-blue-50 text-blue-600 ring-2 ring-blue-500"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {etapaAtual > etapa.id ? (
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    ) : (
                      <etapa.icone className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${
                    etapaAtual === etapa.id ? "font-semibold" : ""
                  }`}>{etapa.nome}</span>
                </div>
                {i < etapas.length - 1 && (
                  <div className="flex-1 mx-3 h-0.5 rounded-full overflow-hidden bg-slate-200">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: etapaAtual > etapa.id ? "100%" : "0%" }}
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
