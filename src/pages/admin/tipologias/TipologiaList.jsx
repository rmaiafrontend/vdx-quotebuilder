import React from "react";
import { motion } from "framer-motion";
import { Package, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function TipologiaList({
  tipologias,
  isLoading,
  onNew,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (tipologias.length === 0) {
    return (
      <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Package className="w-7 h-7 text-slate-400" />
        </div>
        <h3 className="font-semibold text-slate-700 mb-1">Nenhuma tipologia</h3>
        <p className="text-sm text-slate-500 mb-5">Crie a primeira para configurar seus modelos</p>
        <Button onClick={onNew} className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20">
          Criar tipologia
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tipologias.map((tipologia, i) => (
        <motion.div
          key={tipologia.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          className={`group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all duration-200 cursor-pointer ${!tipologia.ativo ? "opacity-50" : ""}`}
          onClick={() => onEdit(tipologia)}
        >
          <div className="shrink-0">
            {tipologia.imagens?.[0] ? (
              <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden ring-1 ring-slate-200/80">
                <img
                  src={tipologia.imagens[0]}
                  alt={tipologia.nome}
                  className="w-full h-full object-contain p-1.5"
                />
              </div>
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center ring-1 ring-slate-200/50">
                <Package className="w-6 h-6 text-slate-300" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-slate-900 text-sm truncate">{tipologia.nome}</h3>
              {!tipologia.ativo && (
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                  Inativa
                </span>
              )}
            </div>
            {tipologia.descricao && (
              <p className="text-xs text-slate-500 truncate mb-2">{tipologia.descricao}</p>
            )}
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                {tipologia.variaveis?.length || 0} variáveis
              </Badge>
              <Badge variant="secondary" className="bg-green-50 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                {tipologia.pecas?.length || 0} peças
              </Badge>
              {tipologia.acessorio_ids?.length > 0 && (
                <Badge variant="secondary" className="bg-purple-50 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                  {tipologia.acessorio_ids.length} acessórios
                </Badge>
              )}
              {tipologia.tipos_vidro_ids?.length > 0 && (
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                  {tipologia.tipos_vidro_ids.length} vidros
                </Badge>
              )}
            </div>
          </div>
          <div
            className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100" onClick={() => onEdit(tipologia)}>
              <Pencil className="w-4 h-4 text-slate-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => onDelete(tipologia)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
