import React from 'react';
import { Info, Variable, Calculator, Palette, Package, Save, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import TabBasicas from './tabs/TabBasicas';
import TabVariaveis from './tabs/TabVariaveis';
import TabPecas from './tabs/TabPecas';
import TabVidros from './tabs/TabVidros';
import TabAcessorios from './tabs/TabAcessorios';

const TAB_CONFIG = [
    { value: 'basicas',    label: 'Básicas',     icon: Info,       countKey: null,               color: '#1a3a8f' },
    { value: 'variaveis',  label: 'Variáveis',   icon: Variable,   countKey: 'variaveis',         color: '#1a3a8f' },
    { value: 'pecas',      label: 'Peças',       icon: Calculator, countKey: 'pecas',             color: '#059669' },
    { value: 'vidros',     label: 'Vidros',      icon: Palette,    countKey: 'tipos_vidro_ids',   color: '#0891b2' },
    { value: 'acessorios', label: 'Acessórios',  icon: Package,    countKey: 'acessorio_ids',     color: '#7c3aed' },
];

export default function TipologiaModal({
    open, onOpenChange, editando,
    formData, setFormData, formHandlers,
    categorias, tiposVidroTecnicos, produtosDisponiveis, categoriasConfiguracao,
    onSave, onFileUpload, onPecaImagemUpload, onRemoverPecaImagem,
    isSaving,
}) {
    const getCount = (key) => {
        if (!key) return 0;
        return formData[key]?.length || 0;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent hideClose className="max-w-5xl max-h-[95vh] flex flex-col p-0 gap-0 rounded-2xl overflow-hidden border-0 shadow-2xl shadow-black/20">

                {/* ── Header ── */}
                <DialogHeader className="relative shrink-0 overflow-hidden">
                    {/* Gradient background matching sidebar */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a8f] via-[#17348a] to-[#122a6b]" />
                    <div className="pointer-events-none absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.05] to-transparent" />

                    <div className="relative flex items-center justify-between px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-[10px] bg-white/[0.12] border border-white/[0.1] flex items-center justify-center shrink-0">
                                <Package className="w-4 h-4 text-white" strokeWidth={1.75} />
                            </div>
                            <div>
                                <DialogTitle className="text-[16px] font-semibold text-white tracking-tight leading-none">
                                    {editando ? 'Editar Tipologia' : 'Nova Tipologia'}
                                </DialogTitle>
                                <p className="text-[12px] text-white/45 mt-0.5 leading-none">
                                    {editando ? `Editando "${formData.nome || ''}"` : 'Configure todas as informações da tipologia'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.1] transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </DialogHeader>

                {/* ── Tabs ── */}
                <Tabs defaultValue="basicas" className="flex-1 flex flex-col min-h-0">

                    {/* Tab bar */}
                    <div className="shrink-0 bg-white border-b border-[#0f0f12]/[0.06] px-4">
                        <TabsList className="flex h-auto p-0 bg-transparent gap-0 rounded-none w-full">
                            {TAB_CONFIG.map((tab) => {
                                const count = getCount(tab.countKey);
                                return (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="
                                            group relative flex items-center gap-1.5 h-11 px-4
                                            text-[12px] font-medium rounded-none border-b-2 border-transparent
                                            text-[#0f0f12]/40 bg-transparent shadow-none
                                            data-[state=active]:border-[#1a3a8f] data-[state=active]:text-[#1a3a8f]
                                            data-[state=active]:bg-transparent data-[state=active]:shadow-none
                                            hover:text-[#0f0f12]/70 hover:bg-[#0f0f12]/[0.02]
                                            transition-all duration-150
                                        "
                                    >
                                        <tab.icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        {count > 0 && (
                                            <span
                                                className="min-w-[18px] h-[18px] px-1 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                                                style={{ backgroundColor: tab.color }}
                                            >
                                                {count}
                                            </span>
                                        )}
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                    </div>

                    {/* Tab content */}
                    <div className="flex-1 overflow-y-auto bg-[#f5f5f7]">
                        <div className="p-6">
                            <TabsContent value="basicas" className="mt-0">
                                <TabBasicas
                                    formData={formData} setFormData={setFormData}
                                    categorias={categorias}
                                    onFileUpload={onFileUpload}
                                    onRemoveImagem={formHandlers.removerImagem}
                                />
                            </TabsContent>
                            <TabsContent value="variaveis" className="mt-0">
                                <TabVariaveis
                                    variaveis={formData.variaveis}
                                    onAdicionar={formHandlers.adicionarVariavel}
                                    onAtualizar={formHandlers.atualizarVariavel}
                                    onRemover={formHandlers.removerVariavel}
                                />
                            </TabsContent>
                            <TabsContent value="pecas" className="mt-0">
                                <TabPecas
                                    pecas={formData.pecas}
                                    variaveis={formData.variaveis}
                                    categoriasConfiguracao={categoriasConfiguracao}
                                    onAdicionarPeca={formHandlers.adicionarPeca}
                                    onAtualizarPeca={formHandlers.atualizarPeca}
                                    onRemoverPeca={formHandlers.removerPeca}
                                    onPecaImagemUpload={onPecaImagemUpload}
                                    onRemoverPecaImagem={onRemoverPecaImagem}
                                    onAdicionarConfiguracao={formHandlers.adicionarConfiguracaoTecnica}
                                    onRemoverConfiguracao={formHandlers.removerConfiguracaoTecnica}
                                    onAtualizarConfiguracao={formHandlers.atualizarConfiguracaoTecnica}
                                    onToggleItemConfiguracao={formHandlers.toggleItemConfiguracao}
                                />
                            </TabsContent>
                            <TabsContent value="vidros" className="mt-0">
                                <TabVidros
                                    formData={formData} setFormData={setFormData}
                                    tiposVidroTecnicos={tiposVidroTecnicos}
                                    toggleTipoVidro={formHandlers.toggleTipoVidro}
                                />
                            </TabsContent>
                            <TabsContent value="acessorios" className="mt-0">
                                <TabAcessorios
                                    formData={formData} setFormData={setFormData}
                                    produtosDisponiveis={produtosDisponiveis}
                                    toggleAcessorio={formHandlers.toggleAcessorio}
                                />
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>

                {/* ── Footer ── */}
                <div className="shrink-0 flex items-center justify-between gap-3 px-6 py-4 bg-white border-t border-[#0f0f12]/[0.06]">
                    <div className="flex items-center gap-2 text-[12px] text-[#0f0f12]/30">
                        {!formData.nome && (
                            <span>Preencha o nome para salvar</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onOpenChange(false)}
                            className="h-9 px-4 rounded-xl text-[13px] font-medium text-[#0f0f12]/50 border border-[#0f0f12]/[0.1] hover:bg-[#0f0f12]/[0.03] hover:text-[#0f0f12]/70 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onSave}
                            disabled={!formData.nome || isSaving}
                            className="h-9 px-5 rounded-xl text-[13px] font-semibold flex items-center gap-2 bg-[#1a3a8f] hover:bg-[#152e73] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Save className="w-3.5 h-3.5" />
                            {isSaving ? 'Salvando…' : 'Salvar Tipologia'}
                        </button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
