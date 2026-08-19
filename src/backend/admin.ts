import { Hono } from "hono";
import { authMiddleware } from "@getmocha/users-service/backend";
import type { Context } from "hono";

const app = new Hono<{ Bindings: Env }>();

// Admin middleware - checks if authenticated user is an admin
const adminMiddleware = async (c: Context, next: () => Promise<void>) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "Not authenticated" }, 401);
  }

  // Check if user is admin in our database
  const dbUser = await c.env.DATABASE.prepare(
    "SELECT is_admin FROM users WHERE email = ?"
  )
    .bind(user.email)
    .first();

  if (!dbUser || !dbUser.is_admin) {
    return c.json({ error: "Admin access required" }, 403);
  }

  await next();
};

// Get dashboard statistics
app.get("/api/admin/stats", authMiddleware, adminMiddleware, async (c) => {
  const totalUsers = await c.env.DATABASE.prepare(
    "SELECT COUNT(*) as count FROM users"
  ).first();

  const activeSubscriptions = await c.env.DATABASE.prepare(
    "SELECT COUNT(*) as count FROM user_subscriptions WHERE status = 'active'"
  ).first();

  const totalQuotes = await c.env.DATABASE.prepare(
    "SELECT COUNT(*) as count FROM quotes"
  ).first();

  const quotesThisMonth = await c.env.DATABASE.prepare(
    "SELECT COUNT(*) as count FROM quotes WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')"
  ).first();

  const estimatedRevenue = await c.env.DATABASE.prepare(
    `SELECT SUM(sp.price_monthly) as revenue 
     FROM user_subscriptions us 
     JOIN subscription_plans sp ON us.plan_id = sp.id 
     WHERE us.status = 'active' AND us.billing_period = 'monthly'`
  ).first();

  const recentQuotes = await c.env.DATABASE.prepare(
    `SELECT q.*, u.name as user_name, u.email as user_email 
     FROM quotes q 
     JOIN users u ON q.user_id = u.id 
     ORDER BY q.created_at DESC 
     LIMIT 10`
  ).all();

  return c.json({
    totalUsers: totalUsers?.count || 0,
    activeSubscriptions: activeSubscriptions?.count || 0,
    totalQuotes: totalQuotes?.count || 0,
    quotesThisMonth: quotesThisMonth?.count || 0,
    estimatedRevenue: estimatedRevenue?.revenue || 0,
    recentQuotes: recentQuotes.results || [],
  });
});

// Get all users
app.get("/api/admin/users", authMiddleware, adminMiddleware, async (c) => {
  const { results } = await c.env.DATABASE.prepare(
    `SELECT u.*, 
            (SELECT COUNT(*) FROM quotes WHERE user_id = u.id) as quote_count,
            (SELECT name FROM subscription_plans sp 
             JOIN user_subscriptions us ON us.plan_id = sp.id 
             WHERE us.user_id = u.id AND us.status = 'active' LIMIT 1) as current_plan
     FROM users u 
     ORDER BY u.created_at DESC`
  ).all();

  return c.json(results);
});

// Update user
app.put("/api/admin/users/:id", authMiddleware, adminMiddleware, async (c) => {
  const userId = c.req.param("id");
  const body = await c.req.json();

  await c.env.DATABASE.prepare(
    "UPDATE users SET name = ?, phone = ?, is_admin = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  )
    .bind(body.name, body.phone || null, body.is_admin ? 1 : 0, body.is_active ? 1 : 0, userId)
    .run();

  const user = await c.env.DATABASE.prepare("SELECT * FROM users WHERE id = ?")
    .bind(userId)
    .first();

  return c.json(user);
});

// Get all subscription plans
app.get("/api/admin/plans", authMiddleware, adminMiddleware, async (c) => {
  const { results } = await c.env.DATABASE.prepare(
    `SELECT sp.*, 
            (SELECT COUNT(*) FROM user_subscriptions WHERE plan_id = sp.id AND status = 'active') as active_subscriptions
     FROM subscription_plans sp 
     ORDER BY sp.price_monthly ASC`
  ).all();

  return c.json(results);
});

// Create subscription plan
app.post("/api/admin/plans", authMiddleware, adminMiddleware, async (c) => {
  const body = await c.req.json();

  const result = await c.env.DATABASE.prepare(
    `INSERT INTO subscription_plans 
     (name, description, price_monthly, price_quarterly, price_yearly, max_quotes_per_month, features, is_active) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      body.name,
      body.description || null,
      body.price_monthly,
      body.price_quarterly || null,
      body.price_yearly || null,
      body.max_quotes_per_month || null,
      body.features || null,
      body.is_active ? 1 : 0
    )
    .run();

  const plan = await c.env.DATABASE.prepare(
    "SELECT * FROM subscription_plans WHERE id = ?"
  )
    .bind(result.meta.last_row_id)
    .first();

  return c.json(plan);
});

// Update subscription plan
app.put("/api/admin/plans/:id", authMiddleware, adminMiddleware, async (c) => {
  const planId = c.req.param("id");
  const body = await c.req.json();

  await c.env.DATABASE.prepare(
    `UPDATE subscription_plans 
     SET name = ?, description = ?, price_monthly = ?, price_quarterly = ?, 
         price_yearly = ?, max_quotes_per_month = ?, features = ?, is_active = ?, 
         updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`
  )
    .bind(
      body.name,
      body.description || null,
      body.price_monthly,
      body.price_quarterly || null,
      body.price_yearly || null,
      body.max_quotes_per_month || null,
      body.features || null,
      body.is_active ? 1 : 0,
      planId
    )
    .run();

  const plan = await c.env.DATABASE.prepare(
    "SELECT * FROM subscription_plans WHERE id = ?"
  )
    .bind(planId)
    .first();

  return c.json(plan);
});

// Get all quotes
app.get("/api/admin/quotes", authMiddleware, adminMiddleware, async (c) => {
  const { results } = await c.env.DATABASE.prepare(
    `SELECT q.*, u.name as user_name, u.email as user_email 
     FROM quotes q 
     JOIN users u ON q.user_id = u.id 
     ORDER BY q.created_at DESC`
  ).all();

  return c.json(results);
});

// Get all calculation rules
app.get("/api/admin/calculation-rules", authMiddleware, adminMiddleware, async (c) => {
  const { results } = await c.env.DATABASE.prepare(
    "SELECT * FROM calculation_rules ORDER BY rule_type, rule_name"
  ).all();

  return c.json(results);
});

// Update calculation rule
app.put("/api/admin/calculation-rules/:id", authMiddleware, adminMiddleware, async (c) => {
  const ruleId = c.req.param("id");
  const body = await c.req.json();

  await c.env.DATABASE.prepare(
    `UPDATE calculation_rules 
     SET rule_name = ?, rule_type = ?, base_value = ?, multiplier = ?, 
         conditions = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`
  )
    .bind(
      body.rule_name,
      body.rule_type,
      body.base_value || null,
      body.multiplier || null,
      body.conditions || null,
      body.is_active ? 1 : 0,
      ruleId
    )
    .run();

  const rule = await c.env.DATABASE.prepare(
    "SELECT * FROM calculation_rules WHERE id = ?"
  )
    .bind(ruleId)
    .first();

  return c.json(rule);
});

export default app;
