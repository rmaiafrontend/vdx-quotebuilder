import React from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function ModalElementos({
  open,
  onOpenChange,
  categoria,
  elementos,
  onAddElemento,
  onEditElemento,
  onDeleteElemento,
}) {
  if (!categoria) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{categoria.nome}</DialogTitle>
          {categoria.descricao && (
            <p className="text-sm text-slate-500 mt-1">{categoria.descricao}</p>
          )}
        </DialogHeader>
        <div className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <Badge variant="outline" className="text-sm font-medium">
                {elementos.length}{" "}
                {elementos.length === 1 ? "elemento" : "elementos"}
              </Badge>
              <Button
                onClick={() => {
                  onAddElemento(categoria.id);
                  onOpenChange(false);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Elemento
              </Button>
            </div>

            {elementos.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <Settings className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Nenhum elemento cadastrado
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  Comece adicionando o primeiro elemento a esta categoria
                </p>
                <Button
                  onClick={() => {
                    onAddElemento(categoria.id);
                    onOpenChange(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Elemento
                </Button>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-2">
                {elementos.map((elemento, index) => (
                  <motion.div
                    key={elemento.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                  >
                    {elemento.imagem_url ? (
                      <img
                        src={elemento.imagem_url}
                        alt={elemento.nome}
                        className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center flex-shrink-0">
                        <Settings className="w-5 h-5 text-slate-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 text-sm">
                          {elemento.nome}
                        </span>
                        {elemento.codigo && (
                          <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">
                            {elemento.codigo}
                          </span>
                        )}
                      </div>
                      {elemento.descricao && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {elemento.descricao}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          onEditElemento(elemento);
                          onOpenChange(false);
                        }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          onDeleteElemento(elemento);
                          onOpenChange(false);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
