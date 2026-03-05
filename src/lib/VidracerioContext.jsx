import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiClient } from '@/api/apiClient';

const STORAGE_KEY = 'vidraceiro';

const VidracerioContext = createContext(null);

export function useVidraceiro() {
  const ctx = useContext(VidracerioContext);
  if (!ctx) throw new Error('useVidraceiro must be used within VidracerioProvider');
  return ctx;
}

function stripNonDigits(str) {
  return str ? str.replace(/\D/g, '') : '';
}

export function VidracerioProvider({ children }) {
  const [searchParams] = useSearchParams();
  const [vidraceiro, setVidraceiro] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [urlDefaults, setUrlDefaults] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Tentar restaurar sessao do localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    const token = localStorage.getItem('vidraceiro_token');
    if (stored && token) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.phone && parsed.name) {
          setVidraceiro(parsed);
          setInitialized(true);
          return;
        }
      } catch { /* ignore invalid JSON */ }
    }

    // Limpar token orfao
    localStorage.removeItem('vidraceiro_token');

    const phone = searchParams.get('phone') || '';
    const name = searchParams.get('name') || '';
    setUrlDefaults({ phone, name });

    if (phone || name) {
      const url = new URL(window.location.href);
      url.searchParams.delete('phone');
      url.searchParams.delete('name');
      window.history.replaceState({}, '', url.pathname + url.search);
    }

    setShowModal(true);
    setInitialized(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const identify = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/api/vidraceiro/identificar', {
        documento: stripNonDigits(data.doc),
        doc_type: data.docType.toUpperCase(),
        nome: data.name,
        telefone: stripNonDigits(data.phone),
      }, { tokenScope: 'public' });

      if (response.token) {
        localStorage.setItem('vidraceiro_token', response.token);
      }

      const clean = { ...data };
      if (clean.docType === 'cpf') delete clean.companyName;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
      setVidraceiro(clean);
      setShowModal(false);
    } catch (err) {
      setError(err.message || 'Erro ao identificar. Verifique seus dados.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('vidraceiro_token');
    setVidraceiro(null);
    setUrlDefaults({});
    setShowModal(true);
    setError(null);
  }, []);

  if (!initialized) return null;

  return (
    <VidracerioContext.Provider value={{
      vidraceiro,
      isIdentified: !!vidraceiro,
      showModal,
      urlDefaults,
      isLoading,
      error,
      identify,
      logout,
    }}>
      {children}
    </VidracerioContext.Provider>
  );
}
