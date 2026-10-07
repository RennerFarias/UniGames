const { GraphQLError } = require('graphql');

function birthDate(value) {
  if (value == null || value === '') return undefined;

  if (value instanceof Date && Number.isNaN(value.getTime())) {
    throw invalidBirthDate();
  }

  const text = value instanceof Date ? value.toISOString().slice(0, 10) : String(value);
  const date = new Date(text + 'T00:00:00.000Z');

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(text) ||
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== text ||
    date > new Date()
  ) {
    throw invalidBirthDate();
  }

  return date;
}

function invalidBirthDate() {
  return new GraphQLError('Informe uma data de nascimento válida no formato AAAA-MM-DD.', {
    extensions: { code: 'BAD_USER_INPUT' },
  });
}

function calcularIdade(value, hoje = new Date()) {
  const nascimento = birthDate(value);
  if (!nascimento) return null;

  let idade = hoje.getFullYear() - nascimento.getUTCFullYear();
  const mes = hoje.getMonth() - nascimento.getUTCMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getUTCDate())) idade--;
  return idade;
}

module.exports = { birthDate, calcularIdade };
