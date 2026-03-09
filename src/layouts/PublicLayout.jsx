import React from 'react';
import { VidracerioProvider } from '@/lib/VidracerioContext';
import { CarrinhoProvider } from '@/hooks/useCarrinho';
import IdentidadeModal from '@/components/public/IdentidadeModal';
import BottomNav from '@/components/public/PublicHeader';
import CarrinhoDrawer from '@/components/public/CarrinhoDrawer';
import { useCompanyTheme } from '@/hooks/useCompanyTheme';

function PublicLayoutInner({ children }) {
  const { primaryColor } = useCompanyTheme();

  return (
    <div className="min-h-screen bg-slate-50">
      <IdentidadeModal />
      <div className="pb-20">
        {children}
      </div>
      <BottomNav primaryColor={primaryColor} />
      <CarrinhoDrawer />
    </div>
  );
}

export default function PublicLayout({ children }) {
  return (
    <VidracerioProvider>
      <CarrinhoProvider>
        <PublicLayoutInner>{children}</PublicLayoutInner>
      </CarrinhoProvider>
    </VidracerioProvider>
  );
}
