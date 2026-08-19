-- Adicionar campos CPF e remover campo phone caso não exista
ALTER TABLE users ADD COLUMN cpf TEXT;

-- Criar índice único para CPF
CREATE UNIQUE INDEX idx_users_cpf ON users(cpf) WHERE cpf IS NOT NULL;
