import { Hono } from "hono";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";

const app = new Hono<{ Bindings: Env }>();

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const inputHash = await hashPassword(password);
  return inputHash === hash;
}

app.post("/api/auth/login", async (c) => {
  const body = await c.req.json();
  const { email, password } = body;

  if (!email || !password) {
    return c.json({ error: "Email e senha são obrigatórios" }, 400);
  }

  try {
    const user = await c.env.DATABASE.prepare(
      "SELECT * FROM users WHERE email = ? AND is_active = 1"
    )
      .bind(email)
      .first();

    if (!user) {
      return c.json({ error: "Credenciais inválidas" }, 401);
    }

    if (user.password) {
      const isValidPassword = await verifyPassword(password, user.password as string);
      if (!isValidPassword) {
        return c.json({ error: "Credenciais inválidas" }, 401);
      }
    } else {
      return c.json({ error: "Este usuário usa login OAuth" }, 400);
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      cpf: user.cpf,
      phone: user.phone,
      is_admin: user.is_admin,
    };

    return c.json({ 
      user: userResponse,
      token: user.id.toString()
    }, 200);
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Erro ao processar login" }, 500);
  }
});

app.post("/api/auth/register", async (c) => {
  const body = await c.req.json();
  const { email, password, name, cpf, phone, planType, cardNumber, cardName, cardExpiry } = body;

  if (!email || !password || !name) {
    return c.json({ error: "Email, senha e nome são obrigatórios" }, 400);
  }

  if (password.length < 6) {
    return c.json({ error: "A senha deve ter no mínimo 6 caracteres" }, 400);
  }

  try {
    const existing = await c.env.DATABASE.prepare(
      "SELECT id FROM users WHERE email = ? OR cpf = ?"
    )
      .bind(email, cpf || null)
      .first();

    if (existing) {
      return c.json({ error: "Email ou CPF já cadastrado" }, 409);
    }

    const hashedPassword = await hashPassword(password);

    const result = await c.env.DATABASE.prepare(
      "INSERT INTO users (email, name, password, cpf, phone, is_admin, is_active) VALUES (?, ?, ?, ?, ?, 0, 1)"
    )
      .bind(email, name, hashedPassword, cpf || null, phone || null)
      .run();

    const userId = result.meta.last_row_id;

    let planId = 0;
    if (planType === "basic") planId = 1;
    else if (planType === "professional") planId = 2;
    else if (planType === "enterprise") planId = 3;

    const trialEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const trialEndDateStr = trialEndDate.toISOString().split('T')[0];

    await c.env.DATABASE.prepare(
      "INSERT INTO user_subscriptions (user_id, plan_id, status, billing_period, start_date, end_date, trial_ends_at, is_active) VALUES (?, ?, 'trial', 'trial', DATE('now'), DATE('now', '+7 days'), ?, 1)"
    )
      .bind(userId, planId, trialEndDateStr)
      .run();

    if (cardNumber && cardName && cardExpiry) {
      const lastFour = cardNumber.replace(/\s/g, '').slice(-4);
      
      await c.env.DATABASE.prepare(
        "INSERT INTO payment_methods (user_id, card_last_four, card_holder_name, card_expiry, is_default, is_active) VALUES (?, ?, ?, ?, 1, 1)"
      )
        .bind(userId, lastFour, cardName, cardExpiry)
        .run();
    }

    const user = {
      id: userId,
      email,
      name,
      cpf,
      phone,
      is_admin: false,
      planType: planType || "free_trial",
      trialEndsAt: trialEndDate.toISOString(),
    };

    try {
      await fetch(`${c.req.url.split('/api')[0]}/api/emails/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          userName: name,
          planName: planType === 'free_trial' ? 'Teste Gratuito' : 
                    planType === 'basic' ? 'Básico' :
                    planType === 'professional' ? 'Profissional' : 'Empresarial',
          trialEndDate: trialEndDate.toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    return c.json({ user }, 201);
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ error: "Erro ao criar conta" }, 500);
  }
});

// Get OAuth redirect URL from the Mocha Users Service
app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

// Exchange the code for a session token
app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

// Get the current user object for the frontend
app.get("/api/users/me", authMiddleware, async (c) => {
  const mochaUser = c.get("user");
  
  if (!mochaUser) {
    return c.json({ error: "Not authenticated" }, 401);
  }

  // Check if user exists in our database, if not create them
  const existing = await c.env.DATABASE.prepare(
    "SELECT * FROM users WHERE email = ?"
  )
    .bind(mochaUser.email)
    .first();

  if (!existing) {
    // Create user in our database
    const name = mochaUser.google_user_data.name || mochaUser.email.split('@')[0];
    
    await c.env.DATABASE.prepare(
      "INSERT INTO users (email, name, is_admin, is_active) VALUES (?, ?, ?, ?)"
    )
      .bind(mochaUser.email, name, 0, 1)
      .run();
  }

  return c.json(mochaUser);
});

app.post("/api/auth/forgot-password", async (c) => {
  const body = await c.req.json();
  const { email } = body;

  if (!email) {
    return c.json({ error: "Email é obrigatório" }, 400);
  }

  try {
    const user = await c.env.DATABASE.prepare(
      "SELECT id, name, email FROM users WHERE email = ? AND is_active = 1"
    )
      .bind(email)
      .first();

    if (!user) {
      return c.json({ message: "Se o email existir, você receberá instruções para redefinir a senha" }, 200);
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await c.env.DATABASE.prepare(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)"
    )
      .bind(user.id, token, expiresAt.toISOString())
      .run();

    try {
      await fetch(`${c.req.url.split('/api')[0]}/api/emails/password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          userName: user.name,
          resetToken: token,
        }),
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }

    return c.json({ message: "Se o email existir, você receberá instruções para redefinir a senha" }, 200);
  } catch (error) {
    console.error("Forgot password error:", error);
    return c.json({ error: "Erro ao processar solicitação" }, 500);
  }
});

app.post("/api/auth/reset-password", async (c) => {
  const body = await c.req.json();
  const { token, newPassword } = body;

  if (!token || !newPassword) {
    return c.json({ error: "Token e nova senha são obrigatórios" }, 400);
  }

  if (newPassword.length < 6) {
    return c.json({ error: "A senha deve ter no mínimo 6 caracteres" }, 400);
  }

  try {
    const resetToken = await c.env.DATABASE.prepare(
      "SELECT * FROM password_reset_tokens WHERE token = ? AND used = 0 AND expires_at > datetime('now')"
    )
      .bind(token)
      .first();

    if (!resetToken) {
      return c.json({ error: "Token inválido ou expirado" }, 400);
    }

    const hashedPassword = await hashPassword(newPassword);

    await c.env.DATABASE.prepare(
      "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    )
      .bind(hashedPassword, resetToken.user_id)
      .run();

    await c.env.DATABASE.prepare(
      "UPDATE password_reset_tokens SET used = 1 WHERE id = ?"
    )
      .bind(resetToken.id)
      .run();

    return c.json({ message: "Senha redefinida com sucesso" }, 200);
  } catch (error) {
    console.error("Reset password error:", error);
    return c.json({ error: "Erro ao redefinir senha" }, 500);
  }
});

app.post("/api/subscriptions/upgrade", async (c) => {
  const body = await c.req.json();
  const { userId, planId } = body;

  if (!userId || planId === undefined) {
    return c.json({ error: "userId e planId são obrigatórios" }, 400);
  }

  try {
    const subscription = await c.env.DATABASE.prepare(
      "SELECT * FROM user_subscriptions WHERE user_id = ? AND is_active = 1 ORDER BY id DESC LIMIT 1"
    )
      .bind(userId)
      .first();

    if (!subscription) {
      return c.json({ error: "Assinatura não encontrada" }, 404);
    }

    const oldPlanId = subscription.plan_id;
    const oldStatus = subscription.status;

    await c.env.DATABASE.prepare(
      "UPDATE user_subscriptions SET plan_id = ?, status = 'active', billing_period = 'monthly', end_date = NULL, trial_ends_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    )
      .bind(planId, subscription.id)
      .run();

    await c.env.DATABASE.prepare(
      "INSERT INTO subscription_history (user_id, subscription_id, old_plan_id, new_plan_id, old_status, new_status, change_reason) VALUES (?, ?, ?, ?, ?, 'active', 'upgrade_from_trial')"
    )
      .bind(userId, subscription.id, oldPlanId, planId, oldStatus)
      .run();

    return c.json({ success: true, message: "Plano atualizado com sucesso" }, 200);
  } catch (error) {
    console.error("Upgrade subscription error:", error);
    return c.json({ error: "Erro ao atualizar plano" }, 500);
  }
});

app.post("/api/subscriptions/cancel", async (c) => {
  const body = await c.req.json();
  const { userId, reason } = body;

  if (!userId) {
    return c.json({ error: "userId é obrigatório" }, 400);
  }

  try {
    const subscription = await c.env.DATABASE.prepare(
      "SELECT * FROM user_subscriptions WHERE user_id = ? AND is_active = 1 ORDER BY id DESC LIMIT 1"
    )
      .bind(userId)
      .first();

    if (!subscription) {
      return c.json({ error: "Assinatura não encontrada" }, 404);
    }

    const oldStatus = subscription.status;

    await c.env.DATABASE.prepare(
      "UPDATE user_subscriptions SET status = 'cancelled', is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    )
      .bind(subscription.id)
      .run();

    await c.env.DATABASE.prepare(
      "INSERT INTO subscription_history (user_id, subscription_id, old_plan_id, new_plan_id, old_status, new_status, change_reason) VALUES (?, ?, ?, ?, ?, 'cancelled', ?)"
    )
      .bind(userId, subscription.id, subscription.plan_id, subscription.plan_id, oldStatus, reason || 'user_cancelled')
      .run();

    return c.json({ success: true, message: "Assinatura cancelada com sucesso" }, 200);
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return c.json({ error: "Erro ao cancelar assinatura" }, 500);
  }
});

// Logout endpoint
app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

export default app;
