function campoObrigatorio(valor, nome) {
  if (valor === undefined || valor === null || (typeof valor === 'string' && valor.trim() === '')) {
    return `${nome} é obrigatório`;
  }
  return null;
}

function stringValida(valor, nome, min = 2, max = 100) {
  if (typeof valor !== 'string' || valor.trim().length < min) {
    return `${nome} deve ter no mínimo ${min} caracteres`;
  }
  if (valor.trim().length > max) {
    return `${nome} deve ter no máximo ${max} caracteres`;
  }
  return null;
}

function emailValido(email) {
  if (!email || typeof email !== 'string') return 'Email inválido';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email inválido';
  return null;
}

function valorPositivo(valor, nome) {
  const num = Number(valor);
  if (isNaN(num) || num <= 0) return `${nome} deve ser um valor positivo`;
  return null;
}

function inteiroPositivo(valor, nome) {
  const num = Number(valor);
  if (isNaN(num) || !Number.isInteger(num) || num <= 0) return `${nome} deve ser um número inteiro positivo`;
  return null;
}

function statusValido(status) {
  const statusValidos = ['pendente', 'confirmado', 'cancelado', 'concluido'];
  if (!statusValidos.includes(status)) return `Status inválido. Valores: ${statusValidos.join(', ')}`;
  return null;
}

function idValido(id) {
  const num = Number(id);
  if (isNaN(num) || !Number.isInteger(num) || num <= 0) return 'ID inválido';
  return null;
}

function validar(validacoes) {
  for (const { fn, args } of validacoes) {
    const erro = fn(...args);
    if (erro) return erro;
  }
  return null;
}

module.exports = {
  campoObrigatorio,
  stringValida,
  emailValido,
  valorPositivo,
  inteiroPositivo,
  statusValido,
  idValido,
  validar,
};
