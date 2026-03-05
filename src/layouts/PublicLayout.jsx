import React from 'react';
import { VidracerioProvider } from '@/lib/VidracerioContext';
import IdentidadeModal from '@/components/public/IdentidadeModal';

export default function PublicLayout({ children }) {
  return (
    <VidracerioProvider>
      <div className="min-h-screen bg-slate-50">
        <IdentidadeModal />
        {children}
      </div>
    </VidracerioProvider>
  );
}
