import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

interface MercadoPagoPreference {
  items: Array<{
    title: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
  }>;
  payer: {
    name: string;
    email: string;
    identification?: {
      type: string;
      number: string;
    };
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: string;
  external_reference: string;
  notification_url?: string;
  metadata?: {
    user_id: number;
    plan_id: number;
    subscription_id: number;
  };
}

async function createMercadoPagoPreference(
  preference: MercadoPagoPreference,
  accessToken: string
): Promise<any> {
  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify(preference),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MercadoPago API Error: ${error}`);
  }

  return await response.json();
}

async function getPaymentInfo(paymentId: string, accessToken: string): Promise<any> {
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MercadoPago API Error: ${error}`);
  }

  return await response.json();
}

app.post("/api/payments/create-preference", async (c) => {
  const body = await c.req.json();
  const { userId, planId, planName, amount } = body;

  if (!userId || !planId || !planName || !amount) {
    return c.json({ error: "Dados incompletos" }, 400);
  }

  try {
    const user = await c.env.DATABASE.prepare(
      "SELECT * FROM users WHERE id = ?"
    )
      .bind(userId)
      .first();

    if (!user) {
      return c.json({ error: "Usuário não encontrado" }, 404);
    }

    const subscription = await c.env.DATABASE.prepare(
      "SELECT * FROM user_subscriptions WHERE user_id = ? AND is_active = 1 ORDER BY id DESC LIMIT 1"
    )
      .bind(userId)
      .first();

    if (!subscription) {
      return c.json({ error: "Assinatura não encontrada" }, 404);
    }

    const externalReference = `sub_${subscription.id}_${Date.now()}`;

    const preference: MercadoPagoPreference = {
      items: [
        {
          title: `SteelFrame Pro - Plano ${planName}`,
          quantity: 1,
          unit_price: amount,
          currency_id: "BRL",
        },
      ],
      payer: {
        name: user.name,
        email: user.email,
        identification: user.cpf ? {
          type: "CPF",
          number: user.cpf.replace(/\D/g, ""),
        } : undefined,
      },
      back_urls: {
        success: `${c.env.APP_URL}/payment/success`,
        failure: `${c.env.APP_URL}/payment/failure`,
        pending: `${c.env.APP_URL}/payment/pending`,
      },
      auto_return: "approved",
      external_reference: externalReference,
      notification_url: `${c.env.APP_URL}/api/payments/webhook`,
      metadata: {
        user_id: userId,
        plan_id: planId,
        subscription_id: subscription.id,
      },
    };

    const mpResponse = await createMercadoPagoPreference(
      preference,
      c.env.MERCADOPAGO_ACCESS_TOKEN
    );

    await c.env.DATABASE.prepare(
      "INSERT INTO payments (user_id, subscription_id, amount, payment_method, payment_status, transaction_id) VALUES (?, ?, ?, 'mercadopago', 'pending', ?)"
    )
      .bind(userId, subscription.id, amount, externalReference)
      .run();

    return c.json({
      preferenceId: mpResponse.id,
      initPoint: mpResponse.init_point,
      sandboxInitPoint: mpResponse.sandbox_init_point,
    }, 200);
  } catch (error) {
    console.error("Create preference error:", error);
    return c.json({ error: "Erro ao criar preferência de pagamento" }, 500);
  }
});

app.post("/api/payments/webhook", async (c) => {
  const body = await c.req.json();

  console.log("MercadoPago Webhook received:", body);

  if (body.type === "payment") {
    const paymentId = body.data.id;

    try {
      const paymentInfo = await getPaymentInfo(
        paymentId,
        c.env.MERCADOPAGO_ACCESS_TOKEN
      );

      console.log("Payment info:", paymentInfo);

      const userId = paymentInfo.metadata?.user_id;
      const planId = paymentInfo.metadata?.plan_id;
      const subscriptionId = paymentInfo.metadata?.subscription_id;
      const externalReference = paymentInfo.external_reference;

      if (!userId || !subscriptionId) {
        console.error("Missing metadata in payment");
        return c.json({ error: "Invalid payment metadata" }, 400);
      }

      await c.env.DATABASE.prepare(
        "UPDATE payments SET payment_status = ?, payment_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE transaction_id = ?"
      )
        .bind(paymentInfo.status, externalReference)
        .run();

      if (paymentInfo.status === "approved") {
        await c.env.DATABASE.prepare(
          "UPDATE user_subscriptions SET status = 'active', plan_id = ?, billing_period = 'monthly', trial_ends_at = NULL, end_date = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
        )
          .bind(planId, subscriptionId)
          .run();

        await c.env.DATABASE.prepare(
          "INSERT INTO subscription_history (user_id, subscription_id, old_plan_id, new_plan_id, old_status, new_status, change_reason) VALUES (?, ?, 0, ?, 'trial', 'active', 'payment_approved')"
        )
          .bind(userId, subscriptionId, planId)
          .run();

        const user = await c.env.DATABASE.prepare(
          "SELECT name, email FROM users WHERE id = ?"
        )
          .bind(userId)
          .first();

        const plan = await c.env.DATABASE.prepare(
          "SELECT name FROM subscription_plans WHERE id = ?"
        )
          .bind(planId)
          .first();

        if (user) {
          try {
            await fetch(`${c.env.APP_URL}/api/emails/payment-success`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                userName: user.name,
                planName: plan?.name || 'Plano Selecionado',
                amount: paymentInfo.transaction_amount,
              }),
            });
          } catch (emailError) {
            console.error('Failed to send payment success email:', emailError);
          }
        }
      }

      return c.json({ success: true }, 200);
    } catch (error) {
      console.error("Webhook processing error:", error);
      return c.json({ error: "Error processing webhook" }, 500);
    }
  }

  return c.json({ received: true }, 200);
});

app.get("/api/payments/check/:transactionId", async (c) => {
  const transactionId = c.req.param("transactionId");

  try {
    const payment = await c.env.DATABASE.prepare(
      "SELECT * FROM payments WHERE transaction_id = ?"
    )
      .bind(transactionId)
      .first();

    if (!payment) {
      return c.json({ error: "Pagamento não encontrado" }, 404);
    }

    return c.json(payment, 200);
  } catch (error) {
    console.error("Check payment error:", error);
    return c.json({ error: "Erro ao verificar pagamento" }, 500);
  }
});

export default app;
