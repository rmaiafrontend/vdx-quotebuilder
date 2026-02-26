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

export default function TipoConfigModal({
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? "Editar Tipo de Configuração Técnica"
              : "Novo Tipo de Configuração Técnica"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Código *</Label>
              <Input
                value={formState.codigo}
                onChange={(e) => setFormState((p) => ({ ...p, codigo: e.target.value }))}
                placeholder="PUX_TEC"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Nome *</Label>
              <Input
                value={formState.nome}
                onChange={(e) => setFormState((p) => ({ ...p, nome: e.target.value }))}
                placeholder="Tipo de configuração"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formState.descricao}
              onChange={(e) => setFormState((p) => ({ ...p, descricao: e.target.value }))}
              placeholder="Descrição do tipo de configuração técnica"
              className="mt-1"
              rows={3}
            />
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
            disabled={!formState.nome || !formState.codigo || isPending}
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
