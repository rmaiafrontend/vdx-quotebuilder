import React from 'react';
import { Package, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TabAcessorios({ formData, setFormData, produtosDisponiveis, toggleAcessorio }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Acessórios</h3>
                        <p className="text-xs text-slate-500">
                            Selecione os acessórios disponíveis para esta tipologia
                        </p>
                    </div>
                </div>
                {formData.acessorio_ids?.length > 0 && (
                    <Button
                        variant="outline" size="sm"
                        onClick={() => setFormData({ ...formData, acessorio_ids: [] })}
                        className="h-8 text-xs rounded-lg"
                    >
                        Limpar ({formData.acessorio_ids.length})
                    </Button>
                )}
            </div>

            {/* Info banner */}
            <div className="flex items-center gap-2 p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                <div className={`w-2 h-2 rounded-full shrink-0 ${formData.acessorio_ids?.length > 0 ? 'bg-purple-500' : 'bg-slate-400'}`} />
                <p className="text-xs text-slate-600">
                    {formData.acessorio_ids?.length > 0
                        ? `${formData.acessorio_ids.length} acessório(s) selecionado(s) — aparecerão na etapa de acessórios`
                        : 'Nenhum selecionado — selecione os acessórios disponíveis para esta tipologia'}
                </p>
            </div>

            {produtosDisponiveis.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                    <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-500">Nenhum produto cadastrado</p>
                    <p className="text-xs text-slate-400 mt-1">Cadastre produtos na seção Produtos</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {produtosDisponiveis.map((acess) => {
                        const selecionado = formData.acessorio_ids?.includes(acess.id);
                        return (
                            <div
                                key={acess.id}
                                onClick={() => toggleAcessorio(acess.id)}
                                className={`relative flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                                    selecionado
                                        ? 'bg-purple-50 border-purple-300 shadow-sm ring-1 ring-purple-200'
                                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                                }`}
                            >
                                {/* Image or icon */}
                                {acess.imagem_url ? (
                                    <img
                                        src={acess.imagem_url}
                                        alt={acess.nome}
                                        className="w-11 h-11 rounded-lg object-cover shrink-0 border border-slate-200"
                                    />
                                ) : (
                                    <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                        <Package className="w-5 h-5 text-slate-400" />
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold truncate ${selecionado ? 'text-purple-900' : 'text-slate-900'}`}>
                                        {acess.nome}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                                        {acess.codigo && <span>{acess.codigo}</span>}
                                        {acess.preco != null && (
                                            <span className="text-green-600 font-semibold">
                                                {acess.codigo ? ' · ' : ''}R$ {acess.preco?.toFixed(2)}
                                            </span>
                                        )}
                                        {acess.unidade && <span>/{acess.unidade}</span>}
                                    </div>
                                </div>

                                {/* Check indicator */}
                                {selecionado && (
                                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
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
