import { useState, useCallback } from "react";
import {
  FORM_INICIAL,
  VARIAVEL_INICIAL,
  PECA_INICIAL,
  CONFIGURACAO_TECNICA_INICIAL,
} from "../constants";

export function useTipologiaForm(initial = FORM_INICIAL) {
  const [formData, setFormData] = useState(initial);

  const adicionarVariavel = useCallback(() => {
    const novaVariavel = {
      ...VARIAVEL_INICIAL,
      id: `var_${Date.now()}`,
      ordem: formData.variaveis.length,
    };
    setFormData((p) => ({
      ...p,
      variaveis: [...p.variaveis, novaVariavel],
    }));
  }, [formData.variaveis.length]);

  const atualizarVariavel = useCallback((index, campo, valor) => {
    setFormData((p) => {
      const novasVars = [...p.variaveis];
      novasVars[index] = { ...novasVars[index], [campo]: valor };
      return { ...p, variaveis: novasVars };
    });
  }, []);

  const removerVariavel = useCallback((index) => {
    setFormData((p) => ({
      ...p,
      variaveis: p.variaveis.filter((_, i) => i !== index),
    }));
  }, []);

  const adicionarPeca = useCallback(() => {
    const novaPeca = {
      ...PECA_INICIAL,
      id: `peca_${Date.now()}`,
      ordem: formData.pecas.length,
    };
    setFormData((p) => ({
      ...p,
      pecas: [...p.pecas, novaPeca],
    }));
  }, [formData.pecas.length]);

  const atualizarPeca = useCallback((index, campo, valor) => {
    setFormData((p) => {
      const novasPecas = [...p.pecas];
      novasPecas[index] = { ...novasPecas[index], [campo]: valor };
      return { ...p, pecas: novasPecas };
    });
  }, []);

  const removerPeca = useCallback((index) => {
    setFormData((p) => ({
      ...p,
      pecas: p.pecas.filter((_, i) => i !== index),
    }));
  }, []);

  const adicionarConfiguracaoTecnica = useCallback((pecaIndex) => {
    const configuracao = {
      ...CONFIGURACAO_TECNICA_INICIAL,
      id: `config_${Date.now()}`,
    };
    setFormData((p) => {
      const novasPecas = [...p.pecas];
      novasPecas[pecaIndex].configuracoes_tecnicas = [
        ...(novasPecas[pecaIndex].configuracoes_tecnicas || []),
        configuracao,
      ];
      return { ...p, pecas: novasPecas };
    });
  }, []);

  const removerConfiguracaoTecnica = useCallback((pecaIndex, configIndex) => {
    setFormData((p) => {
      const novasPecas = [...p.pecas];
      novasPecas[pecaIndex].configuracoes_tecnicas =
        novasPecas[pecaIndex].configuracoes_tecnicas.filter((_, i) => i !== configIndex);
      return { ...p, pecas: novasPecas };
    });
  }, []);

  const atualizarConfiguracaoTecnica = useCallback((pecaIndex, configIndex, campo, valor) => {
    setFormData((p) => {
      const novasPecas = [...p.pecas];
      novasPecas[pecaIndex].configuracoes_tecnicas[configIndex] = {
        ...novasPecas[pecaIndex].configuracoes_tecnicas[configIndex],
        [campo]: valor,
      };
      return { ...p, pecas: novasPecas };
    });
  }, []);

  const toggleItemConfiguracao = useCallback((pecaIndex, configIndex, itemId) => {
    setFormData((p) => {
      const novasPecas = [...p.pecas];
      const config = novasPecas[pecaIndex].configuracoes_tecnicas[configIndex];
      const itensAtuais = config.itens_ids || [];
      config.itens_ids = itensAtuais.includes(itemId)
        ? itensAtuais.filter((id) => id !== itemId)
        : [...itensAtuais, itemId];
      return { ...p, pecas: novasPecas };
    });
  }, []);

  const addImagem = useCallback((url) => {
    setFormData((p) => ({ ...p, imagens: [...(p.imagens || []), url] }));
  }, []);

  const removerImagem = useCallback((index) => {
    setFormData((p) => ({
      ...p,
      imagens: (p.imagens || []).filter((_, i) => i !== index),
    }));
  }, []);

  const setPecaImagem = useCallback((pecaIndex, imagem_url) => {
    setFormData((p) => {
      const novasPecas = [...p.pecas];
      novasPecas[pecaIndex] = { ...novasPecas[pecaIndex], imagem_url };
      return { ...p, pecas: novasPecas };
    });
  }, []);

  const toggleAcessorio = useCallback((acessId) => {
    setFormData((p) => {
      const atual = p.acessorio_ids || [];
      return {
        ...p,
        acessorio_ids: atual.includes(acessId)
          ? atual.filter((id) => id !== acessId)
          : [...atual, acessId],
      };
    });
  }, []);

  const toggleTipoVidro = useCallback((vidroId) => {
    setFormData((p) => {
      const atual = p.tipos_vidro_ids || [];
      return {
        ...p,
        tipos_vidro_ids: atual.includes(vidroId)
          ? atual.filter((id) => id !== vidroId)
          : [...atual, vidroId],
      };
    });
  }, []);

  const selecionarCategoria = useCallback((catId) => {
    setFormData((p) => ({ ...p, categoria_id: catId || "" }));
  }, []);

  const resetForm = useCallback((initialState = FORM_INICIAL) => {
    setFormData(initialState);
  }, []);

  return {
    formData,
    setFormData,
    adicionarVariavel,
    atualizarVariavel,
    removerVariavel,
    adicionarPeca,
    atualizarPeca,
    removerPeca,
    adicionarConfiguracaoTecnica,
    removerConfiguracaoTecnica,
    atualizarConfiguracaoTecnica,
    toggleItemConfiguracao,
    addImagem,
    removerImagem,
    setPecaImagem,
    toggleAcessorio,
    toggleTipoVidro,
    selecionarCategoria,
    resetForm,
  };
}
