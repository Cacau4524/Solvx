-- =========================================================
-- Solvy — Schema do banco de dados (MySQL 8+)
-- =========================================================
CREATE DATABASE IF NOT EXISTS solvy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE solvy;

-- ---------------------------------------------------------
-- users: tabela base de autenticação (cliente ou prestador)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_completo VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  cpf VARCHAR(14) UNIQUE,
  role ENUM('cliente', 'prestador', 'admin') NOT NULL DEFAULT 'cliente',
  data_nascimento DATE,
  genero ENUM('masculino', 'feminino', 'nao_informar', 'outro'),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- clients: dados específicos do cliente (1:1 com users)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  cep VARCHAR(9),
  rua VARCHAR(150),
  numero VARCHAR(10),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado CHAR(2),
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- providers: dados específicos do prestador (1:1 com users)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS providers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  rg VARCHAR(20),
  cep VARCHAR(9),
  rua VARCHAR(150),
  numero VARCHAR(10),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado CHAR(2),
  categoria_principal VARCHAR(100),
  especialidades TEXT,
  descricao TEXT,
  experiencia VARCHAR(100),
  preco_medio DECIMAL(10,2),
  cidade_atuacao VARCHAR(100),
  raio_atendimento INT,
  foto_perfil_url VARCHAR(255),
  foto_documento_url VARCHAR(255),
  curriculo_url VARCHAR(255),
  status ENUM('EM_ANALISE', 'APROVADO', 'REPROVADO') NOT NULL DEFAULT 'EM_ANALISE',
  motivo_reprovacao TEXT,
  cpf_validado BOOLEAN NOT NULL DEFAULT FALSE,
  documento_validado BOOLEAN NOT NULL DEFAULT FALSE,
  antecedentes_verificados BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_providers_status (status),
  INDEX idx_providers_categoria (categoria_principal)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- categories: categorias de serviço
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  icone VARCHAR(50)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- services: catálogo de serviços oferecidos por um prestador
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider_id INT NOT NULL,
  category_id INT,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_services_provider (provider_id),
  INDEX idx_services_category (category_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- orders: solicitações de serviço (pedido de um cliente)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  provider_id INT,
  category_id INT,
  descricao TEXT NOT NULL,
  cep VARCHAR(9),
  rua VARCHAR(150),
  numero VARCHAR(10),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado CHAR(2),
  status ENUM('AGUARDANDO_ORCAMENTO','ACEITA','RECUSADA','EM_ANDAMENTO','CONCLUIDA','CANCELADA')
    NOT NULL DEFAULT 'AGUARDANDO_ORCAMENTO',
  valor_orcado DECIMAL(10,2),
  data_preferida DATE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_orders_client (client_id),
  INDEX idx_orders_provider (provider_id),
  INDEX idx_orders_status (status)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- reviews: avaliação do cliente sobre o serviço concluído
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL UNIQUE,
  client_id INT NOT NULL,
  provider_id INT NOT NULL,
  nota TINYINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT,
  resposta_prestador TEXT,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
  INDEX idx_reviews_provider (provider_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- notifications: notificações do usuário
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN NOT NULL DEFAULT FALSE,
  link VARCHAR(255),
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notifications_user (user_id, lida)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- uploads: arquivos enviados (fotos, documentos, currículo)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS uploads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tipo ENUM('foto_perfil', 'foto_documento', 'curriculo', 'foto_servico') NOT NULL,
  url VARCHAR(255) NOT NULL,
  nome_original VARCHAR(255),
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_uploads_user (user_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- refresh_tokens: sessões ativas (permite logout/revogação)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  expira_em TIMESTAMP NOT NULL,
  revogado BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_refresh_tokens_user (user_id)
) ENGINE=InnoDB;
