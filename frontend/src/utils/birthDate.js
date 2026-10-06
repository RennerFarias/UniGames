export function parseBirthDate(value) {
  const text = value instanceof Date ? value.toISOString().slice(0, 10) : String(value || '');
  const date = new Date(text + 'T00:00:00.000Z');

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(text) ||
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== text ||
    date > new Date()
  ) {
    throw new Error('Informe uma data de nascimento válida no formato AAAA-MM-DD.');
  }
  return date;
}

export function ageOnDate(value, today = new Date()) {
  const birth = parseBirthDate(value);
  let age = today.getFullYear() - birth.getUTCFullYear();
  const month = today.getMonth() - birth.getUTCMonth();
  if (month < 0 || (month === 0 && today.getDate() < birth.getUTCDate())) age--;
  return age;
}
