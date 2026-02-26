import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { entities } from "@/api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    queryKey: ["orcamentos"],
    queryFn: () => entities.Orcamento.list("-created_date", 100),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => entities.Orcamento.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["orcamentos"]);
      setOrcamentoSelecionado(null);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => entities.Orcamento.update(id, { status }),
    onSuccess: (updatedOrcamento) => {
      queryClient.invalidateQueries(["orcamentos"]);
      if (orcamentoSelecionado?.id === updatedOrcamento.id) {
        setOrcamentoSelecionado(updatedOrcamento);
      }
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
        action={
          <Link to="/admin/orcamentos/novo">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Orçamento
            </Button>
          </Link>
        }
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
        onDelete={(id) => deleteMutation.mutate(id)}
        isDeleting={deleteMutation.isPending}
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
