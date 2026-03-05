import { z } from 'zod';
import { validateCPF, validateCNPJ, stripNonDigits } from '@/utils/docUtils';

const vidraceiroCpfSchema = z.object({
  phone: z.string().refine(v => stripNonDigits(v).length >= 10, 'Telefone obrigatório'),
  name: z.string().min(2, 'Nome obrigatório'),
  docType: z.literal('cpf'),
  doc: z.string().refine(validateCPF, 'CPF inválido'),
});

const vidraceiroCnpjSchema = z.object({
  phone: z.string().refine(v => stripNonDigits(v).length >= 10, 'Telefone obrigatório'),
  name: z.string().min(2, 'Nome obrigatório'),
  docType: z.literal('cnpj'),
  doc: z.string().refine(validateCNPJ, 'CNPJ inválido'),
  companyName: z.string().min(2, 'Nome da empresa obrigatório'),
});

export const vidraceiroSchema = z.discriminatedUnion('docType', [
  vidraceiroCpfSchema,
  vidraceiroCnpjSchema,
]);
