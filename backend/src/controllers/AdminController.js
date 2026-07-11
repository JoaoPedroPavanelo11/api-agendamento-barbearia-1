const { Appointment, User, Barber, Service, Notification } = require('../models');
const validate = require('../helpers/validate');

exports.agendamentosDoDia = async (req, res) => {
  try {
    const hoje = new Date().toISOString().split('T')[0];

    const agendamentos = await Appointment.findAll({
      where: { data: hoje },
      include: [
        { model: User, as: 'cliente', attributes: ['id', 'nome'] },
        { model: Barber, as: 'barbeiro', attributes: ['id', 'nome'] },
        { model: Service, as: 'servico', attributes: ['id', 'nome'] },
      ],
      order: [['hora', 'ASC']],
    });

    const resultado = agendamentos.map(a => ({
      id: a.id,
      cliente: a.cliente?.nome || 'N/A',
      horario: a.hora,
      barbeiro: a.barbeiro?.nome || 'N/A',
      servico: a.servico?.nome || 'N/A',
      status: a.status,
    }));

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar agendamentos do dia' });
  }
};

exports.faturamentoDiario = async (req, res) => {
  try {
    const hoje = new Date().toISOString().split('T')[0];

    const agendamentos = await Appointment.findAll({
      where: { data: hoje, status: 'concluido' },
      include: [
        { model: Service, as: 'servico', attributes: ['id', 'nome', 'preco'] },
        { model: Barber, as: 'barbeiro', attributes: ['id', 'nome'] },
      ],
    });

    let totalBruto = 0;
    const itens = agendamentos.map(a => {
      const valor = Number(a.servico?.preco) || 0;
      totalBruto += valor;
      return {
        id: a.id,
        horario: a.hora,
        barbeiro: a.barbeiro?.nome || 'N/A',
        servico: a.servico?.nome || 'N/A',
        valor,
        dono: (valor * 0.85).toFixed(2),
        barbeiroParte: (valor * 0.15).toFixed(2),
      };
    });

    res.json({
      data: hoje,
      totalBruto: totalBruto.toFixed(2),
      totalDono: (totalBruto * 0.85).toFixed(2),
      totalBarbeiro: (totalBruto * 0.15).toFixed(2),
      porcentagemDono: '85%',
      porcentagemBarbeiro: '15%',
      itens,
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao calcular faturamento do dia' });
  }
};

exports.excluirAgendamento = async (req, res) => {
  try {
    const erroId = validate.idValido(req.params.id);
    if (erroId) return res.status(400).json({ erro: erroId });

    const agendamento = await Appointment.findByPk(req.params.id);
    if (!agendamento) {
      return res.status(404).json({ erro: 'Agendamento nao encontrado' });
    }
    await agendamento.destroy();
    res.json({ mensagem: 'Agendamento excluido com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir agendamento' });
  }
};

exports.listarNotificacoes = async (req, res) => {
  try {
    const notificacoes = await Notification.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    res.json(notificacoes);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar notificacoes' });
  }
};

exports.marcarNotificacaoLida = async (req, res) => {
  try {
    const erroId = validate.idValido(req.params.id);
    if (erroId) return res.status(400).json({ erro: erroId });

    const notificacao = await Notification.findByPk(req.params.id);
    if (!notificacao) {
      return res.status(404).json({ erro: 'Notificacao nao encontrada' });
    }
    await notificacao.update({ lida: true });
    res.json(notificacao);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao marcar notificacao' });
  }
};

exports.marcarTodasLidas = async (req, res) => {
  try {
    await Notification.update({ lida: true }, { where: { lida: false } });
    res.json({ mensagem: 'Todas as notificacoes marcadas como lidas' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao marcar notificacoes' });
  }
};
