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
  AGUARDANDO_APROVACAO: {
    label: "Aguardando Aprovação",
    color: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  AGUARDANDO_PAGAMENTO: {
    label: "Aguardando Pagamento",
    color: "bg-orange-100 text-orange-700",
    icon: CreditCard,
  },
  EM_PRODUCAO: { label: "Em Produção", color: "bg-[#1a3a8f]/15 text-[#1a3a8f]", icon: Truck },
  AGUARDANDO_RETIRADA: {
    label: "Pronto para Retirada",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
  CANCELADO: { label: "Cancelado", color: "bg-red-100 text-red-700", icon: XCircle },
};

export const ETAPAS_PUBLICO = [
  { id: 1, nome: "Categoria", icone: Layers },
  { id: 2, nome: "Tipologia + Medidas", icone: Calculator },
  { id: 3, nome: "Conferência", icone: Check },
  { id: 4, nome: "Acessórios", icone: Plus },
];

export const ETAPAS_ADMIN = [
  { id: 1, nome: "Categoria", icone: Layers },
  { id: 2, nome: "Tipologia + Variáveis", icone: Calculator },
  { id: 3, nome: "Conferência", icone: Check },
  { id: 4, nome: "Resumo/Preço", icone: CreditCard },
  { id: 5, nome: "Pagamento", icone: CreditCard },
];
