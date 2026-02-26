import React, { useState } from "react";
import { entities, integrations } from "@/api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, LayoutGrid, GripVertical, Save, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import PageHeader from "@/components/admin/PageHeader";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { useCrudModal } from "@/hooks/useCrudModal";

const FORM_INICIAL = {
  nome: "",
  descricao: "",
  icone: "",
  imagem_url: "",
  ordem: 0,
  ativo: true,
};

export default function Categorias() {
  const queryClient = useQueryClient();
  const [categoriaExcluir, setCategoriaExcluir] = useState(null);
  const crud = useCrudModal(FORM_INICIAL);
  const { modalOpen, setModalOpen, editingItem, formState, setFormState, openNew, openEdit, close } = crud;

  const { data: categorias = [], isLoading } = useQuery({
    queryKey: ["categorias"],
    queryFn: () => entities.Categoria.list("ordem"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => entities.Categoria.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categorias"]);
      close();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => entities.Categoria.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categorias"]);
      close();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => entities.Categoria.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["categorias"]);
      setCategoriaExcluir(null);
    },
  });

  const abrirNovaCategoria = () => openNew({ ordem: categorias.length });
  const abrirEdicao = (categoria) =>
    openEdit(categoria, (c) => ({
      nome: c.nome || "",
      descricao: c.descricao || "",
      icone: c.icone || "",
      imagem_url: c.imagem_url || "",
      ordem: c.ordem || 0,
      ativo: c.ativo !== false,
    }));

  const salvar = () => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formState });
    } else {
      createMutation.mutate(formState);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await integrations.Core.UploadFile({ file });
    setFormState((prev) => ({ ...prev, imagem_url: file_url }));
  };

  return (
    <div className="w-full">
      <PageHeader
        title="Categorias"
        description="Organize suas tipologias em categorias"
        action={
          <Button onClick={abrirNovaCategoria} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : categorias.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <LayoutGrid className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-700 mb-1">Nenhuma categoria</h3>
          <p className="text-sm text-slate-500 mb-5">Crie a primeira para organizar suas tipologias</p>
          <Button onClick={abrirNovaCategoria} className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20">
            <Plus className="w-4 h-4 mr-2" />
            Criar categoria
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {categorias.map((categoria, i) => (
            <motion.div
              key={categoria.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Card className={`rounded-2xl border-slate-200/80 bg-white shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all duration-200 overflow-hidden ${!categoria.ativo ? "opacity-50" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-slate-300 cursor-move hover:text-slate-400 transition-colors">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    {categoria.imagem_url ? (
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 ring-1 ring-slate-200/80">
                        <img
                          src={categoria.imagem_url}
                          alt={categoria.nome}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center shrink-0 ring-1 ring-blue-200/50">
                        <span className="text-xl font-bold text-blue-600">
                          {categoria.nome?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 text-sm">{categoria.nome}</h3>
                        {!categoria.ativo && (
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                            Inativa
                          </span>
                        )}
                      </div>
                      {categoria.descricao && (
                        <p className="text-sm text-slate-500 mt-0.5 truncate">{categoria.descricao}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="rounded-lg hover:bg-slate-100" onClick={() => abrirEdicao(categoria)}>
                        <Pencil className="w-4 h-4 text-slate-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCategoriaExcluir(categoria)}
                        className="rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={formState.nome}
                onChange={(e) => setFormState((p) => ({ ...p, nome: e.target.value }))}
                placeholder="Ex: Janelas"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={formState.descricao}
                onChange={(e) => setFormState((p) => ({ ...p, descricao: e.target.value }))}
                placeholder="Descrição da categoria"
                className="mt-1"
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
                    <Image className="w-6 h-6 text-slate-400" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Ativa</Label>
              <Switch
                checked={formState.ativo}
                onCheckedChange={(checked) => setFormState((p) => ({ ...p, ativo: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>
              Cancelar
            </Button>
            <Button
              onClick={salvar}
              disabled={!formState.nome || createMutation.isPending || updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!categoriaExcluir}
        onOpenChange={() => setCategoriaExcluir(null)}
        title="Excluir categoria?"
        itemName={categoriaExcluir?.nome}
        onConfirm={() => deleteMutation.mutate(categoriaExcluir?.id)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
