-- Tabela para armazenar informações de cartões (apenas últimos 4 dígitos e dados básicos)
CREATE TABLE payment_methods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  card_last_four TEXT NOT NULL,
  card_brand TEXT,
  card_holder_name TEXT NOT NULL,
  card_expiry TEXT NOT NULL,
  is_default BOOLEAN DEFAULT 1,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);

-- Tabela para histórico de mudanças de plano
CREATE TABLE subscription_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subscription_id INTEGER NOT NULL,
  old_plan_id INTEGER,
  new_plan_id INTEGER NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  change_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(id)
);

CREATE INDEX idx_subscription_history_user_id ON subscription_history(user_id);
CREATE INDEX idx_subscription_history_subscription_id ON subscription_history(subscription_id);

-- Adicionar campo para rastrear quando o trial termina
ALTER TABLE user_subscriptions ADD COLUMN trial_ends_at DATE;

-- Atualizar assinaturas existentes com trial_ends_at
UPDATE user_subscriptions 
SET trial_ends_at = end_date 
WHERE status = 'trial' AND end_date IS NOT NULL;
