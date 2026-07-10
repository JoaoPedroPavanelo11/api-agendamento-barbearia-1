const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { User, Barber, Service } = require('../models');
const { autenticar, adminOnly } = require('../middlewares/auth');

const router = Router();

async function executarSeed(req, res) {
  try {
    const adminExiste = await User.findOne({ where: { email: 'admin@barbearia.com' } });
    if (adminExiste) return res.json({ mensagem: 'Banco ja possui dados' });

    const senhaHash = await bcrypt.hash('admin123', 10);
    await User.create({
      nome: 'Administrador',
      email: 'admin@barbearia.com',
      senha: senhaHash,
      role: 'admin',
      telefone: '(11) 99999-0000',
    });

    await Barber.bulkCreate([
      { nome: 'Carlos Silva', foto: '', dias_trabalho: '1,2,3,4,5,6', hora_inicio: '08:00', hora_fim: '18:00' },
      { nome: 'Rafael Oliveira', foto: '', dias_trabalho: '2,3,4,5,6', hora_inicio: '09:00', hora_fim: '19:00' },
    ]);

    await Service.bulkCreate([
      { nome: 'Corte Social', descricao: 'Corte classico com tesoura e maquina', preco: 45, duracao: 40 },
      { nome: 'Corte Degrade', descricao: 'Corte degradê moderno', preco: 55, duracao: 50 },
      { nome: 'Barba', descricao: 'Aparar e modelar a barba', preco: 30, duracao: 25 },
      { nome: 'Corte + Barba', descricao: 'Combo corte social + barba', preco: 65, duracao: 60 },
      { nome: 'Hidratacao', descricao: 'Hidratacao capilar', preco: 40, duracao: 30 },
    ]);

    res.json({ mensagem: 'Dados iniciais criados com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar dados iniciais' });
  }
}

router.post('/seed', async (req, res) => {
  const adminExiste = await User.findOne({ where: { email: 'admin@barbearia.com' } });
  if (adminExiste) {
    return autenticar(req, res, () => adminOnly(req, res, () => executarSeed(req, res)));
  }
  return executarSeed(req, res);
});

module.exports = router;