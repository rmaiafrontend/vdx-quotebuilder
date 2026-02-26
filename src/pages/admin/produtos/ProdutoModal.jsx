import React from "react";
import { Package, Save, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProdutoModal({
  open,
  onOpenChange,
  formState,
  setFormState,
  isEdit,
  categoriasProduto,
  onSave,
  isPending,
  onImageUpload,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Produto" : "Novo Produto"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nome *</Label>
              <Input
                value={formState.nome}
                onChange={(e) => setFormState((p) => ({ ...p, nome: e.target.value }))}
                placeholder="Nome do produto"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Código</Label>
              <Input
                value={formState.codigo}
                onChange={(e) => setFormState((p) => ({ ...p, codigo: e.target.value }))}
                placeholder="Código do produto"
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Categoria *</Label>
              <Select
                value={formState.categoria_id || undefined}
                onValueChange={(value) => setFormState((p) => ({ ...p, categoria_id: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasProduto.filter((c) => c.ativo).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Unidade</Label>
              <Select
                value={formState.unidade}
                onValueChange={(value) => setFormState((p) => ({ ...p, unidade: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unidade">Unidade</SelectItem>
                  <SelectItem value="metro">Metro</SelectItem>
                  <SelectItem value="kit">Kit</SelectItem>
                  <SelectItem value="par">Par</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formState.descricao}
              onChange={(e) => setFormState((p) => ({ ...p, descricao: e.target.value }))}
              placeholder="Descrição do produto"
              className="mt-1"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Preço *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formState.preco}
                onChange={(e) =>
                  setFormState((p) => ({ ...p, preco: parseFloat(e.target.value) || 0 }))
                }
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Ordem</Label>
              <Input
                type="number"
                value={formState.ordem}
                onChange={(e) =>
                  setFormState((p) => ({ ...p, ordem: parseInt(e.target.value) || 0 }))
                }
                placeholder="0"
                className="mt-1"
              />
            </div>
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
                  <Package className="w-6 h-6 text-slate-400" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={onImageUpload}
                  />
                </label>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Controle de Estoque</Label>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-slate-600">Ativar estoque</span>
                <Switch
                  checked={formState.estoque}
                  onCheckedChange={(checked) => setFormState((p) => ({ ...p, estoque: checked }))}
                />
              </div>
            </div>
            {formState.estoque && (
              <div>
                <Label>Quantidade em Estoque</Label>
                <Input
                  type="number"
                  min="0"
                  value={formState.estoque_quantidade}
                  onChange={(e) =>
                    setFormState((p) => ({
                      ...p,
                      estoque_quantidade: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            )}
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
              !formState.preco ||
              !formState.categoria_id ||
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
