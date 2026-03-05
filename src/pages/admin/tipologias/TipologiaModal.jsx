import React from 'react';
import { Info, Variable, Calculator, Palette, Package, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import TabBasicas from './tabs/TabBasicas';
import TabVariaveis from './tabs/TabVariaveis';
import TabPecas from './tabs/TabPecas';
import TabVidros from './tabs/TabVidros';
import TabAcessorios from './tabs/TabAcessorios';

const TAB_CONFIG = [
    { value: 'basicas', label: 'Básicas', icon: Info, countKey: null, badgeColor: 'bg-slate-600' },
    { value: 'variaveis', label: 'Variáveis', icon: Variable, countKey: 'variaveis', badgeColor: 'bg-blue-600' },
    { value: 'pecas', label: 'Peças', icon: Calculator, countKey: 'pecas', badgeColor: 'bg-green-600' },
    { value: 'vidros', label: 'Vidros', icon: Palette, countKey: 'tipos_vidro_ids', badgeColor: 'bg-indigo-600' },
    { value: 'acessorios', label: 'Acessórios', icon: Package, countKey: 'acessorio_ids', badgeColor: 'bg-purple-600' },
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
            <DialogContent className="max-w-5xl max-h-[95vh] flex flex-col p-0 rounded-2xl overflow-hidden">
                {/* Header with gradient */}
                <DialogHeader className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA3KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />
                    <div className="relative">
                        <DialogTitle className="text-xl font-bold tracking-tight text-white">
                            {editando ? 'Editar Tipologia' : 'Nova Tipologia'}
                        </DialogTitle>
                        <p className="text-sm text-blue-100 mt-1">
                            Configure todas as informações da tipologia
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 h-8 w-8 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </DialogHeader>

                <Tabs defaultValue="basicas" className="flex-1 flex flex-col min-h-0">
                    {/* Tab navigation */}
                    <div className="px-6 py-3 border-b bg-white">
                        <TabsList className="inline-flex h-auto p-1 bg-slate-100/80 rounded-xl gap-0.5">
                            {TAB_CONFIG.map((tab) => {
                                const count = getCount(tab.countKey);
                                return (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="relative flex items-center gap-1.5 py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 data-[state=active]:font-semibold rounded-lg transition-all text-xs font-medium text-slate-600"
                                    >
                                        <tab.icon className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        {count > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className={`ml-0.5 h-4 min-w-4 px-1 text-[10px] font-bold ${tab.badgeColor} text-white rounded-full`}
                                            >
                                                {count}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                    </div>

                    {/* Tab content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50/30">
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
                </Tabs>

                {/* Footer */}
                <DialogFooter className="px-6 py-4 border-t bg-white shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.05)]">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="h-10 px-5 rounded-xl font-medium">
                        Cancelar
                    </Button>
                    <Button
                        onClick={onSave}
                        disabled={!formData.nome || isSaving}
                        className="bg-blue-600 hover:bg-blue-700 h-10 px-6 rounded-xl font-semibold shadow-md shadow-blue-500/20"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Salvando...' : 'Salvar Tipologia'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
