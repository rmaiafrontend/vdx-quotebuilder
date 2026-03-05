import React from 'react';
import { Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TabVidros({ formData, setFormData, tiposVidroTecnicos, toggleTipoVidro }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Palette className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Tipos de Vidro</h3>
                        <p className="text-xs text-slate-500">
                            Selecione os tipos de vidro disponíveis para esta tipologia
                        </p>
                    </div>
                </div>
                {formData.tipos_vidro_ids?.length > 0 && (
                    <Button
                        variant="outline" size="sm"
                        onClick={() => setFormData({ ...formData, tipos_vidro_ids: [] })}
                        className="h-8 text-xs rounded-lg"
                    >
                        Limpar ({formData.tipos_vidro_ids.length})
                    </Button>
                )}
            </div>

            {/* Info banner */}
            <div className="flex items-center gap-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <div className={`w-2 h-2 rounded-full shrink-0 ${formData.tipos_vidro_ids?.length > 0 ? 'bg-indigo-500' : 'bg-slate-400'}`} />
                <p className="text-xs text-slate-600">
                    {formData.tipos_vidro_ids?.length > 0
                        ? `${formData.tipos_vidro_ids.length} tipo(s) selecionado(s) — apenas estes aparecerão no orçamento`
                        : 'Nenhum selecionado — todos os tipos estarão disponíveis'}
                </p>
            </div>

            {tiposVidroTecnicos.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                    <Palette className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-500">Nenhum tipo de vidro cadastrado</p>
                    <p className="text-xs text-slate-400 mt-1">Cadastre tipos de vidro em Configurações Técnicas</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {tiposVidroTecnicos.map((vidro) => {
                        const selecionado = formData.tipos_vidro_ids?.includes(vidro.id);
                        return (
                            <div
                                key={vidro.id}
                                onClick={() => toggleTipoVidro(vidro.id)}
                                className={`relative flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                                    selecionado
                                        ? 'bg-indigo-50 border-indigo-300 shadow-sm ring-1 ring-indigo-200'
                                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                                }`}
                            >
                                {/* Color swatch */}
                                <div
                                    className="w-10 h-10 rounded-lg border-2 border-white shadow-sm shrink-0"
                                    style={{ backgroundColor: vidro.cor || '#e2e8f0' }}
                                />

                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold truncate ${selecionado ? 'text-indigo-900' : 'text-slate-900'}`}>
                                        {vidro.nome}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                                        {vidro.codigo && <span>{vidro.codigo}</span>}
                                        {vidro.espessura && <><span>·</span><span>{vidro.espessura}</span></>}
                                        {vidro.tipo && <><span>·</span><span>{vidro.tipo}</span></>}
                                    </div>
                                    {vidro.preco_m2 > 0 && (
                                        <p className="text-[11px] font-semibold text-green-600 mt-0.5">
                                            R$ {vidro.preco_m2.toFixed(2)}/m²
                                        </p>
                                    )}
                                </div>

                                {/* Check indicator */}
                                {selecionado && (
                                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
