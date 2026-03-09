import React from 'react';
import { Variable, Trash2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export default function TabVariaveis({
    variaveis, onAdicionar, onAtualizar, onRemover
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#1a3a8f]/15 flex items-center justify-center">
                        <Variable className="w-4 h-4 text-[#1a3a8f]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Variáveis de Entrada</h3>
                        <p className="text-xs text-slate-500">
                            Defina as variáveis que o usuário precisará preencher
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onAdicionar}
                    className="h-8 px-3 rounded-lg text-xs font-medium hover:bg-[#1a3a8f]/10 hover:border-[#1a3a8f]/50 hover:text-[#1a3a8f]"
                >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Adicionar
                </Button>
            </div>

            {variaveis.length === 0 && (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200">
                    <Variable className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-500">Nenhuma variável adicionada</p>
                    <p className="text-xs text-slate-400 mt-1">Adicione variáveis para usar nas fórmulas das peças</p>
                </div>
            )}

            {variaveis.map((variavel, index) => (
                <div
                    key={variavel.id}
                    className="relative rounded-xl bg-white border border-slate-200/80 shadow-sm overflow-hidden"
                >
                    {/* Left accent border */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1a3a8f] to-[#2962cc] rounded-l-xl" />

                    <div className="pl-5 pr-4 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">
                                <span className="w-7 h-7 rounded-lg bg-[#1a3a8f] text-white text-xs font-bold flex items-center justify-center">
                                    {index + 1}
                                </span>
                                <div>
                                    <span className="text-sm font-semibold text-slate-800">
                                        {variavel.label || variavel.nome || `Variável ${index + 1}`}
                                    </span>
                                    {variavel.nome && (
                                        <span className="ml-2 text-xs text-slate-400 font-mono">{variavel.nome}</span>
                                    )}
                                </div>
                            </div>
                            <Button
                                type="button" variant="ghost" size="icon"
                                className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemover(index); }}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">Nome técnico *</Label>
                                <Input
                                    value={variavel.nome}
                                    onChange={(e) => onAtualizar(index, 'nome', e.target.value)}
                                    placeholder="Ex: Lv, Av, Ap"
                                    className="h-9 text-sm font-mono rounded-lg"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">Usado nas fórmulas (ex: Lv - 15)</p>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">Label para exibição *</Label>
                                <Input
                                    value={variavel.label}
                                    onChange={(e) => onAtualizar(index, 'label', e.target.value)}
                                    placeholder="Ex: Largura do Vão"
                                    className="h-9 text-sm rounded-lg"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">Texto mostrado ao usuário</p>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-slate-600 mb-1.5 block">Unidade padrão</Label>
                                <Select value={variavel.unidade_padrao} onValueChange={(v) => onAtualizar(index, 'unidade_padrao', v)}>
                                    <SelectTrigger className="h-9 text-sm rounded-lg"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mm">Milímetros (mm)</SelectItem>
                                        <SelectItem value="cm">Centímetros (cm)</SelectItem>
                                        <SelectItem value="m">Metros (m)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-3 sm:pt-6">
                                <Switch
                                    checked={variavel.permite_alterar_unidade}
                                    onCheckedChange={(v) => onAtualizar(index, 'permite_alterar_unidade', v)}
                                />
                                <div>
                                    <Label className="text-xs font-medium text-slate-700">Permitir alterar unidade</Label>
                                    <p className="text-[11px] text-slate-400">Usuário poderá escolher outra unidade</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {variaveis.length > 0 && (
                <Button
                    variant="outline" onClick={onAdicionar}
                    className="w-full h-12 border-2 border-dashed border-slate-200 hover:bg-[#1a3a8f]/10 hover:border-[#1a3a8f]/50 transition-all rounded-xl"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="font-medium text-sm">Adicionar Variável</span>
                </Button>
            )}
        </div>
    );
}
