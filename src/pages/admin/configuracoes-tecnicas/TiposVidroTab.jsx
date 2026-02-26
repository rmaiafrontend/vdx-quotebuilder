import React, { useState } from "react";
import { entities } from "@/api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { TIPO_VIDRO_TECNICO_INICIAL } from "./constants";
import VidroTecnicoModal from "./modals/VidroTecnicoModal";

export default function TiposVidroTab() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formState, setFormState] = useState(TIPO_VIDRO_TECNICO_INICIAL);
  const [excluir, setExcluir] = useState(null);

  const { data: tiposVidroTecnicos = [], isLoading } = useQuery({
    queryKey: ["tiposVidroTecnicos"],
    queryFn: () => entities.TipoVidroTecnico.list("ordem"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => entities.TipoVidroTecnico.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tiposVidroTecnicos"]);
      setModalOpen(false);
      setFormState(TIPO_VIDRO_TECNICO_INICIAL);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => entities.TipoVidroTecnico.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tiposVidroTecnicos"]);
      setModalOpen(false);
      setEditingItem(null);
      setFormState(TIPO_VIDRO_TECNICO_INICIAL);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => entities.TipoVidroTecnico.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["tiposVidroTecnicos"]);
      setExcluir(null);
    },
  });

  const abrirNovo = () => {
    setEditingItem(null);
    setFormState({ ...TIPO_VIDRO_TECNICO_INICIAL, ordem: tiposVidroTecnicos.length });
    setModalOpen(true);
  };

  const abrirEdicao = (vidro) => {
    setEditingItem(vidro);
    setFormState({
      codigo: vidro.codigo || "",
      nome: vidro.nome || "",
      espessura: vidro.espessura || "",
      tipo: vidro.tipo || "comum",
      cor: vidro.cor || "#e2e8f0",
      descricao: vidro.descricao || "",
      caracteristicas: vidro.caracteristicas || [],
      preco_m2: vidro.preco_m2 || 0,
      ativo: vidro.ativo !== false,
      ordem: vidro.ordem || 0,
    });
    setModalOpen(true);
  };

  const salvar = () => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formState });
    } else {
      createMutation.mutate(formState);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tipos de Vidro Técnicos</CardTitle>
            <CardDescription>
              Características técnicas do vidro (espessura, tipo, cor) - sem preço
            </CardDescription>
          </div>
          <Button onClick={abrirNovo} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Tipo
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : tiposVidroTecnicos.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Palette className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p>Nenhum tipo de vidro técnico cadastrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tiposVidroTecnicos.map((vidro, i) => (
                <motion.div
                  key={vidro.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center justify-between p-4 bg-slate-50 rounded-lg ${!vidro.ativo ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-white shadow"
                      style={{ backgroundColor: vidro.cor || "#e2e8f0" }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{vidro.nome}</span>
                        <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                          {vidro.codigo}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {vidro.espessura} • {vidro.tipo}
                        {vidro.preco_m2 > 0 && (
                          <span className="ml-2 text-green-600 font-medium">
                            • R$ {vidro.preco_m2.toFixed(2)}/m²
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => abrirEdicao(vidro)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setExcluir(vidro)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <VidroTecnicoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        formState={formState}
        setFormState={setFormState}
        isEdit={!!editingItem}
        onSave={salvar}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={!!excluir}
        onOpenChange={() => setExcluir(null)}
        title="Excluir tipo de vidro técnico?"
        itemName={excluir?.nome}
        onConfirm={() => deleteMutation.mutate(excluir?.id)}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
