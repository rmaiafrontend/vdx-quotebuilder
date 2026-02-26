import React from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriaProdutoList({
  categorias,
  isLoading,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (categorias.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Tag className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p>Nenhuma categoria cadastrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {categorias.map((categoria, i) => (
        <motion.div
          key={categoria.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          className={`group flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all ${!categoria.ativo ? "opacity-60" : ""}`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-900">{categoria.nome}</h3>
              {!categoria.ativo && (
                <Badge variant="secondary" className="text-xs">
                  Inativa
                </Badge>
              )}
            </div>
            {categoria.descricao && (
              <p className="text-sm text-slate-500">{categoria.descricao}</p>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(categoria)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(categoria)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
