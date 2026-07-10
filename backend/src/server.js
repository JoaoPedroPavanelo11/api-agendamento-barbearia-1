/**
 * Arquivo principal do servidor da aplicacao.
 * Configura o Express, middlewares, rotas e inicializa o servidor.
 *
 * @module server
 */

const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');
const { autenticar } = require('./middlewares/auth');

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const barberRoutes = require('./routes/barbers');
const appointmentRoutes = require('./routes/appointments');
const userRoutes = require('./routes/users');
const clienteRoutes = require('./routes/cliente');
const seedRoutes = require('./routes/seed');

/** Instancia do servidor Express */
const app = express();
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
async function iniciar() {
  try {
    await sequelize.sync();
    console.log('Banco de dados sincronizado');
    app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
  } catch (error) {
    console.error('Erro ao iniciar:', error);
  }
}

iniciar();
