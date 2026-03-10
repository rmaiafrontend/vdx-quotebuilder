import React, { useState } from 'react';
import { Calculator, Plus, Trash2, Image, X, Settings, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import FormulaInput from '@/components/FormulaInput';

export default function TabPecas({
    pecas,
    variaveis = [],
    categoriasConfiguracao,
    onAdicionarPeca,
    onAtualizarPeca,
    onRemoverPeca,
    onPecaImagemUpload,
    onRemoverPecaImagem,
    onAdicionarConfiguracao,
    onRemoverConfiguracao,
    onAtualizarConfiguracao,
    onToggleItemConfiguracao,
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                        <Calculator className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Peças e Configurações</h3>
                        <p className="text-xs text-slate-500">
                            Defina as peças e suas fórmulas de cálculo
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onAdicionarPeca}
                    className="h-8 px-3 rounded-lg text-xs font-medium hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Adicionar
                </Button>
            </div>

            {pecas.length === 0 && (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200">
                    <Calculator className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-500">Nenhuma peça adicionada</p>
                    <p className="text-xs text-slate-400 mt-1">Adicione peças com fórmulas de largura e altura</p>
                </div>
            )}

            {pecas.map((peca, index) => (
                <PecaItem
                    key={peca.id}
                    peca={peca}
                    index={index}
                    variaveis={variaveis}
                    categoriasConfiguracao={categoriasConfiguracao}
                    onAtualizar={onAtualizarPeca}
                    onRemover={onRemoverPeca}
                    onImagemUpload={onPecaImagemUpload}
                    onRemoverImagem={onRemoverPecaImagem}
                    onAdicionarConfiguracao={onAdicionarConfiguracao}
                    onRemoverConfiguracao={onRemoverConfiguracao}
                    onAtualizarConfiguracao={onAtualizarConfiguracao}
                    onToggleItemConfiguracao={onToggleItemConfiguracao}
                />
            ))}

            {pecas.length > 0 && (
                <Button
                    variant="outline" onClick={onAdicionarPeca}
                    className="w-full h-12 border-2 border-dashed border-slate-200 hover:bg-green-50 hover:border-green-300 transition-all rounded-xl"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="font-medium text-sm">Adicionar Peça</span>
                </Button>
            )}
        </div>
    );
}

function PecaItem({
    peca, index, variaveis, categoriasConfiguracao,
    onAtualizar, onRemover, onImagemUpload, onRemoverImagem,
    onAdicionarConfiguracao, onRemoverConfiguracao, onAtualizarConfiguracao, onToggleItemConfiguracao,
}) {
    const [expandido, setExpandido] = useState(true);

    return (
        <div className="relative rounded-xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Left accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-emerald-500 rounded-l-xl" />

            {/* Header - always visible */}
            <div className="pl-5 pr-4 py-3.5 flex items-center justify-between cursor-pointer" onClick={() => setExpandido(!expandido)}>
                <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-green-600 text-white text-xs font-bold flex items-center justify-center">
                        {index + 1}
                    </span>
                    <div>
                        <span className="text-sm font-semibold text-slate-800">
                            {peca.nome || `Peça ${index + 1}`}
                        </span>
                        {peca.formula_largura && peca.formula_altura && (
                            <p className="text-[11px] text-slate-400 font-mono">
                                L: {peca.formula_largura} · A: {peca.formula_altura}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => { e.stopPropagation(); onRemover(index); }}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                    {expandido ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
            </div>

            {/* Content - collapsible */}
            {expandido && (
                <div className="pl-5 pr-4 pb-5 space-y-5 border-t border-slate-100">
                    <div className="pt-4">
                        <Label className="text-xs font-medium text-slate-600 mb-1.5 block">Nome da peça *</Label>
                        <Input
                            value={peca.nome}
                            onChange={(e) => onAtualizar(index, 'nome', e.target.value)}
                            placeholder="Ex: Bandeira, Folha Principal"
                            className="h-9 text-sm rounded-lg"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <FormulaInput
                            label="Fórmula da Largura (mm) *"
                            value={peca.formula_largura}
                            onChange={(val) => onAtualizar(index, 'formula_largura', val)}
                            variaveis={variaveis}
                            placeholder="Ex: Lv - 15"
                        />
                        <FormulaInput
                            label="Fórmula da Altura (mm) *"
                            value={peca.formula_altura}
                            onChange={(val) => onAtualizar(index, 'formula_altura', val)}
                            variaveis={variaveis}
                            placeholder="Ex: Av - Ap - 13"
                        />
                    </div>

                    {/* Imagem Ilustrativa */}
                    <div className="pt-4 border-t border-slate-100">
                        <Label className="text-xs font-semibold text-slate-700 mb-1 block">Imagem Ilustrativa</Label>
                        <p className="text-[11px] text-slate-400 mb-3">Imagem exibida durante a conferência da peça</p>
                        {peca.imagem_url ? (
                            <div className="relative inline-block">
                                <img
                                    src={peca.imagem_url}
                                    alt={`Imagem ${peca.nome || 'da peça'}`}
                                    className="w-full max-w-sm h-40 object-contain rounded-xl border border-slate-200 bg-slate-50"
                                />
                                <Button
                                    variant="destructive" size="icon"
                                    className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full shadow-md"
                                    onClick={() => onRemoverImagem(index)}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full max-w-sm h-36 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#1a3a8f]/40 hover:bg-[#1a3a8f]/10/50 transition-all group">
                                <Image className="w-8 h-8 text-slate-300 mb-2 group-hover:text-[#1a3a8f] transition-colors" />
                                <p className="text-xs font-medium text-slate-500 group-hover:text-[#1a3a8f]">Clique para fazer upload</p>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => onImagemUpload(e, index)} />
                            </label>
                        )}
                    </div>

                    {/* Configurações Técnicas */}
                    <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <Label className="text-xs font-semibold text-slate-700 block">Configurações Técnicas</Label>
                                <p className="text-[11px] text-slate-400">Configurações disponíveis para esta peça</p>
                            </div>
                            <Button
                                variant="outline" size="sm"
                                onClick={() => onAdicionarConfiguracao(index)}
                                className="h-7 px-2.5 text-[11px] rounded-lg"
                            >
                                <Plus className="w-3 h-3 mr-1" /> Adicionar
                            </Button>
                        </div>

                        {peca.configuracoes_tecnicas?.length > 0 ? (
                            <div className="space-y-2.5">
                                {peca.configuracoes_tecnicas.map((config, configIndex) => (
                                    <ConfiguracaoTecnicaItem
                                        key={config.id || configIndex}
                                        config={config}
                                        pecaIndex={index}
                                        configIndex={configIndex}
                                        categoriasConfiguracao={categoriasConfiguracao}
                                        onRemover={onRemoverConfiguracao}
                                        onAtualizar={onAtualizarConfiguracao}
                                        onToggleItem={onToggleItemConfiguracao}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                                <Settings className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs font-medium text-slate-500">Nenhuma configuração técnica</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function ConfiguracaoTecnicaItem({ config, pecaIndex, configIndex, categoriasConfiguracao, onRemover, onAtualizar, onToggleItem }) {
    const categoriaInfo = categoriasConfiguracao.find(cat => cat.id === config.categoria);
    const itensDisponiveis = categoriaInfo?.itens || [];

    return (
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
                <Select
                    value={config.categoria}
                    onValueChange={(value) => {
                        onAtualizar(pecaIndex, configIndex, 'categoria', value);
                        onAtualizar(pecaIndex, configIndex, 'itens_ids', []);
                    }}
                >
                    <SelectTrigger className="h-9 text-sm flex-1 rounded-lg"><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                    <SelectContent>
                        {categoriasConfiguracao.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.nome}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50 shrink-0" onClick={() => onRemover(pecaIndex, configIndex)}>
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            </div>

            {config.categoria && (
                <>
                    <div className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-slate-200/80">
                        <Switch
                            checked={config.obrigatorio}
                            onCheckedChange={(checked) => onAtualizar(pecaIndex, configIndex, 'obrigatorio', checked)}
                        />
                        <div>
                            <Label className="text-xs font-medium">Obrigatório</Label>
                            <p className="text-[11px] text-slate-400">Seleção obrigatória na conferência</p>
                        </div>
                    </div>

                    <div>
                        <Label className="text-xs font-medium text-slate-600 mb-1.5 block">
                            Itens disponíveis ({config.itens_ids?.length || 0} selecionado{config.itens_ids?.length !== 1 ? 's' : ''})
                        </Label>
                        {itensDisponiveis.length === 0 ? (
                            <div className="p-3 bg-white rounded-lg border border-dashed text-center">
                                <p className="text-xs text-slate-400">Nenhum item nesta categoria</p>
                            </div>
                        ) : (
                            <div className="max-h-40 overflow-y-auto border border-slate-200/80 rounded-lg bg-white p-2 space-y-0.5">
                                {itensDisponiveis.map(item => (
                                    <label key={item.id} className="flex items-center gap-2.5 px-2.5 py-2 hover:bg-slate-50 rounded-md cursor-pointer transition-colors">
                                        <Checkbox
                                            checked={config.itens_ids?.includes(item.id)}
                                            onCheckedChange={() => onToggleItem(pecaIndex, configIndex, item.id)}
                                        />
                                        <span className="text-xs flex-1 font-medium text-slate-700">{item.nome}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        {config.itens_ids?.length === 0 && itensDisponiveis.length > 0 && (
                            <div className="mt-2 p-2 bg-[#1a3a8f]/10 border border-[#1a3a8f]/15 rounded-lg">
                                <p className="text-[11px] text-[#1a3a8f] flex items-center gap-1.5">
                                    <Info className="w-3 h-3 shrink-0" />
                                    Nenhum item selecionado = todos disponíveis na conferência
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
