# Barbearia - Sistema de Agendamento Online

Sistema completo de agendamento para barbearia com painel admin, controle de faturamento e notificacoes em tempo real.

---

## 1. Estrutura do Projeto

```
/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # Conexao SQLite com Sequelize
│   │   ├── controllers/
│   │   │   ├── AdminController.js      # (CRIADO) Admin: agendamentos do dia, faturamento, notificacoes
│   │   │   ├── AppointmentController.js # CRUD agendamentos
│   │   │   ├── AuthController.js       # Login, cadastro
│   │   │   ├── BarberController.js     # CRUD barbeiros
│   │   │   ├── ClienteController.js    # Cliente: meus agendamentos, cancelar
│   │   │   ├── ServiceController.js    # CRUD servicos
│   │   │   └── UserController.js       # CRUD usuarios
│   │   ├── helpers/
│   │   │   ├── sanitize.js             # Sanitizacao HTML (stripHtml)
│   │   │   ├── socket.js               # (CRIADO) Configuracao do Socket.IO
│   │   │   └── validate.js             # (CRIADO) Funcoes de validacao reutilizaveis
│   │   ├── middlewares/
│   │   │   └── auth.js                 # Autenticacao JWT (autenticar + adminOnly)
│   │   ├── migrations/                 # (CRIADO) Migrations do banco de dados
│   │   │   ├── 20240101000001-create-users.js
│   │   │   ├── 20240101000002-create-barbers.js
│   │   │   ├── 20240101000003-create-services.js
│   │   │   ├── 20240101000004-create-appointments.js
│   │   │   └── 20240101000005-create-notifications.js
│   │   ├── models/
│   │   │   ├── index.js
│   │   │   ├── Appointment.js
│   │   │   ├── Barber.js
│   │   │   ├── Notification.js          # (CRIADO) Modelo de notificacoes
│   │   │   ├── Service.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── admin.js                # (CRIADO) Rotas do admin
│   │   │   └── ... (demais rotas)
│   │   └── server.js                   # Servidor Express + Socket.IO + Migrations
│   ├── .env
│   ├── .sequelizerc                    # (CRIADO) Config do sequelize-cli
│   └── package.json
│
└── frontend/
    ├── admin/
    │   ├── login.html
    │   └── dashboard.html              # (ATUALIZADO) Painel admin completo
    ├── config.js                       # URL da API (automatically detected)
    └── ... (demais paginas)
```

---

## 2. Credenciais Admin

| Campo | Valor |
|-------|-------|
| Email | `admin@barbearia.com` |
| Senha | Definida pela variavel `ADMIN_PASSWORD` no `.env` (padrao: `admin123`) |

Criado automaticamente pelo seed na inicializacao. Altere a senha definindo `ADMIN_PASSWORD` no `.env`.

---

## 3. Rotas da API

### 3.1 Autenticacao (`/api/auth`)

| Metodo | Rota | Descricao | Auth |
|--------|------|-----------|------|
| POST | `/api/auth/login` | Login (email + senha) | - |
| POST | `/api/auth/cadastrar` | Cadastro cliente | - |
| GET | `/api/auth/me` | Dados do usuario logado | Token |

### 3.2 Admin (`/api/admin`) — (CRIADO)

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/admin/agendamentos/hoje` | Agendamentos do dia (cliente, horario, barbeiro, servico) |
| GET | `/api/admin/agendamentos/faturamento` | Faturamento diario (total, 85% dono, 15% barbeiro) |
| DELETE | `/api/admin/agendamentos/:id` | Excluir agendamento |
| GET | `/api/admin/notificacoes` | Listar ultimas 50 notificacoes |
| PUT | `/api/admin/notificacoes/:id/lida` | Marcar notificacao como lida |
| PUT | `/api/admin/notificacoes/ler-todas` | Marcar todas como lidas |

Todas as rotas admin exigem `autenticar` + `adminOnly`.

### 3.3 Agendamentos (`/api/agendamentos`)

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/agendamentos` | Listar (admin) — filtros: `?data=`, `?status=`, `?barbeiroId=` |
| POST | `/api/agendamentos` | Criar agendamento |
| PUT | `/api/agendamentos/:id/status` | Alterar status (admin) |
| PUT | `/api/agendamentos/:id/cancelar` | Cancelar (dono ou admin) |
| DELETE | `/api/agendamentos/:id` | Deletar (admin) |
| GET | `/api/agendamentos/horarios` | Horarios ocupados (`?data=&barbeiroId=`) |

### 3.4 Servicos (`/api/servicos`)

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/servicos` | Listar ativos (publico) |
| GET | `/api/servicos/todos` | Listar todos (admin) |
| POST | `/api/servicos` | Criar (admin) |
| PUT | `/api/servicos/:id` | Atualizar (admin) |
| DELETE | `/api/servicos/:id` | Deletar (admin) |

### 3.5 Barbeiros (`/api/barbeiros`)

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/api/barbeiros` | Listar ativos (publico) |
| GET | `/api/barbeiros/todos` | Listar todos (admin) |
| POST | `/api/barbeiros` | Criar (admin) |
| PUT | `/api/barbeiros/:id` | Atualizar (admin) |
| DELETE | `/api/barbeiros/:id` | Deletar (admin) |

---

## 4. Painel Admin

Acessar `/admin` → redireciona para `/admin/login.html`

**Login:** `admin@barbearia.com` (senha definida em `ADMIN_PASSWORD` no `.env`)

**Abas do Dashboard:**

| Aba | Descricao |
|-----|-----------|
| **Dashboard** | Cards resumo + tabela de agendamentos de hoje |
| **Agendamentos** | Lista completa com filtros (data/status), alterar status, excluir |
| **Financas** | Faturamento diario: cards (Total Bruto, Dono 85%, Barbeiro 15%) + tabela detalhada |
| **Servicos** | CRUD (criar, editar, excluir) |
| **Barbeiros** | CRUD com dias de trabalho e horarios |
| **Clientes** | Listagem de clientes cadastrados |
| **Notificacoes** | Notificacoes em tempo real com badge de nao lidas |

---

## 5. Notificacoes em Tempo Real

- **Socket.IO** integrado ao servidor HTTP
- Quando um novo agendamento e criado:
  1. Uma notificacao e salva no banco (`Notifications`)
  2. Um evento `novo-agendamento` e emitido via WebSocket com: `cliente`, `horario`, `barbeiro`, `servico`
- No frontend admin:
  1. Aparece um toast com os dados do agendamento
  2. Um som de alerta e reproduzido
  3. O badge vermelho no sidebar e atualizado
- As notificacoes persistem no banco e podem ser marcadas como lidas

---

## 6. Validacao de Dados — (CRIADO)

Arquivo `backend/src/helpers/validate.js` com funcoes:

| Funcao | Descricao |
|--------|-----------|
| `campoObrigatorio(valor, nome)` | Verifica se campo nao esta vazio |
| `stringValida(valor, nome, min, max)` | Valida tamanho da string |
| `emailValido(email)` | Valida formato de email |
| `valorPositivo(valor, nome)` | Valida numero positivo |
| `inteiroPositivo(valor, nome)` | Valida inteiro positivo |
| `statusValido(status)` | Valida status do agendamento |
| `idValido(id)` | Valida ID numerico |
| `validar(validacoes)` | Executa lista de validacoes e retorna primeiro erro |

Todas as rotas com entrada de dados validam antes de processar.

---

## 7. Migrations — (CRIADO)

### Como funciona

- `sequelize.sync()` foi substituido por `umzug` no `server.js`
- Na inicializacao, o servidor verifica se ha migrations pendentes e as aplica
- Migrations sao idempotentes: verificam se a tabela ja existe antes de criar
- O rastreamento e feito pela tabela `SequelizeMeta` no banco

### Comandos

```bash
npm run migrate        # Rodar migrations pendentes
npm run migrate:undo   # Desfazer ultima migration
```

### Migrations existentes

1. `create-users` — `Users` (id, nome, email, senha, telefone, role, timestamps)
2. `create-barbers` — `Barbers` (id, nome, foto, dias_trabalho, hora_inicio, hora_fim, ativo, timestamps)
3. `create-services` — `Services` (id, nome, descricao, preco, duracao, ativo, timestamps)
4. `create-appointments` — `Appointments` (id, data, hora, status, observacao, clienteId, barbeiroId, servicoId, timestamps)
5. `create-notifications` — `Notifications` (id, mensagem, lida, timestamps)

---

## 8. Como Rodar

```bash
# Backend
cd backend
npm install
# Criar arquivo .env a partir do template (opcional, o servidor funciona sem)
# copie o conteudo abaixo para um arquivo .env:
# PORT=3000
# JWT_SECRET=seu_segredo_aqui
# JWT_EXPIRES_IN=7d
# CORS_ORIGIN=http://localhost:3000
# ADMIN_PASSWORD=
npm start              # Inicia em http://localhost:3000

# Frontend
# Servido estaticamente pelo backend na rota /
# Acessar http://localhost:3000
```

---

## 9. Tecnologias

- **Backend:** Node.js, Express, Sequelize (SQLite), Socket.IO, JWT, bcrypt
- **Frontend:** HTML, CSS, Bootstrap 5, Bootstrap Icons, Socket.IO Client
- **Banco:** SQLite (via `sqlite3`)
