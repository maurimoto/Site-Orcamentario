import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

function getWelcomeEmail(userName: string, planName: string, trialEndDate: string): EmailTemplate {
  const trialEnd = new Date(trialEndDate).toLocaleDateString('pt-BR');
  
  return {
    subject: "Bem-vindo ao SteelFrame Pro! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .info-box { background: #e0f2fe; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏗️ SteelFrame Pro</h1>
              <p>Bem-vindo à plataforma!</p>
            </div>
            <div class="content">
              <h2>Olá, ${userName}!</h2>
              <p>Sua conta foi criada com sucesso. Estamos muito felizes em tê-lo conosco!</p>
              
              <div class="info-box">
                <strong>📋 Detalhes da sua conta:</strong><br>
                Plano escolhido: <strong>${planName}</strong><br>
                Período de teste: <strong>7 dias gratuitos</strong><br>
                Teste termina em: <strong>${trialEnd}</strong>
              </div>
              
              <p><strong>Durante o período de teste:</strong></p>
              <ul>
                <li>✅ Acesso completo a todos os recursos</li>
                <li>✅ Sem cobrança no cartão</li>
                <li>✅ Cancele a qualquer momento</li>
              </ul>
              
              <p>Após o período de teste, você poderá escolher um plano ou cancelar sem custos.</p>
              
              <a href="${env.APP_URL}/dashboard" class="button">Acessar Plataforma</a>
              
              <p>Se tiver alguma dúvida, nossa equipe está à disposição!</p>
            </div>
            <div class="footer">
              <p>SteelFrame Pro - Sistema de Orçamentos<br>
              <a href="${env.APP_URL}/terms">Termos de Uso</a> | 
              <a href="${env.APP_URL}/privacy">Política de Privacidade</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Bem-vindo ao SteelFrame Pro!

Olá, ${userName}!

Sua conta foi criada com sucesso. Estamos muito felizes em tê-lo conosco!

Detalhes da sua conta:
- Plano escolhido: ${planName}
- Período de teste: 7 dias gratuitos
- Teste termina em: ${trialEnd}

Durante o período de teste:
✅ Acesso completo a todos os recursos
✅ Sem cobrança no cartão
✅ Cancele a qualquer momento

Acesse: ${env.APP_URL}/dashboard

Equipe SteelFrame Pro
    `
  };
}

function getTrialEndingSoonEmail(userName: string, daysLeft: number, planName: string): EmailTemplate {
  return {
    subject: `⏰ Seu teste gratuito termina em ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ SteelFrame Pro</h1>
              <p>Seu teste está terminando</p>
            </div>
            <div class="content">
              <h2>Olá, ${userName}!</h2>
              
              <div class="warning-box">
                <strong>⚠️ Atenção:</strong><br>
                Seu período de teste gratuito termina em <strong>${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'}</strong>!
              </div>
              
              <p>Plano selecionado: <strong>${planName}</strong></p>
              
              <p><strong>O que acontece depois?</strong></p>
              <ul>
                <li>Se você manter o plano: a cobrança será iniciada automaticamente</li>
                <li>Se quiser cancelar: faça isso antes do fim do teste, sem custos</li>
                <li>Se não fizer nada: sua conta será cancelada automaticamente</li>
              </ul>
              
              <a href="${env.APP_URL}/client/subscription" class="button">Gerenciar Assinatura</a>
              
              <p>Obrigado por usar o SteelFrame Pro!</p>
            </div>
            <div class="footer">
              <p>SteelFrame Pro - Sistema de Orçamentos</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Seu teste gratuito termina em ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'}!

Olá, ${userName}!

Seu período de teste gratuito está terminando.

Plano selecionado: ${planName}

O que acontece depois?
- Se você manter o plano: a cobrança será iniciada automaticamente
- Se quiser cancelar: faça isso antes do fim do teste, sem custos
- Se não fizer nada: sua conta será cancelada automaticamente

Gerencie sua assinatura: ${env.APP_URL}/client/subscription

Equipe SteelFrame Pro
    `
  };
}

function getTrialExpiredEmail(userName: string): EmailTemplate {
  return {
    subject: "Seu período de teste expirou",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .info-box { background: #e2e8f0; border-left: 4px solid #64748b; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SteelFrame Pro</h1>
              <p>Período de teste encerrado</p>
            </div>
            <div class="content">
              <h2>Olá, ${userName}</h2>
              
              <div class="info-box">
                <strong>ℹ️ Seu período de teste de 7 dias foi encerrado.</strong>
              </div>
              
              <p>Como você não selecionou um plano pago, sua conta foi pausada automaticamente.</p>
              
              <p><strong>Quer continuar usando o SteelFrame Pro?</strong></p>
              <p>Você pode reativar sua conta a qualquer momento escolhendo um de nossos planos.</p>
              
              <a href="${env.APP_URL}/plans" class="button">Ver Planos Disponíveis</a>
              
              <p>Esperamos vê-lo novamente em breve!</p>
            </div>
            <div class="footer">
              <p>SteelFrame Pro - Sistema de Orçamentos</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Período de teste encerrado

Olá, ${userName}

Seu período de teste de 7 dias foi encerrado.

Como você não selecionou um plano pago, sua conta foi pausada automaticamente.

Quer continuar usando o SteelFrame Pro?
Você pode reativar sua conta a qualquer momento: ${env.APP_URL}/plans

Equipe SteelFrame Pro
    `
  };
}

function getPaymentSuccessEmail(userName: string, planName: string, amount: number): EmailTemplate {
  return {
    subject: "Pagamento confirmado - SteelFrame Pro",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .success-box { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ SteelFrame Pro</h1>
              <p>Pagamento Confirmado</p>
            </div>
            <div class="content">
              <h2>Olá, ${userName}!</h2>
              
              <div class="success-box">
                <strong>✅ Seu pagamento foi processado com sucesso!</strong>
              </div>
              
              <p><strong>Detalhes do pagamento:</strong></p>
              <ul>
                <li>Plano: ${planName}</li>
                <li>Valor: R$ ${amount.toFixed(2)}</li>
                <li>Data: ${new Date().toLocaleDateString('pt-BR')}</li>
              </ul>
              
              <p>Sua assinatura está ativa e você tem acesso completo a todos os recursos.</p>
              
              <a href="${env.APP_URL}/dashboard" class="button">Acessar Plataforma</a>
              
              <p>Obrigado por escolher o SteelFrame Pro!</p>
            </div>
            <div class="footer">
              <p>SteelFrame Pro - Sistema de Orçamentos</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Pagamento Confirmado

Olá, ${userName}!

Seu pagamento foi processado com sucesso!

Detalhes do pagamento:
- Plano: ${planName}
- Valor: R$ ${amount.toFixed(2)}
- Data: ${new Date().toLocaleDateString('pt-BR')}

Acesse: ${env.APP_URL}/dashboard

Equipe SteelFrame Pro
    `
  };
}

function getPasswordResetEmail(userName: string, resetToken: string): EmailTemplate {
  return {
    subject: "Recuperação de senha - SteelFrame Pro",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .warning-box { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 SteelFrame Pro</h1>
              <p>Recuperação de Senha</p>
            </div>
            <div class="content">
              <h2>Olá, ${userName}!</h2>
              
              <p>Recebemos uma solicitação para redefinir sua senha.</p>
              
              <a href="${env.APP_URL}/reset-password?token=${resetToken}" class="button">Redefinir Senha</a>
              
              <div class="warning-box">
                <strong>⚠️ Importante:</strong><br>
                Este link expira em 1 hora.<br>
                Se você não solicitou esta recuperação, ignore este email.
              </div>
              
              <p>Por segurança, nunca compartilhe este link com ninguém.</p>
            </div>
            <div class="footer">
              <p>SteelFrame Pro - Sistema de Orçamentos</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Recuperação de Senha

Olá, ${userName}!

Recebemos uma solicitação para redefinir sua senha.

Redefina sua senha: ${env.APP_URL}/reset-password?token=${resetToken}

Este link expira em 1 hora.
Se você não solicitou esta recuperação, ignore este email.

Equipe SteelFrame Pro
    `
  };
}

async function sendEmail(to: string, template: EmailTemplate, env: Env): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SteelFrame Pro <noreply@steelframepro.com>',
        to: [to],
        subject: template.subject,
        html: template.html,
        text: template.text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Email send failed:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

app.post("/api/emails/welcome", async (c) => {
  const { email, userName, planName, trialEndDate } = await c.req.json();

  if (!email || !userName) {
    return c.json({ error: "Email e nome são obrigatórios" }, 400);
  }

  const template = getWelcomeEmail(userName, planName, trialEndDate);
  const sent = await sendEmail(email, template, c.env);

  if (sent) {
    return c.json({ success: true, message: "Email enviado" }, 200);
  } else {
    return c.json({ error: "Falha ao enviar email" }, 500);
  }
});

app.post("/api/emails/trial-ending", async (c) => {
  const { email, userName, daysLeft, planName } = await c.req.json();

  const template = getTrialEndingSoonEmail(userName, daysLeft, planName);
  const sent = await sendEmail(email, template, c.env);

  if (sent) {
    return c.json({ success: true }, 200);
  } else {
    return c.json({ error: "Falha ao enviar email" }, 500);
  }
});

app.post("/api/emails/trial-expired", async (c) => {
  const { email, userName } = await c.req.json();

  const template = getTrialExpiredEmail(userName);
  const sent = await sendEmail(email, template, c.env);

  if (sent) {
    return c.json({ success: true }, 200);
  } else {
    return c.json({ error: "Falha ao enviar email" }, 500);
  }
});

app.post("/api/emails/payment-success", async (c) => {
  const { email, userName, planName, amount } = await c.req.json();

  const template = getPaymentSuccessEmail(userName, planName, amount);
  const sent = await sendEmail(email, template, c.env);

  if (sent) {
    return c.json({ success: true }, 200);
  } else {
    return c.json({ error: "Falha ao enviar email" }, 500);
  }
});

app.post("/api/emails/password-reset", async (c) => {
  const { email, userName, resetToken } = await c.req.json();

  const template = getPasswordResetEmail(userName, resetToken);
  const sent = await sendEmail(email, template, c.env);

  if (sent) {
    return c.json({ success: true }, 200);
  } else {
    return c.json({ error: "Falha ao enviar email" }, 500);
  }
});

export default app;
