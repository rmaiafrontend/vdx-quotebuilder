import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { entities } from "@/api/api";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Check, Loader2, Layers, ClipboardList,
  CheckCircle2, Square, ShoppingCart, Trash2, Plus, Package, Ruler, LogOut,
  Sparkles, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoriaCard from "@/components/orcamento/CategoriaCard";
import TipologiaCard from "@/components/orcamento/TipologiaCard";
import InputComUnidade from "@/components/orcamento/InputComUnidade";
import PecaConferencia from "@/components/orcamento/PecaConferencia";
import { calcularPecas, calcularPreco } from "@/components/utils/calculoUtils";
import { ETAPAS_PUBLICO } from "@/constants/orcamento";
import OrcamentoWizardLayout from "@/features/orcamento-wizard/OrcamentoWizardLayout";
import OrcamentoSuccessScreen from "@/features/orcamento-wizard/OrcamentoSuccessScreen";
import { useOrcamentoBase } from "@/hooks/useOrcamentoBase";
import { useCarrinho } from "@/hooks/useCarrinho";
import { useCompanyTheme } from "@/hooks/useCompanyTheme";

export default function OrcamentoPublico() {
  const navigate = useNavigate();
  const { company, primaryColor } = useCompanyTheme();

  const [orcamentoSalvo, setOrcamentoSalvo] = useState(false);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const [acessoriosSelecionados, setAcessoriosSelecionados] = useState([]);

  const {
    etapaAtual, setEtapaAtual,
    categoriaSelecionada, setCategoriaSelecionada,
    tipologiaSelecionada, setTipologiaSelecionada,
    variaveisPreenchidas,
    pecasCalculadas, pecaConferenciaAtual,
    tipoVidroSelecionado, setTipoVidroSelecionado,
    clienteInfo, setClienteInfo,
    unidadeOriginal, totais, variaveisCompletas,
    categorias, tipologiasDaCategoria,
    loadingTipologiaCompleta,
    tiposVidroDisponiveis, produtos, itensConfiguracao,
    selecionarTipologia, atualizarVariavel, executarCalculo, confirmarPeca,
    atualizarConfiguracaoTecnicaPeca, obterConfiguracoesTecnicasPeca,
    resetWizard,
  } = useOrcamentoBase();

  const {
    carrinho, precoTotalCarrinho,
    adicionarAoCarrinho: addToCart,
    removerDoCarrinho,
  } = useCarrinho();

  const acessoriosDisponiveis = produtos.filter(p => p.categoria === 'acessorio');
  const acessoriosDisponiveisTipologia = useMemo(() => {
    const ids = tipologiaSelecionada?.acessorioIds ?? tipologiaSelecionada?.acessorio_ids ?? [];
    if (ids.length === 0) return [];
    return acessoriosDisponiveis.filter(a => ids.includes(a.id));
  }, [tipologiaSelecionada, acessoriosDisponiveis]);

  const toggleAcessorio = (acessorio) => {
    const existe = acessoriosSelecionados.find(a => a.acessorio_id === acessorio.id);
    if (existe) {
      setAcessoriosSelecionados(prev => prev.filter(a => a.acessorio_id !== acessorio.id));
    } else {
      setAcessoriosSelecionados(prev => [...prev, {
        acessorio_id: acessorio.id, acessorio_nome: acessorio.nome,
        quantidade: 1, preco_unitario: acessorio.preco || 0, preco_total: acessorio.preco || 0
      }]);
    }
  };

  const atualizarQuantidadeAcessorio = (acessorioId, quantidade) => {
    setAcessoriosSelecionados(prev => prev.map(a =>
      a.acessorio_id === acessorioId ? { ...a, quantidade, preco_total: a.preco_unitario * quantidade } : a
    ));
  };

  const precoAcessorios = useMemo(() => acessoriosSelecionados.reduce((sum, a) => sum + a.preco_total, 0), [acessoriosSelecionados]);

  const precoFinal = useMemo(() => {
    if (!tipoVidroSelecionado) return 0;
    return calcularPreco(totais.areaTotalCobrancaM2, tipoVidroSelecionado.preco_m2) + precoAcessorios;
  }, [totais.areaTotalCobrancaM2, tipoVidroSelecionado, precoAcessorios]);

  const confirmarPecaPublic = (index) => {
    const hasAcessorios = acessoriosDisponiveisTipologia.length > 0;
    confirmarPeca(index, hasAcessorios ? 4 : 5);
  };

  const salvarMutation = useMutation({
    mutationFn: (data) => entities.Orcamento.create(data),
    onSuccess: () => setOrcamentoSalvo(true)
  });

  const adicionarAoCarrinho = () => {
    if (!tipologiaSelecionada || !tipoVidroSelecionado || pecasCalculadas.length === 0) return;
    addToCart({ tipologiaSelecionada, tipoVidroSelecionado, variaveisPreenchidas, pecasCalculadas, acessoriosSelecionados, totais, precoAcessorios });
    resetWizardLocal();
  };

  const irParaFinalizacao = () => {
    if (!tipologiaSelecionada || !tipoVidroSelecionado || pecasCalculadas.length === 0) return;
    addToCart({ tipologiaSelecionada, tipoVidroSelecionado, variaveisPreenchidas, pecasCalculadas, acessoriosSelecionados, totais, precoAcessorios });
    setMostrarCarrinho(false);
    setEtapaAtual(5);
  };

  const resetWizardLocal = () => {
    resetWizard();
    setAcessoriosSelecionados([]);
    setMostrarCarrinho(false);
  };

  const salvarOrcamento = () => {
    salvarMutation.mutate({
      numero: `ORC-${Date.now().toString().slice(-8)}`,
      cliente_nome: clienteInfo.nome,
      cliente_telefone: clienteInfo.telefone,
      cliente_email: clienteInfo.email,
      itens: carrinho,
      preco_total: precoTotalCarrinho,
      status: 'aguardando_aprovacao'
    });
  };

  const podeAvancar = () => {
    switch (etapaAtual) {
      case 1: return !!categoriaSelecionada;
      case 2: return tipologiaSelecionada && variaveisCompletas && !!tipoVidroSelecionado;
      case 3: return pecasCalculadas.every(p => p.conferido);
      case 4: return true;
      case 5: return carrinho.length > 0 && clienteInfo.nome && clienteInfo.telefone;
      default: return false;
    }
  };

  if (orcamentoSalvo) {
    return (
      <OrcamentoSuccessScreen
        company={company} primaryColor={primaryColor}
        onRestart={() => { resetWizardLocal(); setOrcamentoSalvo(false); }}
        onNavigateHome={() => navigate("/")}
      />
    );
  }

  const backButton = etapaAtual === 1 ? (
    <button type="button" onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: primaryColor }}>
      <ArrowLeft className="w-4 h-4" /><span>Voltar para Home</span>
    </button>
  ) : (
    <button type="button" onClick={() => { if (mostrarCarrinho) setMostrarCarrinho(false); else setEtapaAtual(etapaAtual - 1); }} className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: primaryColor }}>
      <ArrowLeft className="w-4 h-4" /><span>Voltar</span>
    </button>
  );

  const rightSlot = (
    <>
      <button type="button" className="relative p-2 hover:bg-white/10 rounded-lg transition-colors" onClick={() => carrinho.length > 0 && setEtapaAtual(5)} disabled={carrinho.length === 0}>
        <ShoppingCart className="w-5 h-5 text-white" />
        {carrinho.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-400 rounded-full ring-2 ring-white/30 animate-pulse" />}
      </button>
      <button type="button" onClick={() => navigate("/")} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
        <LogOut className="w-5 h-5 text-white" />
      </button>
    </>
  );

  return (
    <OrcamentoWizardLayout etapas={ETAPAS_PUBLICO} etapaAtual={etapaAtual} company={company} primaryColor={primaryColor} rightSlot={rightSlot} backButton={backButton}>
      <AnimatePresence mode="wait">
        {/* Etapa 1: Categorias */}
        {etapaAtual === 1 && (
          <motion.div key="categorias" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: `linear-gradient(135deg, ${primaryColor}18, ${primaryColor}08)` }}>
                  <Layers className="w-5 h-5" style={{ color: primaryColor }} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Selecione a Categoria</h2>
                  <p className="text-slate-500 text-sm mt-0.5">Escolha o tipo de produto para seu orcamento</p>
                </div>
              </div>
            </div>
            {categorias.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-md ring-1 ring-black/[0.04]">
                <Layers className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Nenhuma categoria disponivel</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {categorias.map((cat, i) => (
                  <CategoriaCard key={cat.id} categoria={cat} onClick={() => { setCategoriaSelecionada(cat); setEtapaAtual(2); }} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Etapa 2: Tipologia + Variaveis + Vidro */}
        {etapaAtual === 2 && (
          <motion.div key="tipologia-variaveis" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {!tipologiaSelecionada ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 flex items-center justify-center shadow-sm">
                      <ClipboardList className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{categoriaSelecionada?.nome || 'Tipologias'}</h2>
                      <p className="text-slate-500 text-sm mt-0.5">Escolha o modelo especifico</p>
                    </div>
                  </div>
                </div>
                {tipologiasDaCategoria.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-md ring-1 ring-black/[0.04]">
                    <ClipboardList className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500">Nenhuma tipologia disponivel</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                    {tipologiasDaCategoria.map((tip, i) => (
                      <TipologiaCard key={tip.id} tipologia={tip} onClick={() => { selecionarTipologia(tip); setAcessoriosSelecionados([]); }} index={i} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {loadingTipologiaCompleta && (
                  <div className="flex items-center gap-2 text-slate-600 py-4 mb-4">
                    <Loader2 className="w-5 h-5 animate-spin" /><span>Carregando dados da tipologia...</span>
                  </div>
                )}
                {/* Selected typology card */}
                <div className="mb-5 p-4 bg-white rounded-2xl shadow-md ring-1 ring-black/[0.04] overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}66)` }} />
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-200 shadow-sm">
                      {(tipologiaSelecionada.imagens?.[0] ?? tipologiaSelecionada.imagemUrl) ? (
                        <img src={tipologiaSelecionada.imagens?.[0] ?? tipologiaSelecionada.imagemUrl} alt={tipologiaSelecionada.nome} className="max-w-full max-h-full object-contain rounded" />
                      ) : (
                        <Layers className="w-7 h-7 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-base font-bold text-slate-900 truncate">{tipologiaSelecionada.nome}</h3>
                        <Button variant="ghost" size="sm" onClick={() => { setTipologiaSelecionada(null); setTipoVidroSelecionado(null); }} className="text-slate-500 h-7 px-2 text-xs flex-shrink-0 hover:text-red-500">Alterar</Button>
                      </div>
                      <p className="text-xs text-slate-500 mb-1.5 line-clamp-1">{tipologiaSelecionada.descricao}</p>
                      <div className="flex items-center gap-1.5">
                        <Square className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                        <span className="text-xs font-medium" style={{ color: primaryColor }}>{tipologiaSelecionada.pecas?.length || 0} peca{tipologiaSelecionada.pecas?.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 flex items-center justify-center shadow-sm">
                      <Ruler className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Medidas e Tipo de Vidro</h2>
                      <p className="text-slate-500 text-sm mt-0.5">Preencha as variaveis e selecione o vidro</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-2xl shadow-md ring-1 ring-black/[0.04] overflow-hidden">
                    <div className="px-5 pt-5 pb-3">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">Variaveis de Entrada</h3>
                    </div>
                    <div className="px-5 pb-5 space-y-3 sm:space-y-4">
                      {variaveisPreenchidas.map((variavel, index) => (
                        <InputComUnidade
                          key={variavel.id || index}
                          label={variavel.label || variavel.nome} nome={variavel.nome}
                          valor={variavel.valor} unidade={variavel.unidade}
                          unidadePadrao={variavel.unidade_padrao ?? variavel.unidadePadrao ?? 'cm'}
                          permiteAlterarUnidade={variavel.permite_alterar_unidade !== false}
                          onChange={(data) => atualizarVariavel(index, data)}
                        />
                      ))}
                    </div>
                  </div>

                  {variaveisCompletas && (
                    <div className="bg-white rounded-2xl shadow-md ring-1 ring-black/[0.04] overflow-hidden">
                      <div className="px-5 pt-5 pb-3">
                        <h3 className="text-lg font-bold text-slate-900">Tipo de Vidro</h3>
                        <p className="text-sm text-slate-500 mt-1">Selecione a cor e veja o preco final estimado</p>
                      </div>
                      <div className="px-5 pb-5 space-y-3">
                        {tiposVidroDisponiveis.map((tipo) => {
                          const resultadoTemp = calcularPecas(tipologiaSelecionada, variaveisPreenchidas);
                          const temErro = resultadoTemp.erros?.length > 0;
                          const precoEstimado = temErro ? NaN : calcularPreco(resultadoTemp.areaTotalCobrancaM2, tipo.preco_m2 || 0);
                          const isSelected = tipoVidroSelecionado?.id === tipo.id;
                          return (
                            <div key={tipo.id} onClick={() => setTipoVidroSelecionado(tipo)}
                              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${isSelected ? 'shadow-lg ring-2' : 'bg-slate-50 hover:bg-slate-100/80 ring-1 ring-slate-200/60 hover:ring-slate-300'}`}
                              style={isSelected ? { ringColor: primaryColor, boxShadow: `0 4px 14px ${primaryColor}20`, backgroundColor: `${primaryColor}06`, borderColor: primaryColor } : {}}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="relative">
                                    <div className="w-12 h-12 sm:w-10 sm:h-10 rounded-xl border-2 shadow-sm flex-shrink-0" style={{ backgroundColor: tipo.cor || '#e2e8f0', borderColor: isSelected ? primaryColor : '#fff' }} />
                                    {isSelected && (
                                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-md" style={{ backgroundColor: primaryColor }}>
                                        <Check className="w-3 h-3" strokeWidth={3} />
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">{tipo.nome}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{tipo.codigo}</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-3 sm:flex-col sm:items-end sm:gap-1 flex-shrink-0">
                                  <div className="text-left sm:text-right">
                                    <p className={`text-base sm:text-lg font-bold ${isSelected ? '' : 'text-slate-900'}`} style={isSelected ? { color: primaryColor } : {}}>
                                      {temErro ? "—" : `R$ ${precoEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5">{temErro ? "—" : `${resultadoTemp.areaTotalCobrancaM2.toFixed(2)} m²`}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => executarCalculo(3)}
                    disabled={!podeAvancar()}
                    className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg"
                    style={{
                      background: podeAvancar() ? `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` : undefined,
                      boxShadow: podeAvancar() ? `0 4px 14px ${primaryColor}40` : undefined
                    }}
                  >
                    Calcular Pecas e Continuar <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Etapa 3: Conferencia */}
        {etapaAtual === 3 && !mostrarCarrinho && (
          <motion.div key="conferencia" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Conferencia das Pecas</h2>
                  <p className="text-slate-500 text-sm mt-0.5">Verifique as medidas de cada peca</p>
                </div>
              </div>
            </div>
            <div className="max-w-2xl mx-auto">
              {pecasCalculadas.length > 0 && (
                <PecaConferencia
                  peca={pecasCalculadas[pecaConferenciaAtual]}
                  unidadeOriginal={unidadeOriginal}
                  onConfirmar={() => confirmarPecaPublic(pecaConferenciaAtual)}
                  confirmada={pecasCalculadas[pecaConferenciaAtual]?.conferido}
                  index={pecaConferenciaAtual} total={pecasCalculadas.length}
                  configuracoesTecnicas={obterConfiguracoesTecnicasPeca(pecasCalculadas[pecaConferenciaAtual])}
                  itensConfiguracao={itensConfiguracao}
                  onConfiguracaoChange={(configIndex, valor) => atualizarConfiguracaoTecnicaPeca(pecaConferenciaAtual, configIndex, valor)}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Etapa 4: Acessorios */}
        {etapaAtual === 4 && acessoriosDisponiveisTipologia.length > 0 && (
          <motion.div key="acessorios" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-5xl mx-auto">
            <div className="text-center mb-5 sm:mb-6">
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`, boxShadow: `0 4px 14px ${primaryColor}30` }}
              >
                <Package className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Adicionar Acessorios?</h2>
              <p className="text-slate-500 text-sm sm:text-base px-4">Complemente seu pedido com acessorios (opcional)</p>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Order summary */}
              <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
                <div
                  className="lg:sticky lg:top-4 rounded-2xl text-white shadow-xl overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}
                >
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA3KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />
                  <div className="relative p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4 opacity-90">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5" /><span className="text-xs sm:text-sm font-medium">Seu Pedido</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="font-bold text-lg sm:text-xl mb-1">{tipologiaSelecionada?.nome}</p>
                        <p className="text-white/70 text-xs sm:text-sm">{tipoVidroSelecionado?.nome}</p>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm opacity-90 pt-3 border-t border-white/20">
                        <div className="flex items-center gap-1"><Ruler className="w-3 h-3 sm:w-4 sm:h-4" /><span>{totais.areaTotalCobrancaM2?.toFixed(2)} m²</span></div>
                        <div className="flex items-center gap-1"><Package className="w-3 h-3 sm:w-4 sm:h-4" /><span>{pecasCalculadas.length} pecas</span></div>
                      </div>
                      <div className="pt-4 border-t border-white/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/70 text-xs sm:text-sm">Vidro</span>
                          <span className="font-semibold text-sm sm:text-base">R$ {calcularPreco(totais.areaTotalCobrancaM2, tipoVidroSelecionado?.preco_m2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        {acessoriosSelecionados.length > 0 && (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white/70 text-xs sm:text-sm">Acessorios ({acessoriosSelecionados.length})</span>
                              <span className="font-semibold text-sm sm:text-base">R$ {precoAcessorios.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="h-px bg-white/30 my-3" />
                          </>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-base sm:text-lg">Total</span>
                          <span className="font-bold text-xl sm:text-2xl">R$ {precoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={irParaFinalizacao}
                    className="w-full h-12 sm:h-14 text-sm sm:text-base rounded-xl font-semibold shadow-lg"
                    size="lg"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`, boxShadow: `0 4px 14px ${primaryColor}40` }}
                  >
                    Continuar para Finalizacao <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>
                  <Button onClick={adicionarAoCarrinho} variant="outline" className="w-full h-11 sm:h-12 text-sm sm:text-base border-2 rounded-xl font-medium">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Adicionar Mais Itens
                  </Button>
                </div>
              </div>

              {/* Accessory list */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">Acessorios Disponiveis</h3>
                    {acessoriosSelecionados.length > 0 && (
                      <span className="text-xs sm:text-sm text-white px-3 py-1.5 rounded-full font-medium self-start sm:self-auto shadow-sm" style={{ backgroundColor: primaryColor }}>
                        {acessoriosSelecionados.length} selecionado(s)
                      </span>
                    )}
                  </div>
                  <div className="grid gap-3 sm:gap-4">
                    {acessoriosDisponiveisTipologia.map((acessorio) => {
                      const selecionado = acessoriosSelecionados.find(a => a.acessorio_id === acessorio.id);
                      return (
                        <motion.div key={acessorio.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                          <div
                            className={`rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden ${selecionado ? 'shadow-lg bg-white ring-2' : 'shadow-md bg-white ring-1 ring-black/[0.04] hover:shadow-lg'}`}
                            style={selecionado ? { ringColor: primaryColor, boxShadow: `0 4px 14px ${primaryColor}15` } : {}}
                            onClick={() => !selecionado && toggleAcessorio(acessorio)}
                          >
                            {selecionado && <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}66)` }} />}
                            <div className="p-4 sm:p-5">
                              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start gap-3 mb-2">
                                    <div className="pt-0.5 flex-shrink-0">
                                      <input type="checkbox" checked={!!selecionado} onChange={(e) => { e.stopPropagation(); toggleAcessorio(acessorio); }} className="w-5 h-5 rounded-md border-slate-300 cursor-pointer focus:ring-2" style={{ accentColor: primaryColor }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-slate-900 text-base sm:text-lg mb-1">{acessorio.nome}</p>
                                      {acessorio.descricao && <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{acessorio.descricao}</p>}
                                    </div>
                                  </div>
                                  {selecionado && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="ml-8 sm:ml-8 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200">
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <Label className="text-xs sm:text-sm font-medium text-slate-700">Quantidade:</Label>
                                        <div className="flex items-center gap-2">
                                          <Button type="button" variant="outline" size="icon" className="h-10 w-10 sm:h-9 sm:w-9 touch-manipulation rounded-lg" onClick={(e) => { e.stopPropagation(); if (selecionado.quantidade > 1) atualizarQuantidadeAcessorio(acessorio.id, selecionado.quantidade - 1); }}>-</Button>
                                          <Input type="number" min="1" value={selecionado.quantidade} onChange={(e) => { e.stopPropagation(); atualizarQuantidadeAcessorio(acessorio.id, parseInt(e.target.value) || 1); }} className="w-20 h-10 sm:h-9 text-center font-semibold rounded-lg" onClick={(e) => e.stopPropagation()} />
                                          <Button type="button" variant="outline" size="icon" className="h-10 w-10 sm:h-9 sm:w-9 touch-manipulation rounded-lg" onClick={(e) => { e.stopPropagation(); atualizarQuantidadeAcessorio(acessorio.id, selecionado.quantidade + 1); }}>+</Button>
                                        </div>
                                        <span className="text-xs sm:text-sm text-slate-600 font-medium">= <span className="font-bold" style={{ color: '#10b981' }}>R$ {selecionado.preco_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></span>
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                                <div className="text-left sm:text-right flex-shrink-0 sm:self-start">
                                  <p className="text-xl sm:text-2xl font-bold text-slate-900 mb-0.5 sm:mb-1">R$ {(acessorio.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                  <p className="text-xs text-slate-400 font-medium">por {acessorio.unidade || 'unidade'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Etapa 5: Finalizar */}
        {etapaAtual === 5 && (
          <motion.div key="finalizar" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 flex items-center justify-center shadow-sm">
                  <Send className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Finalizar Orcamento</h2>
                  <p className="text-slate-500 text-sm mt-0.5">Revise os itens e informe seus dados</p>
                </div>
              </div>
            </div>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {/* Cart items */}
                <div className="bg-white rounded-2xl shadow-md ring-1 ring-black/[0.04] overflow-hidden">
                  <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-slate-400" /> Itens ({carrinho.length})
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => { setEtapaAtual(1); setMostrarCarrinho(false); }} className="font-medium" style={{ color: primaryColor }}>
                      <Plus className="w-4 h-4 mr-1" /> Adicionar
                    </Button>
                  </div>
                  <div className="px-5 pb-5 space-y-3">
                    {carrinho.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <ShoppingCart className="w-12 h-12 mx-auto text-slate-200 mb-2" />
                        <p className="font-medium">Nenhum item no carrinho</p>
                      </div>
                    ) : (
                      carrinho.map((item, idx) => (
                        <div key={item.id} className="p-4 bg-slate-50/80 rounded-xl ring-1 ring-slate-200/50">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[11px] font-bold text-white px-2 py-0.5 rounded-md" style={{ backgroundColor: primaryColor }}>#{idx + 1}</span>
                                <h4 className="font-semibold text-slate-900">{item.tipologia_nome}</h4>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-4 h-4 rounded border shadow-sm" style={{ backgroundColor: item.tipo_vidro_cor || '#e2e8f0' }} />
                                <p className="text-sm text-slate-600">{item.tipo_vidro_nome}</p>
                              </div>
                              <p className="text-xs text-slate-400">
                                {item.pecas_calculadas.length} pecas · {item.area_total_cobranca_m2?.toFixed(2)} m²
                                {item.acessorios_selecionados?.length > 0 && <> · {item.acessorios_selecionados.length} acessorios</>}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-slate-900">R$ {item.preco_total_item.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                              <Button variant="ghost" size="sm" onClick={() => removerDoCarrinho(item.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 mt-1"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Total card */}
                <div
                  className="rounded-2xl text-white shadow-xl overflow-hidden relative"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}
                >
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA3KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />
                  <div className="relative p-6">
                    <p className="text-white/70 text-sm mb-1">Total do Orcamento</p>
                    <p className="text-4xl font-bold mb-2 tabular-nums">R$ {precoTotalCarrinho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-white/70">{carrinho.length} {carrinho.length === 1 ? 'item' : 'itens'}</p>
                  </div>
                </div>

                {/* Client info */}
                <div className="bg-white rounded-2xl shadow-md ring-1 ring-black/[0.04] overflow-hidden">
                  <div className="px-5 pt-5 pb-3">
                    <h3 className="text-lg font-bold text-slate-900">Seus Dados</h3>
                  </div>
                  <div className="px-5 pb-5 space-y-4">
                    <div><Label className="text-sm font-medium">Nome *</Label><Input value={clienteInfo.nome} onChange={(e) => setClienteInfo({ ...clienteInfo, nome: e.target.value })} placeholder="Seu nome completo" className="mt-1.5 h-11 rounded-lg" /></div>
                    <div><Label className="text-sm font-medium">Telefone *</Label><Input value={clienteInfo.telefone} onChange={(e) => setClienteInfo({ ...clienteInfo, telefone: e.target.value })} placeholder="(00) 00000-0000" className="mt-1.5 h-11 rounded-lg" /></div>
                    <div><Label className="text-sm font-medium">E-mail (opcional)</Label><Input value={clienteInfo.email} onChange={(e) => setClienteInfo({ ...clienteInfo, email: e.target.value })} placeholder="email@exemplo.com" type="email" className="mt-1.5 h-11 rounded-lg" /></div>
                  </div>
                </div>

                <Button
                  onClick={salvarOrcamento}
                  disabled={!podeAvancar() || salvarMutation.isPending}
                  className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                  style={{ boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}
                >
                  {salvarMutation.isPending ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Enviando...</>) : (<><CheckCircle2 className="w-5 h-5 mr-2" /> Enviar Orcamento</>)}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </OrcamentoWizardLayout>
  );
}
