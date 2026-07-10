/**
 * Middleware de autenticacao via JWT.
 * Extrai o token do header Authorization, verifica sua validez e
 * insere os dados do usuario decodificado em req.usuario.
 *
 * @module middlewares/auth
 */

const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET nao definido nas variaveis de ambiente');
  process.exit(1);
}

/**
 * Middleware que verifica se o token JWT foi fornecido e eh valido.
 * Espera o token no formato "Bearer <token>" no header Authorization.
 *
 * @param {Object} req - Objeto de request do Express
 * @param {Object} res - Objeto de response do Express
 * @param {Function} next - Funcao next do Express
 * @returns {void}
 * @throws {401} Se o token nao for fornecido ou for invalido
 */
function autenticar(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ erro: 'Token nao fornecido' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ erro: 'Token invalido' });
  }
}

/**
 * Middleware que restringe o acesso apenas a usuarios com role 'admin'.
 * Deve ser usado apos o middleware autenticar.
 *
 * @param {Object} req - Objeto de request do Express (req.usuario deve estar preenchido)
 * @param {Object} res - Objeto de response do Express
 * @param {Function} next - Funcao next do Express
 * @returns {void}
 * @throws {403} Se o usuario nao for administrador
 */
function adminOnly(req, res, next) {
  if (req.usuario.role !== 'admin') {
    return res.status(403).json({ erro: 'Acesso restrito ao administrador' });
  }
  next();
}

module.exports = { autenticar, adminOnly };
