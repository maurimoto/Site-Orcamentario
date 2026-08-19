-- Adicionar campo password para autenticação com email/senha
ALTER TABLE users ADD COLUMN password TEXT;

-- Inserir usuários de teste com senhas (demo123)
-- Hash SHA-256 de "demo123": c1c224b03cd9bc7b6a86d77f5dace40191766c485cd55dc48caf9ac873335d6f
INSERT INTO users (email, name, password, cpf, phone, is_admin, is_active) VALUES
('cliente@steelframe.com', 'Cliente Demo', 'c1c224b03cd9bc7b6a86d77f5dace40191766c485cd55dc48caf9ac873335d6f', '12345678900', '(11) 99999-9999', 0, 1),
('admin@steelframe.com', 'Administrador', 'c1c224b03cd9bc7b6a86d77f5dace40191766c485cd55dc48caf9ac873335d6f', '98765432100', '(11) 88888-8888', 1, 1)
ON CONFLICT(email) DO UPDATE SET 
  password = excluded.password,
  cpf = excluded.cpf,
  phone = excluded.phone;

-- Criar assinatura de teste para o cliente demo (plano profissional)
INSERT INTO user_subscriptions (user_id, plan_id, status, billing_period, start_date, is_active)
SELECT id, 2, 'active', 'monthly', DATE('now'), 1
FROM users WHERE email = 'cliente@steelframe.com'
ON CONFLICT DO NOTHING;
