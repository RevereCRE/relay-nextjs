module.exports = {
  src: './src',
  schema: './data/schema.graphql',
  exclude: ['**/node_modules/**', '**/__generated__/**'],
  language: 'typescript',
  artifactDirectory: 'src/queries/__generated__',
};
