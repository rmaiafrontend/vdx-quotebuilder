import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart, Trash2, Plus, ArrowRight
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, VisuallyHidden } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCarrinho } from "@/hooks/useCarrinho";
import { useCompanyTheme } from "@/hooks/useCompanyTheme";

export default function CarrinhoDrawer() {
  const navigate = useNavigate();
  const { primaryColor } = useCompanyTheme();
  const {
    carrinho, precoTotalCarrinho, removerDoCarrinho,
    isDrawerOpen, setDrawerOpen,
  } = useCarrinho();
  const color = primaryColor || "#1a3a8f";

  const handleClose = () => setDrawerOpen(false);

  const handleFinalizar = () => {
    setDrawerOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={(open) => { if (!open) handleClose(); else setDrawerOpen(true); }}>
      <SheetContent side="bottom" className="p-0 rounded-t-2xl max-h-[75vh] flex flex-col">
        <VisuallyHidden><SheetTitle>Carrinho</SheetTitle></VisuallyHidden>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="px-4 pb-3 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-slate-600" />
            <span className="text-base font-bold text-slate-900">Carrinho</span>
            {carrinho.length > 0 && (
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md text-white" style={{ backgroundColor: color }}>
                {carrinho.length}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {carrinho.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                <ShoppingCart className="w-7 h-7 text-slate-300" />
              </div>
              <p className="font-semibold text-slate-500 mb-1">Carrinho vazio</p>
              <p className="text-sm text-slate-400 mb-5">Adicione itens ao seu orçamento</p>
              <Button
                onClick={() => { setDrawerOpen(false); navigate("/orcamento"); }}
                className="rounded-xl font-semibold text-white h-10 px-6"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
              >
                <Plus className="w-4 h-4 mr-1.5" /> Novo Item
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {carrinho.map((item, idx) => (
                <div key={item.id} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5" style={{ backgroundColor: color }}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-slate-900 leading-tight">{item.tipologia_nome}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-3 h-3 rounded-sm border border-slate-200 shadow-sm flex-shrink-0" style={{ backgroundColor: item.tipo_vidro_cor || '#e2e8f0' }} />
                        <span className="text-xs text-slate-500 truncate">{item.tipo_vidro_nome}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                          {item.pecas_calculadas.length} {item.pecas_calculadas.length === 1 ? 'peça' : 'peças'}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                          {item.area_total_cobranca_m2?.toFixed(2)} m²
                        </span>
                        {item.acessorios_selecionados?.length > 0 && (
                          <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                            {item.acessorios_selecionados.length} acess.
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        R$ {item.preco_total_item.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <button
                        type="button"
                        onClick={() => removerDoCarrinho(item.id)}
                        className="text-red-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {carrinho.length > 0 && (
          <div className="border-t border-slate-100 p-4 bg-white pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">Total</span>
              <span className="text-xl font-bold tabular-nums" style={{ color }}>
                R$ {precoTotalCarrinho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="space-y-2">
              <Button
                onClick={handleFinalizar}
                className="w-full h-12 rounded-xl font-semibold text-base shadow-lg text-white"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 4px 14px ${color}35` }}
              >
                Finalizar Pedido <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => { setDrawerOpen(false); navigate("/orcamento"); }}
                variant="outline"
                className="w-full h-10 rounded-xl font-medium text-sm border-slate-200"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Adicionar Mais Itens
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
