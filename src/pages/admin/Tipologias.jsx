import React, { useState, useMemo } from "react";
import { entities, integrations } from "@/api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Package, Search, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { validarFormulasTipologia } from "@/components/utils/calculoUtils";
import { FORM_INICIAL } from "./tipologias/constants";
import { useTipologiaForm } from "./tipologias/hooks/useTipologiaForm";
import { normalizarTipologia } from "./tipologias/normalizarTipologia";
import TipologiaList from "./tipologias/TipologiaList";
import TipologiaModal from "./tipologias/TipologiaModal";

export default function Tipologias() {
  const queryClient = useQueryClient();
  const [modalAberto, setModalAberto] = useState(false);
  const [tipologiaEditando, setTipologiaEditando] = useState(null);
  const [tipologiaExcluir, setTipologiaExcluir] = useState(null);
  const [busca, setBusca] = useState("");

  const {
    formData, setFormData, resetForm,
    addImagem, setPecaImagem,
    adicionarVariavel, atualizarVariavel, removerVariavel,
    adicionarPeca, atualizarPeca, removerPeca,
    adicionarConfiguracaoTecnica, removerConfiguracaoTecnica,
    atualizarConfiguracaoTecnica, toggleItemConfiguracao,
    removerImagem, toggleAcessorio, toggleTipoVidro, selecionarCategoria,
  } = useTipologiaForm(FORM_INICIAL);

  // --- Queries ---
  const { data: tipologias = [], isLoading } = useQuery({
    queryKey: ['tipologias'],
    queryFn: () => entities.Tipologia.list('ordem')
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => entities.Categoria.list('ordem')
  });

  const { data: produtos = [] } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => entities.Produto.filter({ ativo: true }, 'ordem')
  });

  const { data: tiposVidroTecnicos = [] } = useQuery({
    queryKey: ['tiposVidroTecnicos'],
    queryFn: () => entities.TipoVidroTecnico.filter({ ativo: true }, 'ordem')
  });

  const { data: tiposConfiguracaoTecnica = [] } = useQuery({
    queryKey: ['tiposConfiguracaoTecnica'],
    queryFn: () => entities.TipoConfiguracaoTecnica.filter({ ativo: true }, 'ordem')
  });

  const { data: itensConfiguracaoTecnica = [] } = useQuery({
    queryKey: ['itensConfiguracaoTecnica'],
    queryFn: () => entities.ItemConfiguracaoTecnica.filter({ ativo: true }, 'nome')
  });

  const categoriasConfiguracao = tiposConfiguracaoTecnica.map(tipoConfig => ({
    id: tipoConfig.id,
    nome: tipoConfig.nome,
    itens: itensConfiguracaoTecnica.filter(item => item.tipo_configuracao_id === tipoConfig.id),
  }));

  // --- Stats & Filtro ---
  const stats = useMemo(() => ({
    total: tipologias.length,
    ativas: tipologias.filter(t => t.ativo).length,
    inativas: tipologias.filter(t => !t.ativo).length,
  }), [tipologias]);

  const tipologiasFiltradas = useMemo(() => {
    if (!busca.trim()) return tipologias;
    const termo = busca.toLowerCase();
    return tipologias.filter(t =>
      t.nome?.toLowerCase().includes(termo) ||
      t.descricao?.toLowerCase().includes(termo)
    );
  }, [tipologias, busca]);

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: (data) => entities.Tipologia.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['tipologias']); fecharModal(); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => entities.Tipologia.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries(['tipologias']); fecharModal(); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => entities.Tipologia.delete(id),
    onSuccess: () => { queryClient.invalidateQueries(['tipologias']); setTipologiaExcluir(null); }
  });

  // --- Handlers ---
  const abrirNovaTipologia = () => {
    setTipologiaEditando(null);
    setFormData({ ...FORM_INICIAL, ordem: tipologias.length });
    setModalAberto(true);
  };

  const abrirEdicao = (tipologia) => {
    setTipologiaEditando(tipologia);
    setFormData(normalizarTipologia(tipologia, itensConfiguracaoTecnica));
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setTipologiaEditando(null);
    resetForm(FORM_INICIAL);
  };

  const salvar = () => {
    const { valido, erros, avisos } = validarFormulasTipologia(formData);
    if (!valido) {
      toast({ title: "Erro nas fórmulas", description: erros.join("\n"), variant: "destructive" });
      return;
    }
    if (avisos.length > 0) {
      toast({ title: "Aviso nas fórmulas", description: avisos.join("\n"), variant: "default" });
    }
    if (tipologiaEditando) {
      updateMutation.mutate({ id: tipologiaEditando.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await integrations.Core.UploadFile({ file });
    addImagem(file_url);
  };

  const handlePecaImagemUpload = async (e, pecaIndex) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await integrations.Core.UploadFile({ file });
    setPecaImagem(pecaIndex, file_url);
  };

  const formHandlers = {
    adicionarVariavel, atualizarVariavel, removerVariavel,
    adicionarPeca, atualizarPeca, removerPeca,
    adicionarConfiguracaoTecnica, removerConfiguracaoTecnica,
    atualizarConfiguracaoTecnica, toggleItemConfiguracao,
    removerImagem, toggleAcessorio, toggleTipoVidro, selecionarCategoria,
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Tipologias</h1>
            <p className="text-slate-500 mt-1 text-sm">Configure os modelos de produtos com fórmulas de cálculo</p>
          </div>
          <Button
            onClick={abrirNovaTipologia}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 h-10 px-5 font-medium shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" /> Nova Tipologia
          </Button>
        </div>

        {/* Stats + Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
              <Package className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-900">{stats.total}</span>
              <span className="text-xs text-slate-500">total</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">{stats.ativas}</span>
              <span className="text-xs text-emerald-600">ativas</span>
            </div>
            {stats.inativas > 0 && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200">
                <XCircle className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-600">{stats.inativas}</span>
                <span className="text-xs text-slate-500">inativas</span>
              </div>
            )}
          </div>
          <div className="relative flex-1 sm:max-w-xs sm:ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar tipologia..."
              className="pl-9 h-10 rounded-xl bg-white border-slate-200"
            />
          </div>
        </div>
      </motion.div>

      <TipologiaList
        tipologias={tipologiasFiltradas}
        isLoading={isLoading}
        onNew={abrirNovaTipologia}
        onEdit={abrirEdicao}
        onDelete={setTipologiaExcluir}
      />

      <TipologiaModal
        open={modalAberto}
        onOpenChange={setModalAberto}
        editando={tipologiaEditando}
        formData={formData}
        setFormData={setFormData}
        formHandlers={formHandlers}
        categorias={categorias}
        tiposVidroTecnicos={tiposVidroTecnicos}
        produtosDisponiveis={produtos}
        categoriasConfiguracao={categoriasConfiguracao}
        onSave={salvar}
        onFileUpload={handleFileUpload}
        onPecaImagemUpload={handlePecaImagemUpload}
        onRemoverPecaImagem={(idx) => setPecaImagem(idx, "")}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={!!tipologiaExcluir}
        onOpenChange={() => setTipologiaExcluir(null)}
        title="Excluir tipologia?"
        itemName={tipologiaExcluir?.nome}
        onConfirm={() => deleteMutation.mutate(tipologiaExcluir?.id)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
