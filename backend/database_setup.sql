-- Script de configuração do banco de dados BodySport
-- Execute este script no seu banco PostgreSQL/Neon

-- Tabela de usuários (com suporte a hash de senhas)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,  -- Armazenará hash bcrypt
    nome VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de orçamentos
CREATE TABLE IF NOT EXISTS orcamentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_orcamentos_email ON orcamentos(email);
CREATE INDEX IF NOT EXISTS idx_orcamentos_status ON orcamentos(status);
CREATE INDEX IF NOT EXISTS idx_orcamentos_criado_em ON orcamentos(criado_em DESC);

-- Tabela para modelos 3D (preparação futura)
CREATE TABLE IF NOT EXISTS modelos_3d (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    arquivo_url VARCHAR(500),
    formato VARCHAR(50),  -- gltf, glb, obj, fbx
    tamanho_kb INTEGER,
    carro_modelo VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para bodykits (preparação futura)
CREATE TABLE IF NOT EXISTS bodykits (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    modelo_carro VARCHAR(255) NOT NULL,
    preco DECIMAL(10, 2),
    modelo_3d_id INTEGER REFERENCES modelos_3d(id),
    imagem_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'ativo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para bodykits
CREATE INDEX IF NOT EXISTS idx_bodykits_modelo_carro ON bodykits(modelo_carro);
CREATE INDEX IF NOT EXISTS idx_bodykits_status ON bodykits(status);

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orcamentos_updated_at BEFORE UPDATE ON orcamentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários nas tabelas
COMMENT ON TABLE usuarios IS 'Tabela de usuários do sistema';
COMMENT ON TABLE orcamentos IS 'Tabela de solicitações de orçamento';
COMMENT ON TABLE modelos_3d IS 'Tabela de modelos 3D para visualização';
COMMENT ON TABLE bodykits IS 'Tabela de bodykits disponíveis';

