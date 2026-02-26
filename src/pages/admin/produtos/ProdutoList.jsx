import React from "react";
import { motion } from "framer-motion";
import { Package, Pencil, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
export default function ProdutoList({
  produtosFiltrados,
  categoriasProduto,
  isLoading,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-56 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (produtosFiltrados.length === 0) {
    return (
      <div className="p-10 text-center rounded-2xl border border-dashed border-slate-200">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <ShoppingCart className="w-7 h-7 text-slate-400" />
        </div>
        <h3 className="font-semibold text-slate-700 mb-1">Nenhum produto</h3>
        <p className="text-sm text-slate-500">Cadastre o primeiro para começar</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {produtosFiltrados.map((produto, i) => {
        const categoria =
          categoriasProduto.find((c) => c.id === produto.categoria_id) ||
          (produto.categoria ? { nome: produto.categoria } : null);
        return (
          <motion.div
            key={produto.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
          >
            <Card className={`h-full rounded-2xl border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all duration-200 overflow-hidden ${!produto.ativo ? "opacity-50" : ""}`}>
              {produto.imagem_url ? (
                <div className="aspect-video bg-slate-50 overflow-hidden">
                  <img
                    src={produto.imagem_url}
                    alt={produto.nome}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                  <Package className="w-10 h-10 text-slate-300" />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {categoria && (
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      {categoria.nome}
                    </span>
                  )}
                  {produto.estoque && (
                    <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Estoque: {produto.estoque_quantidade}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm truncate">{produto.nome}</h3>
                {produto.codigo && (
                  <p className="text-xs text-slate-500 mt-0.5">{produto.codigo}</p>
                )}
                {produto.descricao && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{produto.descricao}</p>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/80">
                  <div>
                    <p className="text-base font-bold text-slate-900 tabular-nums">
                      R$ {produto.preco.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">por {produto.unidade}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100" onClick={() => onEdit(produto)}>
                      <Pencil className="w-4 h-4 text-slate-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onDelete(produto)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
