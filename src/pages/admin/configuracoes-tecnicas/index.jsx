import React from "react";
import { Palette, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/admin/PageHeader";
import TiposVidroTab from "./TiposVidroTab";
import ConfiguracoesTab from "./ConfiguracoesTab";

export default function ConfiguracoesTecnicasPage() {
  return (
    <div className="w-full">
      <PageHeader
        title="Configurações Técnicas"
        description="Configure características técnicas das tipologias (não são produtos comercializáveis)"
      />
      <Tabs defaultValue="vidros" className="space-y-6">
        <TabsList className="bg-slate-100 rounded-xl p-1 h-auto">
          <TabsTrigger value="vidros" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-4 text-sm">
            <Palette className="w-4 h-4" />
            Tipos de Vidro
          </TabsTrigger>
          <TabsTrigger value="configuracoes" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-4 text-sm">
            <Settings className="w-4 h-4" />
            Configurações Personalizadas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="vidros">
          <TiposVidroTab />
        </TabsContent>
        <TabsContent value="configuracoes" className="space-y-6">
          <ConfiguracoesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
