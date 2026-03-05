import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const STORAGE_KEY = 'vidraceiro';

const VidracerioContext = createContext(null);

export function useVidraceiro() {
  const ctx = useContext(VidracerioContext);
  if (!ctx) throw new Error('useVidraceiro must be used within VidracerioProvider');
  return ctx;
}

export function VidracerioProvider({ children }) {
  const [searchParams] = useSearchParams();
  const [vidraceiro, setVidraceiro] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [urlDefaults, setUrlDefaults] = useState({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.phone && parsed.name) {
          setVidraceiro(parsed);
          setInitialized(true);
          return;
        }
      } catch { /* ignore invalid JSON */ }
    }

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

  const identify = useCallback((data) => {
    const clean = { ...data };
    if (clean.docType === 'cpf') delete clean.companyName;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    setVidraceiro(clean);
    setShowModal(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setVidraceiro(null);
    setUrlDefaults({});
    setShowModal(true);
  }, []);

  if (!initialized) return null;

  return (
    <VidracerioContext.Provider value={{
      vidraceiro,
      isIdentified: !!vidraceiro,
      showModal,
      urlDefaults,
      identify,
      logout,
    }}>
      {children}
    </VidracerioContext.Provider>
  );
}
