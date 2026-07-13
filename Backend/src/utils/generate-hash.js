/**
 * Uso: node src/utils/generate-hash.js "MinhaSenha123!"
 * Imprime um hash bcrypt válido para colar manualmente num INSERT de teste.
 */
const bcrypt = require('bcrypt');

const senha = process.argv[2];

if (!senha) {
  console.error('Uso: node src/utils/generate-hash.js "SuaSenha"');
  process.exit(1);
}

bcrypt.hash(senha, 10).then((hash) => {
  console.log(hash);
});
