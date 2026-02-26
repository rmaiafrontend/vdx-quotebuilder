import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { FileText, Eye, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUS_CONFIG } from "@/constants/orcamento";

export default function OrcamentoList({
  orcamentosFiltrados,
  isLoading,
  busca,
  filtroStatus,
  onSelect,
  onDelete,
  isDeleting,
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (orcamentosFiltrados.length === 0) {
    return (
      <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <FileText className="w-7 h-7 text-slate-400" />
        </div>
        <h3 className="font-semibold text-slate-700 mb-1">
          {busca || filtroStatus !== "todos"
            ? "Nenhum resultado"
            : "Nenhum orçamento"}
        </h3>
        <p className="text-sm text-slate-500 mb-5">
          {busca || filtroStatus !== "todos"
            ? "Tente alterar os filtros de busca"
            : "Crie o primeiro para começar"}
        </p>
        {!busca && filtroStatus === "todos" && (
          <Link to="/admin/orcamentos/novo">
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20">
              Criar orçamento
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orcamentosFiltrados.map((orcamento, i) => {
        const StatusIcon = STATUS_CONFIG[orcamento.status]?.icon || FileText;
        return (
          <motion.div
            key={orcamento.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
          >
            <Card
              className="rounded-2xl border-slate-200/80 bg-white shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all duration-200 cursor-pointer overflow-hidden"
              onClick={() => onSelect(orcamento)}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <StatusIcon className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="font-semibold text-slate-900 text-sm">
                          {orcamento.numero || `#${String(orcamento.id || "").slice(-6)}`}
                        </h3>
                        {orcamento.exemplo && (
                          <Badge variant="outline" className="text-[11px] text-slate-500 border-slate-300">
                            Exemplo
                          </Badge>
                        )}
                        <Badge className={`text-[11px] ${STATUS_CONFIG[orcamento.status]?.color}`}>
                          {STATUS_CONFIG[orcamento.status]?.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        {orcamento.tipologia_nome || "Tipologia"}
                        {orcamento.cliente_nome && ` · ${orcamento.cliente_nome}`}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {orcamento.created_date &&
                          format(new Date(orcamento.created_date), "dd MMM yyyy", {
                            locale: ptBR,
                          })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-right">
                      <p className="text-base font-bold text-slate-900 tabular-nums">
                        R${" "}
                        {(orcamento.preco_total || 0).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-slate-500">
                        {orcamento.area_total_cobranca_m2?.toFixed(3)} m² · {orcamento.tipo_vidro_nome}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(orcamento);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalhes
                        </DropdownMenuItem>
                        {!orcamento.exemplo && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(orcamento.id);
                            }}
                            className="text-red-600"
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
