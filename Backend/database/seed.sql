-- =========================================================
-- Solvy — dados iniciais (seed)
-- =========================================================
USE solvy;

INSERT INTO categories (nome, icone) VALUES
  ('Eletricista', 'bolt'),
  ('Encanador', 'drop'),
  ('Pintor', 'brush'),
  ('Faxineira', 'sparkle'),
  ('Diarista', 'sparkle'),
  ('Jardineiro', 'leaf'),
  ('Pedreiro', 'house'),
  ('Marceneiro', 'hammer'),
  ('Técnico em Informática', 'cpu'),
  ('Montador de móveis', 'tool'),
  ('Outros', 'dots')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

-- Observação: não incluímos usuários de teste aqui de propósito, porque a
-- senha precisa ser um hash bcrypt real (não dá pra "inventar" um hash
-- válido sem rodar bcrypt de verdade). Para criar um usuário de teste:
--
--   1) Suba o backend (npm run dev) e use o Postman/Insomnia/curl para
--      chamar POST /api/auth/register normalmente, OU
--   2) Rode `node src/utils/generate-hash.js "SuaSenha123!"` pra gerar um
--      hash bcrypt válido e cole manualmente num INSERT INTO users.
