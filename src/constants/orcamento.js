import {
  FileText,
  Clock,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Layers, Calculator, Check, Plus } from "lucide-react";

export const STATUS_CONFIG = {
  rascunho: { label: "Rascunho", color: "bg-slate-100 text-slate-700", icon: FileText },
  aguardando_aprovacao: {
    label: "Aguardando Aprovação",
    color: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  aguardando_pagamento: {
    label: "Aguardando Pagamento",
    color: "bg-orange-100 text-orange-700",
    icon: CreditCard,
  },
  em_producao: { label: "Em Produção", color: "bg-blue-100 text-blue-700", icon: Truck },
  aguardando_retirada: {
    label: "Pronto para Retirada",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
  concluido: {
    label: "Concluído",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
  },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-700", icon: XCircle },
};

export const ETAPAS_PUBLICO = [
  { id: 1, nome: "Categoria", icone: Layers },
  { id: 2, nome: "Tipologia + Medidas", icone: Calculator },
  { id: 3, nome: "Conferência", icone: Check },
  { id: 4, nome: "Acessórios", icone: Plus },
  { id: 5, nome: "Finalizar", icone: CheckCircle2 },
];

export const ETAPAS_ADMIN = [
  { id: 1, nome: "Categoria", icone: Layers },
  { id: 2, nome: "Tipologia + Variáveis", icone: Calculator },
  { id: 3, nome: "Conferência", icone: Check },
  { id: 4, nome: "Resumo/Preço", icone: CreditCard },
  { id: 5, nome: "Pagamento", icone: CreditCard },
];
