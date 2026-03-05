import React, { useState, useMemo } from "react";
import { entities } from "@/api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageHeader from "@/components/admin/PageHeader";
import OrcamentoFilters from "./orcamentos/OrcamentoFilters";
import OrcamentoList from "./orcamentos/OrcamentoList";
import OrcamentoDetailDialog from "./orcamentos/OrcamentoDetailDialog";

export default function Orcamentos() {
  const queryClient = useQueryClient();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState(null);

  const { data: orcamentos = [], isLoading } = useQuery({
    queryKey: ["admin-orcamentos"],
    queryFn: () => entities.Orcamento.listAll(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, motivo }) => entities.Orcamento.updateStatus(id, { status, motivo }),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-orcamentos"]);
    },
  });

  const orcamentosFiltrados = useMemo(
    () =>
      orcamentos.filter((orc) => {
        const matchBusca =
          !busca ||
          orc.numero?.toLowerCase().includes(busca.toLowerCase()) ||
          orc.cliente_nome?.toLowerCase().includes(busca.toLowerCase()) ||
          orc.tipologia_nome?.toLowerCase().includes(busca.toLowerCase());
        const matchStatus = filtroStatus === "todos" || orc.status === filtroStatus;
        return matchBusca && matchStatus;
      }),
    [orcamentos, busca, filtroStatus]
  );

  return (
    <div className="w-full">
      <PageHeader
        title="Orçamentos"
        description="Gerencie todos os orçamentos"
      />

      <OrcamentoFilters
        busca={busca}
        setBusca={setBusca}
        filtroStatus={filtroStatus}
        setFiltroStatus={setFiltroStatus}
      />

      <OrcamentoList
        orcamentosFiltrados={orcamentosFiltrados}
        isLoading={isLoading}
        busca={busca}
        filtroStatus={filtroStatus}
        onSelect={setOrcamentoSelecionado}
      />

      <OrcamentoDetailDialog
        orcamento={orcamentoSelecionado}
        open={!!orcamentoSelecionado}
        onOpenChange={(open) => !open && setOrcamentoSelecionado(null)}
        onUpdateStatus={(id, status) =>
          updateStatusMutation.mutate({ id, status })
        }
        isUpdatingStatus={updateStatusMutation.isPending}
      />
    </div>
  );
}
