import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.get("/me", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ error: "Token não fornecido" }, 401);
    }

    const token = authHeader.substring(7);
    
    const user = await c.env.DATABASE.prepare(
      "SELECT id, email, name FROM users WHERE id = ?"
    ).bind(token).first();

    if (!user) {
      return c.json({ error: "Usuário não encontrado" }, 404);
    }

    const subscription = await c.env.DATABASE.prepare(`
      SELECT 
        s.id,
        s.user_id,
        s.plan_type,
        s.status,
        s.start_date,
        s.end_date,
        s.next_billing_date,
        p.name as plan_name,
        p.price,
        p.quotes_limit,
        COUNT(q.id) as quotes_used
      FROM subscriptions s
      LEFT JOIN plans p ON s.plan_type = p.id
      LEFT JOIN quotes q ON q.user_id = s.user_id 
        AND strftime('%Y-%m', q.created_at) = strftime('%Y-%m', 'now')
      WHERE s.user_id = ? AND s.status IN ('trial', 'active')
      GROUP BY s.id
      ORDER BY s.created_at DESC
      LIMIT 1
    `).bind(user.id).first();

    if (!subscription) {
      return c.json({ error: "Assinatura não encontrada" }, 404);
    }

    return c.json({
      plan: subscription.plan_name,
      status: subscription.status,
      quotesUsed: subscription.quotes_used || 0,
      quotesLimit: subscription.quotes_limit,
      startDate: subscription.start_date,
      endDate: subscription.end_date,
      nextBillingDate: subscription.next_billing_date,
      price: subscription.price
    });
  } catch (error) {
    console.error("Erro ao buscar assinatura:", error);
    return c.json({ error: "Erro interno do servidor" }, 500);
  }
});

export default app;
