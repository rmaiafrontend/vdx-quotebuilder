import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Check, Loader2, Layers, ClipboardList,
  CheckCircle2, Square, ShoppingCart, Plus, Package, Ruler,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CategoriaCard from "@/components/orcamento/CategoriaCard";
import TipologiaCard from "@/components/orcamento/TipologiaCard";
import InputComUnidade from "@/components/orcamento/InputComUnidade";
import PecaConferencia from "@/components/orcamento/PecaConferencia";
import { calcularPecas, calcularPreco } from "@/components/utils/calculoUtils";
import { ETAPAS_PUBLICO } from "@/constants/orcamento";
import OrcamentoWizardLayout from "@/features/orcamento-wizard/OrcamentoWizardLayout";
import { useOrcamentoBase } from "@/hooks/useOrcamentoBase";
import { useCarrinho } from "@/hooks/useCarrinho";
import { useCompanyTheme } from "@/hooks/useCompanyTheme";

export default function OrcamentoPublico() {
  const navigate = useNavigate();
  const { company, primaryColor } = useCompanyTheme();

  const [acessoriosSelecionados, setAcessoriosSelecionados] = useState([]);

  const {
    etapaAtual, setEtapaAtual,
    categoriaSelecionada, setCategoriaSelecionada,
    tipologiaSelecionada, setTipologiaSelecionada,
    variaveisPreenchidas,
    pecasCalculadas, pecaConferenciaAtual,
    tipoVidroSelecionado, setTipoVidroSelecionado,
    unidadeOriginal, totais, variaveisCompletas,
    categorias, tipologiasDaCategoria,
    loadingTipologiaCompleta,
    tiposVidroDisponiveis, produtos, itensConfiguracao,
    selecionarTipologia, atualizarVariavel, executarCalculo, confirmarPeca,
    atualizarConfiguracaoTecnicaPeca, obterConfiguracoesTecnicasPeca,
    resetWizard,
  } = useOrcamentoBase();

  const {
    carrinho,
    adicionarAoCarrinho: addToCart,
    setDrawerOpen,
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
    if (!hasAcessorios && index === pecasCalculadas.length - 1) {
      // Última peça sem acessórios: adiciona ao carrinho e abre drawer
      const novasPecas = [...pecasCalculadas];
      novasPecas[index] = { ...novasPecas[index], conferido: true };
      addToCart({ tipologiaSelecionada, tipoVidroSelecionado, variaveisPreenchidas, pecasCalculadas: novasPecas, acessoriosSelecionados, totais, precoAcessorios });
      confirmarPeca(index, 1); // volta para etapa 1
      resetWizardLocal();
      setDrawerOpen(true);
      return;
    }
    confirmarPeca(index, hasAcessorios ? 4 : 1);
  };

  const adicionarAoCarrinhoEAbrir = () => {
    if (!tipologiaSelecionada || !tipoVidroSelecionado || pecasCalculadas.length === 0) return;
    addToCart({ tipologiaSelecionada, tipoVidroSelecionado, variaveisPreenchidas, pecasCalculadas, acessoriosSelecionados, totais, precoAcessorios });
    resetWizardLocal();
    setDrawerOpen(true);
  };

  const adicionarAoCarrinho = () => {
    if (!tipologiaSelecionada || !tipoVidroSelecionado || pecasCalculadas.length === 0) return;
    addToCart({ tipologiaSelecionada, tipoVidroSelecionado, variaveisPreenchidas, pecasCalculadas, acessoriosSelecionados, totais, precoAcessorios });
    resetWizardLocal();
  };

  const resetWizardLocal = () => {
    resetWizard();
    setAcessoriosSelecionados([]);
  };

  const podeAvancar = () => {
    switch (etapaAtual) {
      case 1: return !!categoriaSelecionada;
      case 2: return tipologiaSelecionada && variaveisCompletas && !!tipoVidroSelecionado;
      case 3: return pecasCalculadas.every(p => p.conferido);
      case 4: return true;
      default: return false;
    }
  };

  const backButton = etapaAtual === 1 ? (
    <button type="button" onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: primaryColor }}>
      <ArrowLeft className="w-4 h-4" /><span>Voltar para Home</span>
    </button>
  ) : (
    <button type="button" onClick={() => {
      if (etapaAtual === 2) { setTipologiaSelecionada(null); setTipoVidroSelecionado(null); }
      setEtapaAtual(etapaAtual - 1);
    }} className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: primaryColor }}>
      <ArrowLeft className="w-4 h-4" /><span>Voltar</span>
    </button>
  );

  return (
    <OrcamentoWizardLayout etapas={ETAPAS_PUBLICO} etapaAtual={etapaAtual} company={company} primaryColor={primaryColor} backButton={backButton}>
      <AnimatePresence mode="wait">
        {/* Etapa 1: Categorias */}
        {etapaAtual === 1 && (
          <motion.div key="categorias" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="text-center mb-8">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`, boxShadow: `0 4px 14px ${primaryColor}30` }}
              >
                <Layers className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">O que você precisa?</h2>
              <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-md mx-auto">Selecione a categoria do produto para iniciar seu orçamento</p>
            </div>
            {categorias.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-md ring-1 ring-black/[0.04]">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">Nenhuma categoria disponível</h3>
                <p className="text-sm text-slate-500">As categorias aparecerão aqui quando cadastradas.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {categorias.map((cat, i) => (
                  <CategoriaCard key={cat.id} categoria={cat} onClick={() => { setCategoriaSelecionada(cat); setTipologiaSelecionada(null); setTipoVidroSelecionado(null); setEtapaAtual(2); }} index={i} primaryColor={primaryColor} />
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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2962cc]/10 to-[#2962cc]/15/50 flex items-center justify-center shadow-sm">
                      <ClipboardList className="w-5 h-5 text-[#1a3a8f]" />
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
                  <div className="flex items-center justify-center gap-3 py-12">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}10` }}>
                      <Loader2 className="w-5 h-5 animate-spin" style={{ color: primaryColor }} />
                    </div>
                    <span className="text-slate-600 font-medium">Carregando dados...</span>
                  </div>
                )}

                {/* Selected typology chip */}
                <div className="flex items-center gap-3 mb-6 p-3 bg-white rounded-xl shadow-sm ring-1 ring-black/[0.06]">
                  <div className="w-11 h-11 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 ring-1 ring-slate-200/60">
                    {(tipologiaSelecionada.imagens?.[0] ?? tipologiaSelecionada.imagemUrl) ? (
                      <img src={tipologiaSelecionada.imagens?.[0] ?? tipologiaSelecionada.imagemUrl} alt={tipologiaSelecionada.nome} className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <Layers className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{tipologiaSelecionada.nome}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}>
                        {tipologiaSelecionada.pecas?.length || 0} peça{tipologiaSelecionada.pecas?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => { setTipologiaSelecionada(null); setTipoVidroSelecionado(null); }} className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 flex-shrink-0">
                    Alterar
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Variables section */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}10` }}>
                        <Ruler className="w-4 h-4" style={{ color: primaryColor }} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Informe as medidas</h3>
                        <p className="text-xs text-slate-500">Preencha os campos abaixo</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/[0.06] p-4 sm:p-5 space-y-4">
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

                  {/* Glass type section */}
                  {variaveisCompletas && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">Escolha o vidro</h3>
                          <p className="text-xs text-slate-500">Selecione e veja o preço estimado</p>
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        {tiposVidroDisponiveis.map((tipo) => {
                          const resultadoTemp = calcularPecas(tipologiaSelecionada, variaveisPreenchidas);
                          const temErro = resultadoTemp.erros?.length > 0;
                          const precoEstimado = temErro ? NaN : calcularPreco(resultadoTemp.areaTotalCobrancaM2, tipo.preco_m2 || 0);
                          const isSelected = tipoVidroSelecionado?.id === tipo.id;
                          return (
                            <div
                              key={tipo.id}
                              onClick={() => setTipoVidroSelecionado(tipo)}
                              className={`relative p-4 rounded-xl cursor-pointer transition-all duration-200 overflow-hidden ${
                                isSelected
                                  ? 'bg-white shadow-lg ring-2'
                                  : 'bg-white ring-1 ring-slate-200/70 hover:ring-slate-300 hover:shadow-md'
                              }`}
                              style={isSelected ? { boxShadow: `0 4px 14px ${primaryColor}15`, '--tw-ring-color': primaryColor } : {}}
                            >
                              {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: primaryColor }} />}
                              <div className="flex items-center gap-3">
                                {/* Color swatch */}
                                <div className="relative flex-shrink-0">
                                  <div
                                    className={`w-11 h-11 rounded-xl shadow-sm ring-1 transition-all ${isSelected ? 'ring-2 scale-105' : 'ring-slate-200/60'}`}
                                    style={{ backgroundColor: tipo.cor || '#e2e8f0', ...(isSelected ? { '--tw-ring-color': primaryColor } : {}) }}
                                  />
                                  {isSelected && (
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-md" style={{ backgroundColor: primaryColor }}>
                                      <Check className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                  )}
                                </div>

                                {/* Name + code */}
                                <div className="flex-1 min-w-0">
                                  <p className={`font-semibold text-sm truncate ${isSelected ? '' : 'text-slate-900'}`} style={isSelected ? { color: primaryColor } : {}}>
                                    {tipo.nome}
                                  </p>
                                  <p className="text-[11px] text-slate-400 mt-0.5">{tipo.codigo}</p>
                                </div>

                                {/* Price */}
                                <div className="text-right flex-shrink-0">
                                  <p className={`text-base font-bold tabular-nums ${isSelected ? '' : 'text-slate-800'}`} style={isSelected ? { color: primaryColor } : {}}>
                                    {temErro ? "—" : `R$ ${precoEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                  </p>
                                  <p className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                                    {temErro ? "—" : `${resultadoTemp.areaTotalCobrancaM2.toFixed(2)} m²`}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  <Button
                    onClick={() => executarCalculo(3)}
                    disabled={!podeAvancar()}
                    className="w-full h-13 text-base font-bold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.98]"
                    style={{
                      background: podeAvancar() ? `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` : undefined,
                      boxShadow: podeAvancar() ? `0 6px 20px ${primaryColor}35` : undefined
                    }}
                  >
                    Calcular e Continuar <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Etapa 3: Conferencia */}
        {etapaAtual === 3 && (
          <motion.div key="conferencia" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 mb-3 shadow-lg shadow-emerald-500/25">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Conferência das Peças</h2>
              <p className="text-slate-400 text-sm mt-1">Verifique as medidas e confirme cada peça</p>
              {/* Pagination dots */}
              {pecasCalculadas.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  {pecasCalculadas.map((p, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === pecaConferenciaAtual
                          ? 'w-6 bg-[#1a3a8f]'
                          : p.conferido
                          ? 'w-1.5 bg-emerald-400'
                          : 'w-1.5 bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="max-w-lg mx-auto">
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
                    onClick={adicionarAoCarrinhoEAbrir}
                    className="w-full h-12 sm:h-14 text-sm sm:text-base rounded-xl font-semibold shadow-lg"
                    size="lg"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`, boxShadow: `0 4px 14px ${primaryColor}40` }}
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Adicionar ao Carrinho
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

      </AnimatePresence>
    </OrcamentoWizardLayout>
  );
}
