import React, { useRef, useMemo, useCallback, useState } from 'react';
import { Variable, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { avaliarFormula, extrairIdentificadoresFormula } from '@/components/utils/calculoUtils';
import { cn } from '@/lib/utils';

const VALORES_TESTE = [2000, 1000, 500, 250, 125];

const OPERACOES = [
    { label: '+', value: '+', title: 'Soma' },
    { label: '-', value: '-', title: 'Subtração' },
    { label: '*', value: '*', title: 'Multiplicação' },
    { label: '/', value: '/', title: 'Divisão' },
    { label: '(', value: '(', title: 'Abrir parêntese' },
    { label: ')', value: ')', title: 'Fechar parêntese' },
];

export default function FormulaInput({ value, onChange, variaveis = [], placeholder, label }) {
    const inputRef = useRef(null);
    const [aberto, setAberto] = useState(false);

    const variaveisDisponiveis = useMemo(
        () => variaveis.filter(v => v?.nome).map(v => ({ nome: v.nome, label: v.label || v.nome })),
        [variaveis]
    );

    const validacao = useMemo(() => {
        if (!value || !value.trim()) return null;

        const nomes = variaveisDisponiveis.map(v => v.nome);
        const identificadores = extrairIdentificadoresFormula(value);
        const indefinidas = identificadores.filter(id => !nomes.includes(id));

        if (indefinidas.length > 0) {
            return {
                tipo: 'erro',
                mensagem: `Variável não definida: ${indefinidas.join(', ')}`
            };
        }

        const variaveisTeste = {};
        nomes.forEach((nome, i) => { variaveisTeste[nome] = VALORES_TESTE[i] || 1000; });

        const resultado = avaliarFormula(value, variaveisTeste);

        if (!Number.isFinite(resultado.valor)) {
            const isNegativo = resultado.erro && resultado.erro.includes('negativo');
            if (isNegativo) {
                const valoresStr = nomes.map((n, i) => `${n}=${VALORES_TESTE[i] || 1000}`).join(', ');
                return {
                    tipo: 'aviso',
                    mensagem: `Resultado negativo com valores de teste (${valoresStr}). Verifique se a fórmula está correta.`
                };
            }
            return {
                tipo: 'erro',
                mensagem: resultado.erro || 'Fórmula inválida'
            };
        }

        const valoresStr = nomes.map((n, i) => `${n}=${VALORES_TESTE[i] || 1000}`).join(', ');
        return {
            tipo: 'ok',
            mensagem: `Teste (${valoresStr}): ${Math.round(resultado.valor)} mm`
        };
    }, [value, variaveisDisponiveis]);

    const inserirTexto = useCallback((texto) => {
        const input = inputRef.current;
        if (!input) {
            onChange((value || '') + texto);
            return;
        }
        const start = input.selectionStart ?? (value || '').length;
        const end = input.selectionEnd ?? start;
        const antes = (value || '').slice(0, start);
        const depois = (value || '').slice(end);

        const isOperador = /^[+\-*/()]$/.test(texto);
        let espacoAntes = '';
        let espacoDepois = '';

        if (isOperador) {
            if (texto === '(' || texto === ')') {
                espacoAntes = antes.length > 0 && !/[\s(]$/.test(antes) ? ' ' : '';
                espacoDepois = depois.length > 0 && !/^[\s)]/.test(depois) ? ' ' : '';
            } else {
                espacoAntes = antes.length > 0 && !/\s$/.test(antes) ? ' ' : '';
                espacoDepois = depois.length > 0 && !/^\s/.test(depois) ? ' ' : '';
            }
        } else {
            espacoAntes = antes.length > 0 && !/[\s(]$/.test(antes) ? ' ' : '';
            espacoDepois = depois.length > 0 && !/^[\s)]/.test(depois) ? ' ' : '';
        }

        const novoValor = antes + espacoAntes + texto + espacoDepois + depois;
        onChange(novoValor);
        requestAnimationFrame(() => {
            const novaPosicao = (antes + espacoAntes + texto + espacoDepois).length;
            input.focus();
            input.setSelectionRange(novaPosicao, novaPosicao);
        });
    }, [value, onChange]);

    const temErro = validacao?.tipo === 'erro';
    const temAviso = validacao?.tipo === 'aviso';
    const temSucesso = validacao?.tipo === 'ok';

    return (
        <div>
            {label && <Label className="text-xs font-medium text-slate-600 mb-1.5 block">{label}</Label>}

            <Popover open={aberto} onOpenChange={setAberto}>
                <PopoverAnchor asChild>
                    <Input
                        ref={inputRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setAberto(true)}
                        placeholder={placeholder}
                        className={cn(
                            'h-9 font-mono text-sm rounded-lg',
                            temErro && 'border-red-300 focus-visible:ring-red-200',
                            temAviso && 'border-amber-300 focus-visible:ring-amber-200',
                            temSucesso && 'border-green-300 focus-visible:ring-green-200'
                        )}
                    />
                </PopoverAnchor>

                <PopoverContent
                    align="start"
                    sideOffset={6}
                    className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl shadow-lg border-slate-200"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onInteractOutside={(e) => {
                        if (inputRef.current?.contains(e.target)) {
                            e.preventDefault();
                        }
                    }}
                >
                    {variaveisDisponiveis.length > 0 && (
                        <div className="p-3 border-b border-slate-100">
                            <div className="flex items-center gap-1.5 mb-2">
                                <Variable className="w-3.5 h-3.5 text-[#1a3a8f]" />
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Variáveis</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {variaveisDisponiveis.map(v => (
                                    <button
                                        key={v.nome}
                                        type="button"
                                        onClick={() => inserirTexto(v.nome)}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#1a3a8f]/20 bg-[#1a3a8f]/5 pl-2 pr-2.5 py-1.5 text-xs font-medium text-[#1a3a8f] hover:bg-[#1a3a8f]/15 hover:border-[#1a3a8f]/40 transition-colors cursor-pointer"
                                        title={v.label}
                                    >
                                        <span className="font-mono font-bold text-[11px]">{v.nome}</span>
                                        {v.label !== v.nome && (
                                            <span className="text-[10px] text-[#1a3a8f]/60 font-normal">{v.label}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                            <Hash className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Operações</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {OPERACOES.map(op => (
                                <button
                                    key={op.value}
                                    type="button"
                                    onClick={() => inserirTexto(op.value)}
                                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-sm font-bold font-mono text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer"
                                    title={op.title}
                                >
                                    {op.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {variaveisDisponiveis.length === 0 && (
                        <div className="px-3 pb-3">
                            <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-2">
                                Nenhuma variável definida. Adicione variáveis na aba "Variáveis" primeiro.
                            </p>
                        </div>
                    )}
                </PopoverContent>
            </Popover>

            {validacao && (
                <p className={cn(
                    'text-[11px] mt-1',
                    temErro && 'text-red-500',
                    temAviso && 'text-amber-600',
                    temSucesso && 'text-green-600'
                )}>
                    {validacao.mensagem}
                </p>
            )}
            {!validacao && (
                <p className="text-[11px] text-slate-400 mt-1">Clique no campo para abrir o editor de fórmula</p>
            )}
        </div>
    );
}
