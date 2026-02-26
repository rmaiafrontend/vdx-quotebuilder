import React, { useState } from "react";
import { entities, integrations } from "@/api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import {
  TIPO_CONFIG_TECNICA_INICIAL,
  ITEM_CONFIG_TECNICA_INICIAL,
} from "./constants";
import TipoConfigModal from "./modals/TipoConfigModal";
import ItemConfigModal from "./modals/ItemConfigModal";
import ModalElementos from "./modals/ModalElementos";

export default function ConfiguracoesTab() {
  const queryClient = useQueryClient();
  const [modalTipoConfigOpen, setModalTipoConfigOpen] = useState(false);
  const [tipoConfigEditando, setTipoConfigEditando] = useState(null);
  const [formTipoConfig, setFormTipoConfig] = useState(TIPO_CONFIG_TECNICA_INICIAL);
  const [tipoConfigExcluir, setTipoConfigExcluir] = useState(null);

  const [modalItemConfigOpen, setModalItemConfigOpen] = useState(false);
  const [itemConfigEditando, setItemConfigEditando] = useState(null);
  const [formItemConfig, setFormItemConfig] = useState(ITEM_CONFIG_TECNICA_INICIAL);
  const [categoriaSelecionadaItem, setCategoriaSelecionadaItem] = useState(null);
  const [itemConfigExcluir, setItemConfigExcluir] = useState(null);

  const [modalElementosOpen, setModalElementosOpen] = useState(false);
  const [categoriaVisualizando, setCategoriaVisualizando] = useState(null);

  const { data: tiposConfiguracaoTecnica = [], isLoading: loadingTiposConfig } = useQuery({
    queryKey: ["tiposConfiguracaoTecnica"],
    queryFn: () => entities.TipoConfiguracaoTecnica.list("ordem"),
  });

  const { data: itensConfiguracaoTecnica = [], isLoading: loadingItensConfig } = useQuery({
    queryKey: ["itensConfiguracaoTecnica"],
    queryFn: () => entities.ItemConfiguracaoTecnica.list("nome"),
  });

  const createTipoConfigMutation = useMutation({
    mutationFn: (data) => entities.TipoConfiguracaoTecnica.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tiposConfiguracaoTecnica"]);
      setModalTipoConfigOpen(false);
      setFormTipoConfig(TIPO_CONFIG_TECNICA_INICIAL);
    },
  });

  const updateTipoConfigMutation = useMutation({
    mutationFn: ({ id, data }) => entities.TipoConfiguracaoTecnica.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tiposConfiguracaoTecnica"]);
      setModalTipoConfigOpen(false);
      setTipoConfigEditando(null);
      setFormTipoConfig(TIPO_CONFIG_TECNICA_INICIAL);
    },
  });

  const deleteTipoConfigMutation = useMutation({
    mutationFn: (id) => entities.TipoConfiguracaoTecnica.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["tiposConfiguracaoTecnica"]);
      setTipoConfigExcluir(null);
    },
  });

  const createItemConfigMutation = useMutation({
    mutationFn: (data) => entities.ItemConfiguracaoTecnica.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["itensConfiguracaoTecnica"]);
      setModalItemConfigOpen(false);
      setFormItemConfig(ITEM_CONFIG_TECNICA_INICIAL);
      setCategoriaSelecionadaItem(null);
    },
  });

  const updateItemConfigMutation = useMutation({
    mutationFn: ({ id, data }) => entities.ItemConfiguracaoTecnica.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["itensConfiguracaoTecnica"]);
      setModalItemConfigOpen(false);
      setItemConfigEditando(null);
      setFormItemConfig(ITEM_CONFIG_TECNICA_INICIAL);
      setCategoriaSelecionadaItem(null);
    },
  });

  const deleteItemConfigMutation = useMutation({
    mutationFn: (id) => entities.ItemConfiguracaoTecnica.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["itensConfiguracaoTecnica"]);
      setItemConfigExcluir(null);
    },
  });

  const abrirNovoTipoConfig = () => {
    setTipoConfigEditando(null);
    setFormTipoConfig({
      ...TIPO_CONFIG_TECNICA_INICIAL,
      ordem: tiposConfiguracaoTecnica.length,
    });
    setModalTipoConfigOpen(true);
  };

  const abrirEdicaoTipoConfig = (tipoConfig) => {
    setTipoConfigEditando(tipoConfig);
    setFormTipoConfig({
      nome: tipoConfig.nome || "",
      codigo: tipoConfig.codigo || "",
      descricao: tipoConfig.descricao || "",
      ordem: tipoConfig.ordem || 0,
      ativo: tipoConfig.ativo !== false,
    });
    setModalTipoConfigOpen(true);
  };

  const salvarTipoConfig = () => {
    if (tipoConfigEditando) {
      updateTipoConfigMutation.mutate({
        id: tipoConfigEditando.id,
        data: formTipoConfig,
      });
    } else {
      createTipoConfigMutation.mutate(formTipoConfig);
    }
  };

  const abrirNovoItemConfig = (categoriaId) => {
    setItemConfigEditando(null);
    setCategoriaSelecionadaItem(categoriaId);
    setFormItemConfig({
      ...ITEM_CONFIG_TECNICA_INICIAL,
      tipo_configuracao_id: categoriaId,
    });
    setModalItemConfigOpen(true);
  };

  const abrirEdicaoItemConfig = (itemConfig) => {
    setItemConfigEditando(itemConfig);
    setCategoriaSelecionadaItem(itemConfig.tipo_configuracao_id);
    setFormItemConfig({
      tipo_configuracao_id: itemConfig.tipo_configuracao_id || "",
      nome: itemConfig.nome || "",
      codigo: itemConfig.codigo || "",
      descricao: itemConfig.descricao || "",
      imagem_url: itemConfig.imagem_url || "",
      especificacoes: itemConfig.especificacoes || {},
      ativo: itemConfig.ativo !== false,
    });
    setModalItemConfigOpen(true);
  };

  const salvarItemConfig = () => {
    if (itemConfigEditando) {
      updateItemConfigMutation.mutate({
        id: itemConfigEditando.id,
        data: formItemConfig,
      });
    } else {
      createItemConfigMutation.mutate(formItemConfig);
    }
  };

  const handleItemConfigImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await integrations.Core.UploadFile({ file });
    setFormItemConfig((p) => ({ ...p, imagem_url: file_url }));
  };

  const elementosDaCategoria = categoriaVisualizando
    ? itensConfiguracaoTecnica.filter(
        (item) => item.tipo_configuracao_id === categoriaVisualizando.id
      )
    : [];
  const categoriaNome =
    categoriaSelecionadaItem &&
    tiposConfiguracaoTecnica.find((t) => t.id === categoriaSelecionadaItem)?.nome;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Configurações Personalizadas
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie categorias e seus elementos de configuração técnica
          </p>
        </div>
        <Button onClick={abrirNovoTipoConfig} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {loadingTiposConfig ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tiposConfiguracaoTecnica.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <Settings className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Nenhuma categoria cadastrada
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Comece criando sua primeira categoria de configuração técnica
              </p>
              <Button onClick={abrirNovoTipoConfig} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Categoria
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tiposConfiguracaoTecnica.map((tipoConfig, i) => {
            const elementos = itensConfiguracaoTecnica.filter(
              (item) => item.tipo_configuracao_id === tipoConfig.id
            );
            return (
              <motion.div
                key={tipoConfig.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className={`group h-full flex flex-col transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer border-2 hover:border-blue-300 ${!tipoConfig.ativo ? "opacity-60 border-slate-200" : "border-slate-200"}`}
                  onClick={() => {
                    setCategoriaVisualizando(tipoConfig);
                    setModalElementosOpen(true);
                  }}
                >
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-3 flex-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1.5">
                          <h3 className="font-bold text-slate-900 text-lg leading-tight">
                            {tipoConfig.nome}
                          </h3>
                          {!tipoConfig.ativo && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0.5 flex-shrink-0 mt-0.5"
                            >
                              Inativo
                            </Badge>
                          )}
                        </div>
                        {tipoConfig.codigo && (
                          <p className="text-xs text-slate-500 font-mono mb-1.5 bg-slate-50 px-2 py-0.5 rounded inline-block">
                            {tipoConfig.codigo}
                          </p>
                        )}
                        {tipoConfig.descricao && (
                          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {tipoConfig.descricao}
                          </p>
                        )}
                      </div>
                      <div
                        className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-blue-50 hover:text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirEdicaoTipoConfig(tipoConfig);
                          }}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTipoConfigExcluir(tipoConfig);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                      <div>
                        <p className="text-xs font-medium text-slate-700">
                          {elementos.length}{" "}
                          {elementos.length === 1 ? "elemento" : "elementos"}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Clique para visualizar
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <TipoConfigModal
        open={modalTipoConfigOpen}
        onOpenChange={setModalTipoConfigOpen}
        formState={formTipoConfig}
        setFormState={setFormTipoConfig}
        isEdit={!!tipoConfigEditando}
        onSave={salvarTipoConfig}
        isPending={
          createTipoConfigMutation.isPending || updateTipoConfigMutation.isPending
        }
      />

      <ItemConfigModal
        open={modalItemConfigOpen}
        onOpenChange={setModalItemConfigOpen}
        formState={formItemConfig}
        setFormState={setFormItemConfig}
        isEdit={!!itemConfigEditando}
        categoriaNome={categoriaNome}
        onSave={salvarItemConfig}
        isPending={
          createItemConfigMutation.isPending || updateItemConfigMutation.isPending
        }
        onImageUpload={handleItemConfigImageUpload}
      />

      <ModalElementos
        open={modalElementosOpen}
        onOpenChange={setModalElementosOpen}
        categoria={categoriaVisualizando}
        elementos={elementosDaCategoria}
        onAddElemento={abrirNovoItemConfig}
        onEditElemento={abrirEdicaoItemConfig}
        onDeleteElemento={(el) => {
          setItemConfigExcluir(el);
          setModalElementosOpen(false);
        }}
      />

      <DeleteConfirmDialog
        open={!!tipoConfigExcluir}
        onOpenChange={() => setTipoConfigExcluir(null)}
        title="Excluir tipo de configuração técnica?"
        description={`Tem certeza que deseja excluir "${tipoConfigExcluir?.nome}"? Todos os itens desta categoria também serão excluídos. Esta ação não pode ser desfeita.`}
        onConfirm={() => deleteTipoConfigMutation.mutate(tipoConfigExcluir?.id)}
        isPending={deleteTipoConfigMutation.isPending}
      />

      <DeleteConfirmDialog
        open={!!itemConfigExcluir}
        onOpenChange={() => setItemConfigExcluir(null)}
        title="Excluir item de configuração técnica?"
        itemName={itemConfigExcluir?.nome}
        onConfirm={() => deleteItemConfigMutation.mutate(itemConfigExcluir?.id)}
        isPending={deleteItemConfigMutation.isPending}
      />
    </div>
  );
}
