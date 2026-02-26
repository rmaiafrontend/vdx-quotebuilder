import React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function VidroTecnicoModal({
  open,
  onOpenChange,
  formState,
  setFormState,
  isEdit,
  onSave,
  isPending,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Tipo de Vidro Técnico" : "Novo Tipo de Vidro Técnico"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Código</Label>
              <Input
                value={formState.codigo}
                onChange={(e) => setFormState((p) => ({ ...p, codigo: e.target.value }))}
                placeholder="VC-001"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Nome</Label>
              <Input
                value={formState.nome}
                onChange={(e) => setFormState((p) => ({ ...p, nome: e.target.value }))}
                placeholder="Vidro Comum 4mm"
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Espessura</Label>
              <Input
                value={formState.espessura}
                onChange={(e) => setFormState((p) => ({ ...p, espessura: e.target.value }))}
                placeholder="4mm"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Tipo</Label>
              <Input
                value={formState.tipo}
                onChange={(e) => setFormState((p) => ({ ...p, tipo: e.target.value }))}
                placeholder="comum, temperado, laminado"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label>Cor (para visualização)</Label>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="color"
                value={formState.cor}
                onChange={(e) => setFormState((p) => ({ ...p, cor: e.target.value }))}
                className="w-16 h-10 rounded border"
              />
              <Input
                value={formState.cor}
                onChange={(e) => setFormState((p) => ({ ...p, cor: e.target.value }))}
                placeholder="#e2e8f0"
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formState.descricao}
              onChange={(e) => setFormState((p) => ({ ...p, descricao: e.target.value }))}
              placeholder="Descrição das características técnicas"
              className="mt-1"
              rows={3}
            />
          </div>
          <div>
            <Label>Preço por m² (configuração de preço)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formState.preco_m2}
              onChange={(e) =>
                setFormState((p) => ({ ...p, preco_m2: parseFloat(e.target.value) || 0 }))
              }
              placeholder="0.00"
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">
              Preço usado para cálculo do orçamento (não é um produto vendável)
            </p>
          </div>
          <div className="flex items-center justify-between">
            <Label>Ativo</Label>
            <Switch
              checked={formState.ativo}
              onCheckedChange={(checked) => setFormState((p) => ({ ...p, ativo: checked }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            disabled={!formState.nome || isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
