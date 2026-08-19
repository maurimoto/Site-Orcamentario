
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  is_admin BOOLEAN DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_admin ON users(is_admin);

CREATE TABLE subscription_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly REAL NOT NULL,
  price_quarterly REAL,
  price_yearly REAL,
  max_quotes_per_month INTEGER,
  features TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  plan_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  billing_period TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  next_billing_date DATE,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON user_subscriptions(status);

CREATE TABLE quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  project_type TEXT NOT NULL,
  square_meters REAL NOT NULL,
  floors INTEGER NOT NULL,
  finish_type TEXT NOT NULL,
  location TEXT NOT NULL,
  estimated_value REAL NOT NULL,
  calculation_details TEXT,
  status TEXT DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quotes_user_id ON quotes(user_id);
CREATE INDEX idx_quotes_status ON quotes(status);

CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subscription_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  payment_method TEXT,
  payment_status TEXT NOT NULL,
  payment_date DATE,
  transaction_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(payment_status);

CREATE TABLE calculation_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  base_value REAL,
  multiplier REAL,
  conditions TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO subscription_plans (name, description, price_monthly, price_quarterly, price_yearly, max_quotes_per_month, features) VALUES
('Básico', 'Ideal para profissionais iniciantes', 97.00, 261.00, 970.00, 20, 'Até 20 orçamentos/mês|Geração automática de orçamentos|Histórico de projetos|Suporte por email'),
('Profissional', 'Para profissionais estabelecidos', 197.00, 531.00, 1970.00, -1, 'Orçamentos ilimitados|Relatórios personalizados|Suporte prioritário|API de integração|Tudo do plano Básico'),
('Empresarial', 'Para empresas e equipes', 497.00, 1341.00, 4970.00, -1, 'Múltiplos usuários|Customização avançada|Consultoria dedicada|SLA garantido|Tudo do plano Profissional');

INSERT INTO calculation_rules (rule_name, rule_type, base_value, multiplier, conditions) VALUES
('Custo Base por M²', 'base_cost', 1200.00, 1.0, '{"project_type": "all"}'),
('Multiplicador - Residencial', 'project_multiplier', 0, 1.0, '{"project_type": "residencial"}'),
('Multiplicador - Comercial', 'project_multiplier', 0, 1.2, '{"project_type": "comercial"}'),
('Multiplicador - Industrial', 'project_multiplier', 0, 0.9, '{"project_type": "industrial"}'),
('Multiplicador - Acabamento Básico', 'finish_multiplier', 0, 0.85, '{"finish_type": "basico"}'),
('Multiplicador - Acabamento Padrão', 'finish_multiplier', 0, 1.0, '{"finish_type": "padrao"}'),
('Multiplicador - Acabamento Premium', 'finish_multiplier', 0, 1.35, '{"finish_type": "premium"}'),
('Custo Adicional por Pavimento', 'floor_cost', 150.00, 1.0, '{"applies_to": "additional_floors"}');
