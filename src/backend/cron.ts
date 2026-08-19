import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

async function checkTrialsEndingSoon(env: Env) {
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
  const twoDaysDate = twoDaysFromNow.toISOString().split('T')[0];

  const { results: subscriptions } = await env.DATABASE.prepare(`
    SELECT 
      us.*, 
      u.email, 
      u.name,
      sp.name as plan_name
    FROM user_subscriptions us
    JOIN users u ON us.user_id = u.id
    LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.status = 'trial' 
    AND us.trial_ends_at = ?
    AND us.is_active = 1
  `).bind(twoDaysDate).all();

  for (const sub of subscriptions) {
    try {
      await fetch(`${env.APP_URL}/api/emails/trial-ending`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sub.email,
          userName: sub.name,
          daysLeft: 2,
          planName: sub.plan_name || 'Teste Gratuito',
        }),
      });
      
      console.log(`Trial ending email sent to ${sub.email}`);
    } catch (error) {
      console.error(`Failed to send trial ending email to ${sub.email}:`, error);
    }
  }

  return subscriptions.length;
}

async function checkTrialsExpired(env: Env) {
  const today = new Date().toISOString().split('T')[0];

  const { results: subscriptions } = await env.DATABASE.prepare(`
    SELECT 
      us.*, 
      u.email, 
      u.name
    FROM user_subscriptions us
    JOIN users u ON us.user_id = u.id
    WHERE us.status = 'trial' 
    AND us.trial_ends_at <= ?
    AND us.is_active = 1
  `).bind(today).all();

  for (const sub of subscriptions) {
    try {
      await env.DATABASE.prepare(`
        UPDATE user_subscriptions 
        SET status = 'cancelled', is_active = 0, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).bind(sub.id).run();

      await fetch(`${env.APP_URL}/api/emails/trial-expired`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sub.email,
          userName: sub.name,
        }),
      });

      console.log(`Trial cancelled and email sent to ${sub.email}`);
    } catch (error) {
      console.error(`Failed to cancel trial for ${sub.email}:`, error);
    }
  }

  return subscriptions.length;
}

async function checkOneDayLeft(env: Env) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];

  const { results: subscriptions } = await env.DATABASE.prepare(`
    SELECT 
      us.*, 
      u.email, 
      u.name,
      sp.name as plan_name
    FROM user_subscriptions us
    JOIN users u ON us.user_id = u.id
    LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.status = 'trial' 
    AND us.trial_ends_at = ?
    AND us.is_active = 1
  `).bind(tomorrowDate).all();

  for (const sub of subscriptions) {
    try {
      await fetch(`${env.APP_URL}/api/emails/trial-ending`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sub.email,
          userName: sub.name,
          daysLeft: 1,
          planName: sub.plan_name || 'Teste Gratuito',
        }),
      });
      
      console.log(`1 day left email sent to ${sub.email}`);
    } catch (error) {
      console.error(`Failed to send 1 day email to ${sub.email}:`, error);
    }
  }

  return subscriptions.length;
}

app.get("/api/cron/check-trials", async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (authHeader !== `Bearer ${c.env.CRON_SECRET}`) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const endingSoon = await checkTrialsEndingSoon(c.env);
    const oneDayLeft = await checkOneDayLeft(c.env);
    const expired = await checkTrialsExpired(c.env);

    return c.json({
      success: true,
      results: {
        trialsEndingIn2Days: endingSoon,
        trialsEndingIn1Day: oneDayLeft,
        trialsExpired: expired,
      },
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;
