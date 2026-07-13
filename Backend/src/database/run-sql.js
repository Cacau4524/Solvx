/**
 * Uso: node src/database/run-sql.js database/schema.sql
 * Executa um arquivo .sql inteiro contra o banco configurado no .env.
 * Usado pelos scripts `npm run db:create` e `npm run db:seed`.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function main() {
  const relativePath = process.argv[2];
  if (!relativePath) {
    console.error('Uso: node src/database/run-sql.js caminho/para/arquivo.sql');
    process.exit(1);
  }

  const sqlPath = path.join(__dirname, '..', '..', relativePath);
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });

  console.log(`Executando ${relativePath}...`);
  await connection.query(sql);
  console.log('Concluído com sucesso.');

  await connection.end();
}

main().catch((err) => {
  console.error('Erro ao executar o script SQL:', err.message);
  process.exit(1);
});
