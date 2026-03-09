import React from 'react';
import { Info, Image, X, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export default function TabBasicas({
    formData, setFormData, categorias, onFileUpload, onRemoveImagem
}) {
    return (
        <div className="space-y-6">
            {/* Section: Info */}
            <div className="rounded-xl bg-white border border-slate-200/80 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-[#1a3a8f]/15 flex items-center justify-center">
                        <Info className="w-4 h-4 text-[#1a3a8f]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Informações Principais</h3>
                        <p className="text-xs text-slate-500">Nome, status e descrição da tipologia</p>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <Label className="text-sm font-medium mb-1.5 block">Nome da Tipologia *</Label>
                        <Input
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            placeholder="Ex: Porta Pivotante Dupla c/ Bandeira"
                            className="h-10 rounded-lg"
                        />
                        <p className="text-xs text-slate-400 mt-1">Nome que aparecerá na lista de tipologias</p>
                    </div>

                    <div className="flex items-center gap-4 p-3.5 rounded-lg border border-slate-200 bg-slate-50/50">
                        <Switch
                            checked={formData.ativo}
                            onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                        />
                        <div>
                            <p className="text-sm font-medium text-slate-900">
                                {formData.ativo ? 'Ativa' : 'Inativa'}
                            </p>
                            <p className="text-xs text-slate-500">
                                {formData.ativo ? 'Tipologia visível para usuários' : 'Tipologia oculta no sistema'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm font-medium mb-1.5 block">Descrição</Label>
                        <Textarea
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            placeholder="Descreva esta tipologia e suas características principais..."
                            className="min-h-[100px] rounded-lg"
                            rows={4}
                        />
                    </div>
                </div>
            </div>

            {/* Section: Categoria */}
            <div className="rounded-xl bg-white border border-slate-200/80 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                        <LayoutGrid className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Categoria</h3>
                        <p className="text-xs text-slate-500">Selecione a categoria em que esta tipologia aparecerá</p>
                    </div>
                </div>

                {categorias.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <p className="text-sm text-slate-400">Nenhuma categoria cadastrada</p>
                    </div>
                ) : (
                    <Select
                        value={formData.categoria_id != null && formData.categoria_id !== '' ? String(formData.categoria_id) : undefined}
                        onValueChange={(val) => setFormData({ ...formData, categoria_id: val || '' })}
                    >
                        <SelectTrigger className="h-10 rounded-lg">
                            <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            {categorias.map(cat => (
                                <SelectItem key={cat.id} value={String(cat.id)}>{cat.nome}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* Section: Imagens */}
            <div className="rounded-xl bg-white border border-slate-200/80 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
                        <Image className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">Imagens / Desenhos</h3>
                        <p className="text-xs text-slate-500">Adicione imagens de referência para esta tipologia</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {formData.imagens.map((url, i) => (
                        <div key={i} className="relative group">
                            <img
                                src={url}
                                alt={`Imagem ${i + 1}`}
                                className="w-full aspect-square rounded-xl object-cover border border-slate-200 bg-slate-50"
                            />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                onClick={() => onRemoveImagem(i)}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#1a3a8f]/40 hover:bg-[#1a3a8f]/10/50 transition-all group">
                        <Image className="w-7 h-7 text-slate-300 mb-1.5 group-hover:text-[#1a3a8f] transition-colors" />
                        <p className="text-[11px] font-medium text-slate-400 group-hover:text-[#1a3a8f] transition-colors">Adicionar</p>
                        <input type="file" className="hidden" accept="image/*" onChange={onFileUpload} />
                    </label>
                </div>
            </div>
        </div>
    );
}
