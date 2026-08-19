import { Hono } from "hono";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import admin from "../backend/admin";
import auth from "../backend/auth";
import emails from "../backend/emails";
import cron from "../backend/cron";
import payments from "../backend/payments";
import subscriptions from "../backend/subscriptions";

const app = new Hono<{ Bindings: Env }>();

// Mount routes
app.route("/", admin);
app.route("/", auth);
app.route("/", emails);
app.route("/", cron);
app.route("/", payments);
app.route("/api/subscriptions", subscriptions);

// OAuth: Get Google redirect URL
app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

// OAuth: Exchange code for session token
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

// Get current authenticated user
app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

// Logout
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

// Get all plans
app.get("/api/plans", async (c) => {
  const plans = await c.env.DATABASE.prepare(
    "SELECT * FROM plans WHERE is_active = 1 ORDER BY price ASC"
  ).all();

  return c.json(plans.results || []);
});

export default {
  fetch: app.fetch,
  scheduled: async (event: ScheduledEvent, env: Env, ctx: ExecutionContext) => {
    ctx.waitUntil(
      fetch(`${env.APP_URL}/api/cron/check-trials`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${env.CRON_SECRET}`,
        },
      })
    );
  },
};
