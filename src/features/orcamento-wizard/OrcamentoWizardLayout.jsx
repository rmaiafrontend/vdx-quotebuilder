import React, { useEffect } from "react";
import { Check, ArrowLeft } from "lucide-react";

export default function OrcamentoWizardLayout({
  etapas,
  etapaAtual,
  company,
  primaryColor,
  rightSlot,
  backButton,
  children,
}) {
  const color = primaryColor || company?.primary_color || "#1a3a8f";

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [etapaAtual]);

  // Calculate progress percentage
  const progress = ((etapaAtual - 1) / (etapas.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      {/* Stepper */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-sm">
        {/* Progress bar */}
        <div className="h-1 bg-slate-100">
          <div
            className="h-full rounded-r-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${color}, ${color}cc)`
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 py-3">
          {/* Step indicators */}
          <div className="flex items-center justify-between gap-1">
            {etapas.map((etapa, i) => {
              const isCompleted = etapaAtual > etapa.id;
              const isCurrent = etapaAtual === etapa.id;
              const Icon = etapa.icone;

              return (
                <React.Fragment key={etapa.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        isCompleted
                          ? "text-white"
                          : isCurrent
                          ? "ring-2"
                          : "bg-slate-100 text-slate-400"
                      }`}
                      style={
                        isCompleted
                          ? { background: `linear-gradient(135deg, ${color}, ${color}cc)` }
                          : isCurrent
                          ? { backgroundColor: `${color}10`, color: color, boxShadow: `0 0 0 2px ${color}` }
                          : {}
                      }
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                      ) : (
                        <Icon className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span
                      className={`text-xs hidden sm:block transition-colors ${
                        isCurrent ? "font-semibold" : isCompleted ? "font-medium text-slate-600" : "text-slate-400"
                      }`}
                      style={isCurrent ? { color } : undefined}
                    >
                      {etapa.nome}
                    </span>
                  </div>
                  {i < etapas.length - 1 && (
                    <div className="flex-1 mx-2 sm:mx-3 h-px bg-slate-200" />
                  )}
                </React.Fragment>
              );
            })}
            {rightSlot && <div className="flex items-center ml-2 flex-shrink-0">{rightSlot}</div>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-5">
        {backButton && <div className="mb-4">{backButton}</div>}
        {children}
      </div>
    </div>
  );
}
