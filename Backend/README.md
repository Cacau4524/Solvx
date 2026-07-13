# Solvy — Backend (API REST)

Node.js + Express + MySQL, seguindo padrão MVC. JWT para autenticação, bcrypt para senhas,
helmet + cors + rate limiting para segurança básica.

## Estrutura

```
src/
├── server.js              → ponto de entrada (Express app)
├── config/database.js     → pool de conexões MySQL
├── controllers/           → recebem req/res, chamam services
├── services/               → regra de negócio
├── models/                  → acesso a dados (queries SQL)
├── routes/                  → definição dos endpoints + validação
├── middlewares/             → auth, role, upload, validação, erros
├── utils/                   → jwt, asyncHandler, AppError, gerador de hash
└── uploads/                 → arquivos enviados (fotos, documentos, currículos)
database/
├── schema.sql                → estrutura completa do banco
└── seed.sql                  → categorias iniciais
```

## Como instalar e rodar

**1. Pré-requisitos:** Node.js 18+ e MySQL 8+ instalados.

**2. Instalar dependências:**
```
cd solvy-backend
npm install
```

**3. Configurar variáveis de ambiente:**
```
cp .env.example .env
```
Edite o `.env` com os dados do seu MySQL local (`DB_USER`, `DB_PASSWORD`) e troque
`JWT_SECRET` / `JWT_REFRESH_SECRET` por strings aleatórias longas.

**4. Criar o banco e as tabelas:**
```
npm run db:create
```

**5. Popular com dados iniciais (categorias):**
```
npm run db:seed
```

**6. Rodar o servidor:**
```
npm run dev
```
A API sobe em `http://localhost:3000`. Teste com `GET http://localhost:3000/health`.

## Criando um usuário de teste

Não incluímos usuários fictícios no seed porque a senha precisa ser um hash bcrypt
gerado de verdade. Duas opções:

- **Recomendado:** use o Postman/Insomnia/curl para chamar `POST /api/auth/client/register`
  ou `POST /api/auth/provider/register` normalmente — a senha já entra em texto puro e o
  próprio backend faz o hash.
- **Manual:** rode `node src/utils/generate-hash.js "SuaSenha123!"` e cole o hash resultante
  num `INSERT INTO users (...)` direto no banco.

## Rotas da API

### Auth
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | `/api/auth/client/register` | — | Cadastro de cliente |
| POST | `/api/auth/client/login` | — | Login de cliente |
| POST | `/api/auth/provider/register` | — | Cadastro de prestador (fica `EM_ANALISE`) |
| POST | `/api/auth/provider/login` | — | Login de prestador |
| POST | `/api/auth/refresh` | — | Renova o access token |
| POST | `/api/auth/logout` | — | Revoga o refresh token |
| GET | `/api/auth/profile` | Bearer | Dados do usuário logado |
| PUT | `/api/auth/profile` | Bearer | Atualiza nome/telefone |

### Serviços (catálogo oferecido pelo prestador)
| Método | Rota | Autenticação |
|---|---|---|
| GET | `/api/services` | — |
| GET | `/api/services/:id` | — |
| POST | `/api/services` | Bearer (prestador aprovado) |
| PUT | `/api/services/:id` | Bearer (dono do serviço) |
| DELETE | `/api/services/:id` | Bearer (dono do serviço) |

### Solicitações de serviço (fluxo cliente ↔ prestador)
| Método | Rota | Autenticação |
|---|---|---|
| POST | `/api/service-requests` | Bearer (cliente) |
| GET | `/api/service-requests/me` | Bearer (cliente) |
| POST | `/api/service-requests/:id/cancelar` | Bearer (cliente) |
| GET | `/api/service-requests/recebidas` | Bearer (prestador) |
| POST | `/api/service-requests/:id/aceitar` | Bearer (prestador) |
| POST | `/api/service-requests/:id/recusar` | Bearer (prestador) |
| POST | `/api/service-requests/:id/concluir` | Bearer (prestador) |

### Avaliações, categorias, upload e usuários (admin)
| Método | Rota | Autenticação |
|---|---|---|
| POST | `/api/reviews` | Bearer (cliente) |
| GET | `/api/reviews/prestador/:providerId` | — |
| GET | `/api/reviews/prestador/:providerId/resumo` | — |
| GET | `/api/categories` | — |
| POST | `/api/upload` | Bearer (multipart, campo `file`) |
| GET/PUT/DELETE | `/api/users` | Bearer (role admin) |

## Segurança implementada
- Senhas com **bcrypt** (10 rounds).
- **JWT** de curta duração (15 min) + **refresh token** (7 dias) rotativo, com tabela
  `refresh_tokens` permitindo revogação (logout de verdade, não só apagar do client).
- **helmet** (headers de segurança) e **cors** restrito à origem do frontend.
- **Rate limiting** geral (300 req/15min por IP) e mais rígido no login (20 req/15min).
- Validação de entrada em toda rota de escrita via `express-validator`.
- Queries parametrizadas (`?`) em 100% dos acessos ao banco — sem concatenação de string,
  o que já elimina SQL Injection nesse padrão.
- `helmet` + JSON parsing com limite de tamanho mitigam alguns vetores de XSS/payload
  gigante, mas sanitização de HTML no conteúdo livre (ex.: descrição de serviço) ainda é
  um ponto de atenção se você for renderizar esse texto como HTML no frontend — hoje o
  Angular já escapa isso por padrão via interpolação `{{ }}`, então está seguro *contanto
  que você não use `[innerHTML]` com esse conteúdo sem sanitizar*.

## Conectando ao frontend Angular
O frontend já está apontando para `http://localhost:3000/api` (arquivo
`src/app/core/config/api.config.ts` do projeto Angular). Se o backend rodar em outra porta
ou endereço, edite esse arquivo.

## O que ainda falta (próximos passos sugeridos)
- Middleware de sanitização adicional (ex.: `express-mongo-sanitize`-like para SQL, embora
  já mitigado pelas queries parametrizadas).
- Endpoint de aprovação/reprovação de prestador (hoje o status fica `EM_ANALISE` por padrão
  e precisa ser alterado manualmente no banco ou por um futuro painel admin).
- Envio de e-mail real nas notificações (hoje só a tabela `notifications` existe, sem
  disparo automático).
- Testes automatizados (nenhum foi incluído nesta etapa).
