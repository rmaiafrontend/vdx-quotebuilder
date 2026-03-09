import React from "react";
import { motion } from "framer-motion";
import { Package, Pencil, Trash2, Variable, Calculator, Palette, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function TipologiaList({
  tipologias,
  isLoading,
  onNew,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[260px] w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (tipologias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-5">
          <Package className="w-9 h-9 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">Nenhuma tipologia encontrada</h3>
        <p className="text-sm text-slate-500 mb-6 text-center max-w-sm">
          Crie sua primeira tipologia para configurar modelos de produtos com fórmulas de cálculo
        </p>
        <Button onClick={onNew} className="bg-[#1a3a8f] hover:bg-[#152e73] rounded-xl shadow-md shadow-[#1a3a8f]/20 h-10 px-5 font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Criar tipologia
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {tipologias.map((tipologia) => (
        <motion.div
          key={tipologia.id}
          variants={item}
          className={`group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col ${!tipologia.ativo ? "opacity-60" : ""}`}
          onClick={() => onEdit(tipologia)}
        >
          {/* Image area */}
          <div className="relative h-36 bg-gradient-to-br from-slate-50 via-slate-100 to-[#1a3a8f]/10 overflow-hidden">
            {tipologia.imagens?.[0] ? (
              <img
                src={tipologia.imagens[0]}
                alt={tipologia.nome}
                className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-12 h-12 text-slate-300/80" />
              </div>
            )}

            {/* Status badge */}
            <div className="absolute top-3 left-3">
              <Badge
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm ${
                  tipologia.ativo
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}
              >
                {tipologia.ativo ? "Ativa" : "Inativa"}
              </Badge>
            </div>

            {/* Action buttons on hover */}
            <div
              className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm border border-slate-200/80"
                onClick={() => onEdit(tipologia)}
              >
                <Pencil className="w-3.5 h-3.5 text-slate-600" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-red-50 shadow-sm border border-slate-200/80"
                onClick={() => onDelete(tipologia)}
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-semibold text-slate-900 text-sm mb-1 line-clamp-1">{tipologia.nome}</h3>
            {tipologia.descricao && (
              <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{tipologia.descricao}</p>
            )}

            {/* Stat badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-3 border-t border-slate-100">
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#1a3a8f] bg-[#1a3a8f]/10 px-2 py-1 rounded-md">
                <Variable className="w-3 h-3" />
                {tipologia.variaveis?.length || 0}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 px-2 py-1 rounded-md">
                <Calculator className="w-3 h-3" />
                {tipologia.pecas?.length || 0}
              </span>
              {tipologia.tipos_vidro_ids?.length > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#1a3a8f] bg-[#2962cc]/10 px-2 py-1 rounded-md">
                  <Palette className="w-3 h-3" />
                  {tipologia.tipos_vidro_ids.length}
                </span>
              )}
              {tipologia.acessorio_ids?.length > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded-md">
                  <Package className="w-3 h-3" />
                  {tipologia.acessorio_ids.length}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
