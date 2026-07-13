/**
 * Arquivo principal do servidor da aplicacao.
 * Configura o Express, middlewares, rotas e inicializa o servidor.
 *
 * @module server
 */

const path = require('path');
const http = require('http');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');
const { autenticar } = require('./middlewares/auth');
const socketInit = require('./helpers/socket');

const authRoutes = require('./routes/autenticacao');
const serviceRoutes = require('./routes/servicos');
const barberRoutes = require('./routes/barbeiros');
const appointmentRoutes = require('./routes/agendamentos');
const userRoutes = require('./routes/usuarios');
const clienteRoutes = require('./routes/cliente');
const adminRoutes = require('./routes/admin');
const seedRoutes = require('./routes/semente');
const { seedarBanco } = require('./routes/semente');

/** Instancia do servidor Express */
const app = express();
const server = http.createServer(app);
const io = socketInit.init(server);
const PORT = process.env.PORT || 3000;

/* Middlewares globais */
app.use(helmet({ contentSecurityPolicy: false }));
const corsOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'];
app.use(cors({ origin: corsOrigins, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, '../../frontend')));

/* Rotas da API */
app.use('/api/auth', authRoutes);       // Autenticacao
app.use('/api/servicos', serviceRoutes); // Servicos
app.use('/api/barbeiros', barberRoutes); // Barbeiros
app.use('/api/agendamentos', appointmentRoutes); // Agendamentos
app.use('/api/usuarios', userRoutes);   // Usuarios
app.use('/api/cliente', clienteRoutes); // Cliente (meus agendamentos)
app.use('/api/admin', adminRoutes);     // Admin
app.use('/api', seedRoutes);            // Seed

/** GET /api/health - Health check da API (publico) */
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const frontendPath = path.join(__dirname, '../../frontend');
/** GET /login - Pagina de login do cliente */
app.get('/login', (req, res) => res.sendFile(path.join(frontendPath, 'login.html')));
/** GET /meus-agendamentos - Pagina de consulta de agendamentos do cliente */
app.get('/meus-agendamentos', (req, res) => res.sendFile(path.join(frontendPath, 'meus-agendamentos.html')));
/** GET /agendar - Pagina de agendamento do frontend */
app.get('/agendar', (req, res) => res.sendFile(path.join(frontendPath, 'agendar.html')));
/** GET /admin - Redireciona para pagina de login do admin */
app.get('/admin', (req, res) => res.redirect('/admin/login.html'));

/* Middleware global de tratamento de erros */
app.use((err, req, res, next) => {
  console.error('Erro nao tratado:', err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

/**
 * Funcao principal de inicializacao do servidor.
 * Sincroniza o banco de dados com os modelos e inicia a escuta na porta configurada.
 *
 * @async
 * @function iniciar
 * @returns {Promise<void>}
 * @throws {Error} Caso ocorra erro ao sincronizar ou iniciar o servidor
 */
async function rodarMigracoes() {
  const { Umzug, SequelizeStorage } = require('umzug');
  const umzug = new Umzug({
    migrations: { glob: 'src/migrations/*.js' },
    context: { sequelize, queryInterface: sequelize.queryInterface },
    storage: new SequelizeStorage({ sequelize }),
    logger: undefined,
  });
  const pendentes = await umzug.pending();
  if (pendentes.length > 0) {
    await umzug.up();
    console.log(`Migracoes aplicadas: ${pendentes.length}`);
  } else {
    console.log('Banco de dados atualizado');
  }
}

async function iniciar() {
  try {
    await rodarMigracoes();
    await seedarBanco();
    server.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
  } catch (error) {
    console.error('Erro ao iniciar:', error);
  }
}

iniciar();
