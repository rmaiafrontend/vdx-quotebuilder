import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatarMedida } from "@/components/utils/calculoUtils";
import { STATUS_CONFIG } from "@/constants/orcamento";

export default function OrcamentoDetailDialog({
  orcamento,
  open,
  onOpenChange,
  onUpdateStatus,
  isUpdatingStatus,
}) {
  if (!orcamento) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-lg tracking-tight">Orçamento {orcamento.numero}</span>
            <div className="flex items-center gap-2 shrink-0">
              {orcamento.exemplo && (
                <Badge variant="outline" className="text-slate-500 border-slate-300">
                  Exemplo
                </Badge>
              )}
              <Badge className={STATUS_CONFIG[orcamento.status]?.color}>
                {STATUS_CONFIG[orcamento.status]?.label}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Cliente</p>
              <p className="font-semibold text-slate-900 text-sm">
                {orcamento.cliente_nome || "—"}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">Contato</p>
              <p className="font-semibold text-slate-900 text-sm">
                {orcamento.cliente_telefone || orcamento.cliente_email || "—"}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Produto</h4>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="font-semibold text-slate-900 text-sm">{orcamento.tipologia_nome}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Vidro: {orcamento.tipo_vidro_nome}
              </p>
            </div>
          </div>

          {orcamento.history && orcamento.history.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <History className="w-4 h-4 text-slate-400" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Histórico</h4>
              </div>
              <div className="relative pl-6 space-y-3 max-h-60 overflow-y-auto">
                <span className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-slate-200 rounded-full" />
                {[...orcamento.history]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((entry, index) => (
                    <div key={index} className="relative">
                      <span className={`absolute -left-6 top-3 w-3 h-3 rounded-full border-2 border-white shadow-sm ${index === 0 ? "bg-blue-500" : "bg-slate-300"}`} />
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-sm font-medium text-slate-900">{entry.action}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-slate-500">
                            {format(new Date(entry.date), "dd MMM yyyy · HH:mm", { locale: ptBR })}
                          </p>
                          {entry.user && (
                            <>
                              <span className="text-xs text-slate-300">·</span>
                              <p className="text-xs text-slate-500">{entry.user}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {orcamento.variaveis_entrada?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Medidas do Vão</h4>
              <div className="grid grid-cols-3 gap-2">
                {orcamento.variaveis_entrada.map((v, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500 mb-0.5">{v.label || v.nome}</p>
                    <p className="font-bold text-slate-900 tabular-nums">
                      {v.valor} {v.unidade}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {orcamento.pecas_calculadas?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Peças</h4>
              <div className="space-y-2">
                {orcamento.pecas_calculadas.map((peca, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{peca.nome}</p>
                      <p className="text-xs text-slate-500 tabular-nums">
                        {formatarMedida(peca.largura_real_mm, "mm")} × {formatarMedida(peca.altura_real_mm, "mm")}
                      </p>
                    </div>
                    <p className="font-medium text-slate-700 text-sm tabular-nums">
                      {peca.area_cobranca_m2?.toFixed(3)} m²
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50/70 rounded-2xl p-5 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Área Total (cobrança)</span>
              <span className="font-medium text-sm tabular-nums">
                {orcamento.area_total_cobranca_m2?.toFixed(3)} m²
              </span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-600">Preço por m²</span>
              <span className="font-medium text-sm tabular-nums">
                R$ {orcamento.preco_m2?.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-blue-200/80 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-xl font-bold text-blue-700 tabular-nums">
                  R${" "}
                  {orcamento.preco_total?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          {!orcamento.exemplo && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Atualizar Status</h4>
            <Select
              value={orcamento.status}
              onValueChange={(status) => onUpdateStatus(orcamento.id, status)}
              disabled={isUpdatingStatus}
            >
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
