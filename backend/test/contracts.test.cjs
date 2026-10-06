const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { buildASTSchema, parse, validate } = require('graphql');
const schema = buildASTSchema(require('../src/graphql/typeDefs'));
const templates = {};
for (const file of ['queries.js', 'mutations.js']) {
  const source = readFileSync(path.resolve(__dirname, '../../frontend/src/graphql', file), 'utf8');
  for (const match of source.matchAll(/export const (\w+) = gql`([^`]+)`;/g))
    templates[match[1]] = match[2];
}
const expand = (raw) =>
  raw.replace(/\$\{(\w+)\}/g, (_, key) => {
    assert(templates[key], `Fragmento ausente: ${key}`);
    return expand(templates[key]);
  });
for (const [name, raw] of Object.entries(templates)) {
  if (raw.trimStart().startsWith('fragment')) continue;
  test(`${name} é compatível com o schema do backend`, () => {
    const document = parse(expand(raw));
    document.definitions = [
      ...new Map(document.definitions.map((d) => [d.name?.value, d])).values(),
    ];
    assert.deepEqual(
      validate(schema, document).map((e) => e.message),
      [],
    );
  });
}
