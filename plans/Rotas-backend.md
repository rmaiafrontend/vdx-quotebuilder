# VDX — Vidraçaria Digital Express
**Documentação de Rotas do Backend**  
*Versão 1.0 · Março 2026 · 18 migrations aplicadas em produção*

---

## 1. Autenticação e Tokens

O backend possui **3 cadeias de autenticação independentes**. Cada rota aceita apenas o tipo de token correspondente à sua cadeia.

| Token | Como obter | Header | Acessa |
|---|---|---|---|
| `vidraceiro_token` | `POST /api/vidraceiro/identificar` | `Authorization: Bearer {token}` | `/api/vidraceiro/*` (exceto `/identificar`) |
| `admin_token` | `POST /api/admin/auth/login` | `Authorization: Bearer {token}` | `/api/admin/*` · `/api/configuracao/*` (POST/PUT/DELETE) · `/api/orcamentos` |
| `agente_api_key` | Configurado no servidor (env var) | `X-API-Key: {chave}` | `/api/agente/*` |

---

## 2. Rotas Públicas — Configuração

Sem autenticação. Usadas pelo frontend para carregar o catálogo de produtos.

| Método | Rota | Descrição | Parâmetros |
|---|---|---|---|
| `GET` | `/api/configuracao/categorias` | Lista todas as categorias ativas (Janelas, Portas, Box, etc.) | — |
| `GET` | `/api/configuracao/categorias/{id}/tipologias` | Lista as tipologias ativas de uma categoria, com variáveis, fórmulas e peças | `id` (path): ID da categoria |
| `GET` | `/api/configuracao/tipologias/{id}/cores-com-preco` | Retorna as cores de vidro disponíveis para uma tipologia com o preço final calculado | `id` (path): ID da tipologia · `areaTotalM2` (query, obrigatório): área em m² |
| `GET` | `/api/configuracao/cores` | Lista todas as cores de vidro cadastradas | — |
| `GET` | `/api/configuracao/cores/{codigo}` | Retorna uma cor específica pelo código (ex: INC, VD, CI) | `codigo` (path): código da cor |

---

## 3. Rotas do Vidraceiro

Acessadas pelo vidraceiro via app. O fluxo começa sempre em `/identificar`, que retorna o token para as demais rotas.

> ⚠️ O campo `nome` só é obrigatório em `/identificar` se o CPF/CNPJ não existir no cadastro (resposta 404 sem nome).

| Método | Rota | Descrição | Parâmetros | Acesso |
|---|---|---|---|---|
| `POST` | `/api/vidraceiro/identificar` | Identifica ou cadastra um vidraceiro pelo CPF ou CNPJ. Retorna token JWT. Se não existir e nome for informado, cria o cadastro | Body: `{ cpf_cnpj, doc_type (CPF/CNPJ), nome (obrigatório apenas se novo cadastro), telefone (opcional) }` | Pública (whitelist) |
| `GET` | `/api/vidraceiro/me` | Retorna os dados do vidraceiro autenticado | Header: `Authorization: Bearer {token}` | Requer token vidraceiro |
| `POST` | `/api/vidraceiro/orcamentos` | Cria um novo orçamento vinculado ao vidraceiro autenticado. Gera número `VDX-XXXX` automaticamente | Header: `Authorization: Bearer {token}` · Body: `{ cliente_nome, cliente_telefone, cliente_email (opcional), itens (array de peças), preco_total }` | Requer token vidraceiro |
| `GET` | `/api/vidraceiro/me/orcamentos` | Lista todos os orçamentos do vidraceiro autenticado | Header: `Authorization: Bearer {token}` | Requer token vidraceiro |
| `GET` | `/api/vidraceiro/orcamentos/{id}` | Retorna o detalhe de um orçamento específico do vidraceiro autenticado | `id` (path): ID do orçamento · Header: `Authorization: Bearer {token}` | Requer token vidraceiro |

---

## 4. Rotas do Admin / Vendedor

Acessadas pelo backoffice. Requerem token obtido via `/api/admin/auth/login` com email e senha.

| Método | Rota | Descrição | Parâmetros | Acesso |
|---|---|---|---|---|
| `POST` | `/api/admin/auth/login` | Autentica um usuário admin ou vendedor. Retorna token JWT + perfil | Body: `{ email, senha }` | Pública (whitelist) |
| `GET` | `/api/admin/orcamentos` | Lista todos os orçamentos do sistema com filtros opcionais | Header: `Authorization: Bearer {token}` · Query (opcionais): `status`, `clienteNome`, `dataInicio`, `dataFim` | Requer token admin/vendedor |
| `GET` | `/api/admin/orcamentos/{id}` | Retorna o detalhe completo de um orçamento (peças, valores, histórico de status) | `id` (path): ID do orçamento · Header: `Authorization: Bearer {token}` | Requer token admin/vendedor |
| `GET` | `/api/admin/orcamentos/stats` | Retorna contagens de orçamentos por status para o dashboard | Header: `Authorization: Bearer {token}` | Requer token admin/vendedor |
| `PATCH` | `/api/admin/orcamentos/{id}/status` | Atualiza o status de um orçamento. Respeita as transições válidas do pipeline. Dispara webhook LangGraph se configurado | `id` (path): ID do orçamento · Header: `Authorization: Bearer {token}` · Body: `{ status, motivo (obrigatório se cancelando) }` | Requer token admin/vendedor |

### 4.1 Pipeline de Status do Orçamento

As transições de status são validadas pelo backend. Apenas sequências válidas são aceitas.

> ⚠️ Campo `motivo` é obrigatório ao cancelar. Transição inválida retorna **HTTP 422**.

| Status | Descrição |
|---|---|
| `AGUARDANDO_APROVACAO` | Estado inicial. Orçamento criado pelo vidraceiro, aguardando análise do vendedor |
| `AGUARDANDO_PAGAMENTO` | Vendedor aprovou. Aguardando confirmação de pagamento do vidraceiro |
| `EM_PRODUCAO` | Pagamento confirmado. Peças em fabricação |
| `AGUARDANDO_RETIRADA` | Produção finalizada. Pronto para entrega ou retirada |
| `CANCELADO` | Orçamento cancelado. Requer campo `motivo` no body |

```
AGUARDANDO_APROVACAO → AGUARDANDO_PAGAMENTO → EM_PRODUCAO → AGUARDANDO_RETIRADA
         ↓                      ↓                  ↓                 ↓
      CANCELADO             CANCELADO           CANCELADO         CANCELADO
```

---

## 5. Rotas do Backoffice — CRUD Catálogo

Gerenciamento de categorias e tipologias pelo admin. Requerem token admin.

| Método | Rota | Descrição | Parâmetros |
|---|---|---|---|
| `GET` | `/api/configuracao/categorias/{id}` | Retorna o detalhe de uma categoria específica | `id` (path) · Header: `Authorization: Bearer {token}` |
| `POST` | `/api/configuracao/categorias` | Cria uma nova categoria de produto | Header: `Authorization: Bearer {token}` · Body: `{ nome, descricao, ativo, ordem }` |
| `PUT` | `/api/configuracao/categorias/{id}` | Atualiza os dados de uma categoria existente | `id` (path) · Header: `Authorization: Bearer {token}` · Body: campos a atualizar |
| `DELETE` | `/api/configuracao/categorias/{id}` | Remove (ou desativa) uma categoria | `id` (path) · Header: `Authorization: Bearer {token}` |
| `POST` | `/api/configuracao/tipologias` | Cria uma nova tipologia vinculada a uma categoria | Header: `Authorization: Bearer {token}` · Body: `{ categoriaId, nome, descricao, ativo, ordem, variaveis[], formulas[], pecas[] }` |
| `PUT` | `/api/configuracao/tipologias/{id}` | Atualiza uma tipologia existente incluindo variáveis, fórmulas e peças | `id` (path) · Header: `Authorization: Bearer {token}` · Body: campos a atualizar |
| `DELETE` | `/api/configuracao/tipologias/{id}` | Remove (ou desativa) uma tipologia | `id` (path) · Header: `Authorization: Bearer {token}` |

---

## 6. Rotas do Agente (LangGraph)

Usadas exclusivamente pelo agente de IA (N8n/LangGraph) via API Key. **Não são acessadas pelo frontend.**

> ⚠️ `LANGGRAPH_WEBHOOK_URL` ainda não configurado em produção (placeholder vazio). O backend loga `WARN` mas não falha.

| Método | Rota | Descrição | Parâmetros |
|---|---|---|---|
| `GET` | `/api/agente/cliente/existe` | Verifica se um cliente existe pelo CPF ou CNPJ. Usado pelo agente LangGraph | Header: `X-API-Key: {agente_api_key}` · Query: `cpf_cnpj`, `doc_type` |
| `GET` | `/api/agente/orcamentos` | Lista orçamentos com filtros. Usado pelo agente para consultar o histórico de um cliente | Header: `X-API-Key: {agente_api_key}` · Query (opcionais): `clienteCpfCnpj`, `status` |

---

## 7. Rotas de Validação de Vidro (ABNT)

Validação automática conforme NBR 7199, 14207, 14718 e 16259. Retorna alertas e bloqueios de segurança.

> ⚠️ Tipos de retorno: `BLOQUEIO` (impede avanço no wizard) e `AVISO` (exibe alerta mas permite continuar).

| Método | Rota | Descrição | Parâmetros |
|---|---|---|---|
| `POST` | `/api/vidro/validar` | Valida a seleção de vidro conforme as normas ABNT. Retorna alertas e bloqueios | Body: `{ categoria, cor_codigo, largura_mm, altura_mm }` |
| `GET` | `/api/vidro/regras` | Retorna as regras de seleção automática de vidro por categoria | — |

---

## 8. Credenciais de Teste

| Perfil | Email / CPF | Senha / Fluxo | Acessa |
|---|---|---|---|
| **Admin** | `admin@vdx.com.br` | `admin123` | `/admin/login` → dashboard, orçamentos, backoffice |
| **Vidraceiro** | Qualquer CPF ou CNPJ válido | Sem senha — só CPF/CNPJ | Tela principal → wizard → histórico |

---

*Backend em produção: `https://177.73.87.130:9090` · 18 migrations · Java 21 + Spring Boot 3.5*
