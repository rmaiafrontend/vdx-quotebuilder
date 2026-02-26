import React from "react";
import { Save, Settings, X } from "lucide-react";
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

export default function ItemConfigModal({
  open,
  onOpenChange,
  formState,
  setFormState,
  isEdit,
  categoriaNome,
  onSave,
  isPending,
  onImageUpload,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? "Editar Item de Configuração Técnica"
              : "Novo Item de Configuração Técnica"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {categoriaNome && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Categoria:</span> {categoriaNome}
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Código *</Label>
              <Input
                value={formState.codigo}
                onChange={(e) => setFormState((p) => ({ ...p, codigo: e.target.value }))}
                placeholder="PUX-FC"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Nome *</Label>
              <Input
                value={formState.nome}
                onChange={(e) => setFormState((p) => ({ ...p, nome: e.target.value }))}
                placeholder="Furação Central"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formState.descricao}
              onChange={(e) => setFormState((p) => ({ ...p, descricao: e.target.value }))}
              placeholder="Descrição do item de configuração técnica"
              className="mt-1"
              rows={3}
            />
          </div>
          <div>
            <Label>Imagem</Label>
            <div className="mt-1 flex items-center gap-4">
              {formState.imagem_url ? (
                <div className="relative">
                  <img
                    src={formState.imagem_url}
                    alt="Preview"
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6"
                    onClick={() => setFormState((p) => ({ ...p, imagem_url: "" }))}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <Settings className="w-6 h-6 text-slate-400" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={onImageUpload}
                  />
                </label>
              )}
              <p className="text-xs text-slate-500">Clique para fazer upload de uma imagem</p>
            </div>
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
            disabled={
              !formState.nome ||
              !formState.codigo ||
              !formState.tipo_configuracao_id ||
              isPending
            }
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
