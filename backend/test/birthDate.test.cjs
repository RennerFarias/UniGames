const { test } = require('node:test');
const assert = require('node:assert/strict');
const { birthDate, calcularIdade } = require('../src/utils/birthDate');

test('datas inválidas e futuras não permitem ativar um revendedor', () => {
  for (const value of ['invalida', '2000-02-30', '2099-01-01', new Date('invalida')]) {
    assert.throws(
      () => birthDate(value),
      (error) => error.extensions?.code === 'BAD_USER_INPUT',
    );
  }
  assert.equal(birthDate(undefined), undefined);
});

test('idade aceita a data do MongoDB e muda somente no aniversário', () => {
  const nascimento = birthDate('2010-06-15');
  assert.equal(nascimento.toISOString(), '2010-06-15T00:00:00.000Z');
  assert.equal(calcularIdade(nascimento, new Date(2026, 5, 14, 12)), 15);
  assert.equal(calcularIdade(nascimento, new Date(2026, 5, 15, 12)), 16);
  assert.equal(calcularIdade('2010-06-15', new Date(2026, 5, 16, 12)), 16);
});
