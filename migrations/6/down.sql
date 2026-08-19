
DROP INDEX idx_payments_status;
DROP INDEX idx_payments_user_id;
DROP TABLE payments;

DROP INDEX idx_quotes_status;
DROP INDEX idx_quotes_user_id;
DROP TABLE quotes;

DROP INDEX idx_subscriptions_status;
DROP INDEX idx_subscriptions_user_id;
DROP TABLE user_subscriptions;

DROP TABLE subscription_plans;

DROP INDEX idx_users_is_admin;
DROP INDEX idx_users_email;
DROP TABLE users;

DROP TABLE calculation_rules;
