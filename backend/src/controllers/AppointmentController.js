/**
 * Controlador responsavel pelas operacoes de agendamento:
 * listar, criar, atualizar status, cancelar, deletar e consultar horarios ocupados.
 *
 * @module controllers/AppointmentController
 */

const { Appointment, User, Barber, Service } = require('../models');

/**
 * Lista todos os agendamentos (acesso admin).
 * Suporta filtros opcionais por data, status e barbeiroId.
 *
 * @async
 * @function listar
 * @param {Object} req - Request do Express
 * @param {Object} req.query - Parametros de consulta
 * @param {string} [req.query.data] - Filtrar por data (YYYY-MM-DD)
 * @param {string} [req.query.status] - Filtrar por status
 * @param {number} [req.query.barbeiroId] - Filtrar por ID do barbeiro
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Lista de agendamentos com dados do cliente, barbeiro e servico
 */
exports.listar = async (req, res) => {
  const { data, status, barbeiroId } = req.query;
  const filtro = {};
  if (data) filtro.data = data;
  if (status) filtro.status = status;
  if (barbeiroId) filtro.barbeiroId = barbeiroId;

  const agendamentos = await Appointment.findAll({
    where: filtro,
    include: [
      { model: User, as: 'cliente', attributes: ['id', 'nome', 'telefone'] },
      { model: Barber, as: 'barbeiro', attributes: ['id', 'nome'] },
      { model: Service, as: 'servico', attributes: ['id', 'nome', 'preco', 'duracao'] },
    ],
    order: [['data', 'ASC'], ['hora', 'ASC']],
  });

  res.json(agendamentos);
};

/**
 * Lista os agendamentos do usuario logado.
 *
 * @async
 * @function meusAgendamentos
 * @param {Object} req - Request do Express (req.usuario contem o id)
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Lista de agendamentos do cliente
 */
exports.meusAgendamentos = async (req, res) => {
  const agendamentos = await Appointment.findAll({
    where: { clienteId: req.usuario.id },
    include: [
      { model: Barber, as: 'barbeiro', attributes: ['id', 'nome'] },
      { model: Service, as: 'servico', attributes: ['id', 'nome', 'preco', 'duracao'] },
    ],
    order: [['data', 'DESC'], ['hora', 'DESC']],
  });

  res.json(agendamentos);
};

/**
 * Cria um novo agendamento.
 * Verifica se ja existe conflito de horario com o mesmo barbeiro.
 *
 * @async
 * @function criar
 * @param {Object} req - Request do Express
 * @param {Object} req.body - Corpo da requisicao
 * @param {string} req.body.data - Data do agendamento (YYYY-MM-DD)
 * @param {string} req.body.hora - Horario do agendamento (HH:mm)
 * @param {number} req.body.barbeiroId - ID do barbeiro
 * @param {number} req.body.servicoId - ID do servico
 * @param {string} [req.body.observacao] - Observacao opcional
 * @param {Object} res - Response do Express
 * @returns {Object} 201 - Agendamento criado com dados completos
 * @returns {Object} 400 - Horario ja agendado para este barbeiro
 * @throws {Object} 400 - Erro ao criar agendamento
 */
exports.criar = async (req, res) => {
  try {
    const { data, hora, barbeiroId, servicoId, observacao } = req.body;

    const servico = await Service.findByPk(servicoId);
    if (!servico) return res.status(400).json({ erro: 'Servico nao encontrado' });

    const barbeiro = await Barber.findByPk(barbeiroId);
    if (!barbeiro) return res.status(400).json({ erro: 'Barbeiro nao encontrado' });

    const conflitos = await Appointment.findAll({
      where: { data, barbeiroId, status: ['pendente', 'confirmado'] },
      include: [{ model: Service, as: 'servico', attributes: ['duracao'] }],
    });

    const [hHora, mHora] = hora.split(':').map(Number);
    const novoInicio = hHora * 60 + mHora;
    const novoFim = novoInicio + servico.duracao;

    for (const c of conflitos) {
      const [hC, mC] = c.hora.split(':').map(Number);
      const inicioC = hC * 60 + mC;
      const fimC = inicioC + (c.servico ? c.servico.duracao : 30);
      if (novoInicio < fimC && novoFim > inicioC) {
        return res.status(400).json({ erro: 'Horario conflita com outro agendamento' });
      }
    }

    const agendamento = await Appointment.create({
      data,
      hora,
      barbeiroId,
      servicoId,
      observacao,
      clienteId: req.usuario.id,
    });

    const completo = await Appointment.findByPk(agendamento.id, {
      include: [
        { model: Barber, as: 'barbeiro', attributes: ['id', 'nome'] },
        { model: Service, as: 'servico', attributes: ['id', 'nome', 'preco', 'duracao'] },
      ],
    });

    res.status(201).json(completo);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao agendar' });
  }
};

/**
 * Atualiza o status de um agendamento (admin).
 *
 * @async
 * @function atualizarStatus
 * @param {Object} req - Request do Express
 * @param {Object} req.params - Parametros da rota
 * @param {number} req.params.id - ID do agendamento
 * @param {Object} req.body - Corpo da requisicao
 * @param {string} req.body.status - Novo status (pendente, confirmado, cancelado, concluido)
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Agendamento atualizado
 * @returns {Object} 404 - Agendamento nao encontrado
 * @throws {Object} 400 - Erro ao atualizar status
 */
exports.atualizarStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const agendamento = await Appointment.findByPk(req.params.id);
    if (!agendamento) return res.status(404).json({ erro: 'Agendamento nao encontrado' });
    await agendamento.update({ status });
    res.json(agendamento);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao atualizar status' });
  }
};

/**
 * Cancela um agendamento.
 * O proprio cliente ou um admin pode cancelar.
 *
 * @async
 * @function cancelar
 * @param {Object} req - Request do Express
 * @param {Object} req.params - Parametros da rota
 * @param {number} req.params.id - ID do agendamento
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Mensagem de confirmacao do cancelamento
 * @returns {Object} 404 - Agendamento nao encontrado
 * @returns {Object} 403 - Usuario nao autorizado a cancelar
 * @throws {Object} 400 - Erro ao cancelar
 */
exports.cancelar = async (req, res) => {
  try {
    const agendamento = await Appointment.findByPk(req.params.id);
    if (!agendamento) return res.status(404).json({ erro: 'Agendamento nao encontrado' });

    if (Number(agendamento.clienteId) !== Number(req.usuario.id) && req.usuario.role !== 'admin') {
      return res.status(403).json({ erro: 'Voce nao pode cancelar este agendamento' });
    }

    await agendamento.update({ status: 'cancelado' });
    res.json({ mensagem: 'Agendamento cancelado' });
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao cancelar' });
  }
};

/**
 * Deleta permanentemente um agendamento (admin).
 *
 * @async
 * @function deletar
 * @param {Object} req - Request do Express
 * @param {Object} req.params - Parametros da rota
 * @param {number} req.params.id - ID do agendamento
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Mensagem de confirmacao da remocao
 * @returns {Object} 404 - Agendamento nao encontrado
 */
exports.deletar = async (req, res) => {
  const agendamento = await Appointment.findByPk(req.params.id);
  if (!agendamento) return res.status(404).json({ erro: 'Agendamento nao encontrado' });
  await agendamento.destroy();
  res.json({ mensagem: 'Agendamento removido' });
};

/**
 * Retorna os horarios ocupados (agendamentos pendentes/confirmados)
 * de um barbeiro em uma data especifica.
 * Rota publica (nao requer autenticacao).
 *
 * @async
 * @function horariosOcupados
 * @param {Object} req - Request do Express
 * @param {Object} req.query - Parametros de consulta
 * @param {string} req.query.data - Data para consulta (YYYY-MM-DD)
 * @param {number} req.query.barbeiroId - ID do barbeiro
 * @param {Object} res - Response do Express
 * @returns {Object} 200 - Lista de horarios ocupados (apenas strings HH:mm)
 * @returns {Object} 400 - Parametros obrigatorios nao fornecidos
 * @throws {Object} 500 - Erro ao buscar horarios
 */
exports.horariosOcupados = async (req, res) => {
  try {
    const { data, barbeiroId } = req.query;
    if (!data || !barbeiroId) {
      return res.status(400).json({ erro: 'Parametros data e barbeiroId sao obrigatorios' });
    }
    const agendamentos = await Appointment.findAll({
      where: { data, barbeiroId, status: ['pendente', 'confirmado'] },
      attributes: ['hora'],
    });
    res.json(agendamentos.map(a => a.hora));
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar horarios' });
  }
};
