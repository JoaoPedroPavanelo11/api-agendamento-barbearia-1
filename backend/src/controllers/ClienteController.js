/**
 * Controlador responsavel pelas operacoes do lado do cliente:
 * consultar agendamentos, cancelar, ver dados da propria conta.
 *
 * @module controllers/ClienteController
 */

const { Appointment, Barber, Service, User } = require('../models');
const validate = require('../helpers/validate');

/**
 * Retorna os agendamentos do cliente logado.
 * Inclui dados do barbeiro e servico.
 *
 * @async
 * @function meusAgendamentos
 * @param {Object} req - Request do Express (req.usuario.id)
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Lista de agendamentos do cliente
 */
exports.meusAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Appointment.findAll({
      where: { clienteId: req.usuario.id },
      include: [
        { model: Barber, as: 'barbeiro', attributes: ['id', 'nome'] },
        { model: Service, as: 'servico', attributes: ['id', 'nome', 'preco', 'duracao'] },
      ],
      order: [['data', 'DESC'], ['hora', 'DESC']],
    });
    res.json(agendamentos);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar agendamentos' });
  }
};

/**
 * Cancela um agendamento do proprio cliente.
 * So permite cancelar se o agendamento pertencer ao usuario logado.
 *
 * @async
 * @function cancelarAgendamento
 * @param {Object} req - Request do Express
 * @param {number} req.params.id - ID do agendamento
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Agendamento cancelado
 * @returns {Object} 404 - Agendamento nao encontrado
 * @returns {Object} 403 - Agendamento nao pertence ao usuario
 */
exports.cancelarAgendamento = async (req, res) => {
  try {
    const erroId = validate.idValido(req.params.id);
    if (erroId) return res.status(400).json({ erro: erroId });

    const agendamento = await Appointment.findByPk(req.params.id);
    if (!agendamento) return res.status(404).json({ erro: 'Agendamento nao encontrado' });

    if (Number(agendamento.clienteId) !== Number(req.usuario.id)) {
      return res.status(403).json({ erro: 'Este agendamento nao pertence a voce' });
    }

    if (agendamento.status === 'cancelado' || agendamento.status === 'concluido') {
      return res.status(400).json({ erro: `Nao e possivel cancelar um agendamento ${agendamento.status}` });
    }

    await agendamento.update({ status: 'cancelado' });
    res.json({ mensagem: 'Agendamento cancelado com sucesso' });
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao cancelar' });
  }
};

/**
 * Retorna os dados do perfil do cliente logado.
 *
 * @async
 * @function meusDados
 * @param {Object} req - Request do Express (req.usuario.id)
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Dados do usuario (sem senha)
 */
exports.meusDados = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.usuario.id, {
      attributes: { exclude: ['senha'] },
    });
    if (!usuario) return res.status(404).json({ erro: 'Usuario nao encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar dados' });
  }
};
