const { GraphQLScalarType, GraphQLError, valueFromASTUntyped } = require('graphql');

const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  serialize(value) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) throw new GraphQLError('Data inválida.');
    return date.toISOString();
  },
});

const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral: (node, variables) => valueFromASTUntyped(node, variables),
});

module.exports = { DateTime, JSON: JSONScalar };
