import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowDown, Maximize2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatarMedida } from "../utils/calculoUtils";

// Desenho geométrico proporcional
const DesenhoGeometrico = ({ largura, altura, larguraFormatada, alturaFormatada }) => {
  const escalaMax = 200;
  const proporcao = Math.min(
    escalaMax / (largura || 1),
    escalaMax / (altura || 1),
    1
  );
  const larguraVisual = Math.max((largura || 100) * proporcao, 100);
  const alturaVisual = Math.max((altura || 100) * proporcao, 100);

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      {/* Largura label (topo) */}
      <div className="flex items-center gap-1.5 text-[#1a3a8f] mb-3">
        <div className="h-px w-8 bg-[#1a3a8f]/30" />
        <span className="text-[11px] font-bold tabular-nums whitespace-nowrap">{larguraFormatada}</span>
        <div className="h-px w-8 bg-[#1a3a8f]/30" />
      </div>

      <div className="flex items-center gap-3">
        {/* Altura label (esquerda) */}
        <div className="flex flex-col items-center gap-1.5 text-[#1a3a8f]">
          <div className="w-px h-6 bg-[#1a3a8f]/30" />
          <span className="text-[11px] font-bold tabular-nums whitespace-nowrap -rotate-90">{alturaFormatada}</span>
          <div className="w-px h-6 bg-[#1a3a8f]/30" />
        </div>

        {/* Retângulo */}
        <div
          className="border-2 border-[#1a3a8f]/60 bg-[#1a3a8f]/[0.04] rounded-sm relative"
          style={{ width: `${larguraVisual}px`, height: `${alturaVisual}px` }}
        >
          {/* Cantos decorativos */}
          <div className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 border-[#1a3a8f] rounded-tl-sm" />
          <div className="absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2 border-[#1a3a8f] rounded-tr-sm" />
          <div className="absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2 border-[#1a3a8f] rounded-bl-sm" />
          <div className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 border-[#1a3a8f] rounded-br-sm" />

          {/* Diagonais sutis */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="#1a3a8f" strokeWidth="1" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="#1a3a8f" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Pill de medida
const MedidaPill = ({ icon: Icon, label, value, variant = "blue" }) => {
  const variants = {
    blue: "bg-[#1a3a8f]/[0.06] text-[#1a3a8f]",
    indigo: "bg-[#2962cc]/[0.06] text-[#2962cc]",
    emerald: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${variants[variant]}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        variant === "emerald" ? "bg-emerald-500" : variant === "indigo" ? "bg-[#2962cc]" : "bg-[#1a3a8f]"
      }`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium opacity-60 uppercase tracking-wide">{label}</p>
        <p className="text-lg font-bold tabular-nums leading-tight">{value}</p>
      </div>
    </div>
  );
};

export default function PecaConferencia({
  peca,
  unidadeOriginal,
  onConfirmar,
  confirmada,
  index,
  total,
  configuracoesTecnicas = [],
  itensConfiguracao = {},
  onConfiguracaoChange
}) {
  const largura = formatarMedida(peca.largura_real_mm, unidadeOriginal);
  const altura = formatarMedida(peca.altura_real_mm, unidadeOriginal);
  const area = peca.area_real_m2?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const todasConfiguracoesPreenchidas = !(configuracoesTecnicas || []).some((config, idx) => {
    if (!config.obrigatorio) return false;
    const valor = peca.configuracoes_tecnicas?.[idx]?.valor;
    return !valor || valor === '';
  });

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header chip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a3a8f] to-[#2962cc] flex items-center justify-center shadow-md shadow-[#1a3a8f]/20">
            <span className="text-white font-bold text-sm">{index + 1}</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base leading-tight">{peca.nome}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Peça {index + 1} de {total}</p>
          </div>
        </div>
        <AnimatePresence>
          {confirmada && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-semibold ring-1 ring-emerald-200"
            >
              <Check className="w-3.5 h-3.5" />
              Conferido
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desenho / Imagem */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-200/80 shadow-sm overflow-hidden">
        {peca.imagem_url ? (
          <div className="p-2">
            <img
              src={peca.imagem_url}
              alt={`Peça ${peca.nome}`}
              className="w-full h-auto max-h-72 object-contain rounded-xl"
            />
          </div>
        ) : (
          <DesenhoGeometrico
            largura={peca.largura_real_mm}
            altura={peca.altura_real_mm}
            larguraFormatada={largura}
            alturaFormatada={altura}
          />
        )}
      </div>

      {/* Medidas */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-200/80 shadow-sm p-4 space-y-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          <MedidaPill icon={ArrowRight} label="Largura" value={largura} variant="blue" />
          <MedidaPill icon={ArrowDown} label="Altura" value={altura} variant="indigo" />
        </div>
        <MedidaPill icon={Maximize2} label="Área Total" value={`${area} m²`} variant="emerald" />
      </div>

      {/* Configurações Técnicas */}
      {configuracoesTecnicas && configuracoesTecnicas.length > 0 && (
        <div className="bg-white rounded-2xl ring-1 ring-slate-200/80 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Configurações Técnicas</span>
          </div>
          <div className="space-y-4">
            {configuracoesTecnicas.map((config, configIndex) => {
              const itensDisponiveis = config.itens_ids && config.itens_ids.length > 0
                ? (itensConfiguracao[config.categoria] || []).filter(item =>
                    config.itens_ids.includes(item.id)
                  )
                : (itensConfiguracao[config.categoria] || []);

              const valorAtual = peca.configuracoes_tecnicas?.[configIndex]?.valor || '';
              const categoriaNome = config.categoria || 'Configuração';

              return (
                <div key={config.id || configIndex}>
                  <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                    {categoriaNome}
                    {config.obrigatorio && !confirmada && <span className="text-red-500 ml-0.5">*</span>}
                  </Label>
                  {itensDisponiveis.length > 0 ? (
                    <>
                      <Select
                        value={valorAtual}
                        onValueChange={(value) => onConfiguracaoChange && onConfiguracaoChange(configIndex, value)}
                        disabled={confirmada}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#1a3a8f] focus:ring-[#1a3a8f]/20">
                          <SelectValue placeholder={`Selecione ${categoriaNome.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {itensDisponiveis.map(item => (
                            <SelectItem key={item.id} value={item.nome || item.id}>
                              {item.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {config.obrigatorio && !valorAtual && !confirmada && (
                        <p className="text-[11px] text-red-500 mt-1.5">
                          Obrigatório selecionar {categoriaNome.toLowerCase()}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-slate-400 py-2">
                      Nenhum item disponível
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botão de confirmação */}
      {!confirmada && (
        <Button
          onClick={onConfirmar}
          disabled={!todasConfiguracoesPreenchidas}
          className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Check className="w-5 h-5 mr-2" />
          Confirmar Medidas
        </Button>
      )}
    </motion.div>
  );
}
