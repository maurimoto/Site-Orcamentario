# 📧 Sistema de Comunicação por Email - SteelFrame Pro

## ✅ Sistema Implementado

### **Emails Automáticos Criados:**

1. **📨 Boas-vindas** (`/api/emails/welcome`)
   - Enviado: Imediatamente após registro
   - Conteúdo: Confirmação de cadastro, detalhes do trial

2. **⏰ Trial Terminando** (`/api/emails/trial-ending`)
   - Enviado: 2 dias e 1 dia antes do fim do trial
   - Conteúdo: Lembrete sobre fim do teste, opções disponíveis

3. **🔚 Trial Expirado** (`/api/emails/trial-expired`)
   - Enviado: No dia que o trial expira
   - Conteúdo: Aviso de conta pausada, convite para escolher plano

4. **💳 Pagamento Confirmado** (`/api/emails/payment-success`)
   - Enviado: Após pagamento bem-sucedido
   - Conteúdo: Confirmação de pagamento, detalhes da assinatura

5. **🔒 Recuperação de Senha** (`/api/emails/password-reset`)
   - Enviado: Quando usuário solicita reset de senha
   - Conteúdo: Link seguro para redefinir senha

---

## 🔧 Configuração Necessária

### **1. Criar Conta no Resend (Gratuito)**

Resend é um serviço de email transacional moderno e gratuito até 100 emails/dia.

1. Acesse: https://resend.com
2. Crie uma conta
3. Verifique seu domínio ou use domínio de teste
4. Gere uma API Key

### **2. Adicionar Variáveis de Ambiente**

No arquivo `.dev.vars` (para desenvolvimento local):

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
APP_URL=http://localhost:8787
CRON_SECRET=sua-senha-secreta-aqui
```

No Cloudflare Workers (produção):

```bash
npx wrangler secret put RESEND_API_KEY
# Cole sua API key quando solicitado

npx wrangler secret put CRON_SECRET
# Cole uma senha secreta (gere com: openssl rand -base64 32)
```

Adicione `APP_URL` nas configurações do Worker:
```bash
wrangler secret put APP_URL
# https://seudominio.com
```

### **3. Configurar Domínio no Resend (Opcional mas Recomendado)**

Para emails profissionais (ex: `noreply@steelframepro.com`):

1. No dashboard do Resend, vá em "Domains"
2. Adicione seu domínio
3. Configure os registros DNS fornecidos:
   - SPF
   - DKIM
   - Return-Path
4. Aguarde verificação (geralmente 5-10 minutos)

**Se não configurar domínio:** Emails serão enviados de `onboarding@resend.dev`

---

## 🤖 Sistema de Cron Job

### **Verificação Automática de Trials**

O sistema verifica a cada 6 horas:
- Trials que terminam em 2 dias → Envia email de lembrete
- Trials que terminam em 1 dia → Envia email final
- Trials expirados → Cancela conta e envia email

**Configuração no Cloudflare:**

O cron já está configurado em `wrangler.json`:
```json
"triggers": {
  "crons": ["0 */6 * * *"]
}
```

Isso executa **4 vezes por dia** (00:00, 06:00, 12:00, 18:00 UTC)

### **Teste Manual do Cron**

Para testar localmente ou forçar verificação:

```bash
curl http://localhost:8787/api/cron/check-trials \
  -H "Authorization: Bearer seu-cron-secret"
```

---

## 📬 Templates de Email

Todos os emails incluem:
- ✅ Design responsivo (funciona em mobile e desktop)
- ✅ Layout profissional com cores da marca
- ✅ Versão HTML e texto puro (para acessibilidade)
- ✅ Links funcionais
- ✅ Footer com links legais

### **Personalização dos Templates**

Para customizar, edite: `src/backend/emails.ts`

Cada função retorna um objeto `EmailTemplate`:
```typescript
{
  subject: string,
  html: string,    // Versão HTML
  text: string     // Versão texto puro
}
```

---

## 🔒 Segurança

1. **API Key Protegida**: Nunca commite a API key no código
2. **Cron Protegido**: Endpoint do cron requer token secreto
3. **Rate Limiting**: Resend tem proteção contra spam
4. **HTTPS**: Todas as chamadas são criptografadas

---

## 📊 Monitoramento

### **Dashboard do Resend**

Acesse https://resend.com/emails para ver:
- Emails enviados
- Taxa de entrega
- Emails abertos (se configurado)
- Emails com erro

### **Logs do Cloudflare**

```bash
npx wrangler tail
```

Mostra em tempo real:
- Emails sendo enviados
- Erros de envio
- Execuções do cron job

---

## 🧪 Testando o Sistema

### **1. Teste de Registro**

1. Registre uma nova conta
2. Verifique se recebeu email de boas-vindas
3. Cheque spam/lixeira se não receber

### **2. Teste de Trial Ending**

Para testar sem esperar 7 dias:

```sql
-- Altere uma assinatura para expirar amanhã
UPDATE user_subscriptions 
SET trial_ends_at = DATE('now', '+1 day')
WHERE user_id = SEU_USER_ID;
```

Então execute o cron manualmente.

### **3. Teste de Todos os Emails**

Crie um script de teste:

```typescript
// test-emails.ts
const emails = [
  { endpoint: '/api/emails/welcome', data: {...} },
  { endpoint: '/api/emails/trial-ending', data: {...} },
  // etc
];

for (const email of emails) {
  await fetch(`http://localhost:8787${email.endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(email.data),
  });
}
```

---

## 💰 Custos

### **Resend - Plano Gratuito**
- ✅ 3.000 emails/mês grátis
- ✅ 100 emails/dia grátis
- ✅ Suficiente para começar

### **Resend - Plano Pago** (se precisar mais)
- $20/mês = 50.000 emails
- $80/mês = 250.000 emails

### **Alternativas Gratuitas**
- SendGrid: 100 emails/dia grátis
- Mailgun: 5.000 emails/mês nos primeiros 3 meses
- Amazon SES: 62.000 emails/mês grátis (com EC2)

---

## ✅ Checklist de Implementação

- [x] Sistema de templates criado
- [x] 5 tipos de email implementados
- [x] Integração com Resend
- [x] Cron job para verificação automática
- [x] Envio de boas-vindas no registro
- [x] Proteção do endpoint de cron
- [ ] **Configurar conta no Resend**
- [ ] **Adicionar variáveis de ambiente**
- [ ] **Testar todos os emails**
- [ ] **Configurar domínio personalizado (opcional)**
- [ ] **Monitorar entregas por 1 semana**

---

## 🚀 Próximos Passos

1. **Criar conta no Resend** (5 minutos)
2. **Adicionar API key** nas variáveis de ambiente
3. **Testar email de boas-vindas** registrando nova conta
4. **Configurar domínio** (se quiser emails profissionais)
5. **Deploy em produção**

---

## 📞 Suporte

**Problemas comuns:**

**❌ Emails não chegam**
- Verifique API key
- Cheque pasta de spam
- Veja logs do Resend
- Confirme variável APP_URL está correta

**❌ Cron não executa**
- Verifique se CRON_SECRET está configurado
- Teste endpoint manualmente
- Cheque logs do Cloudflare

**❌ Domínio não verifica**
- Aguarde até 24h
- Confirme registros DNS corretos
- Use ferramenta de teste DNS (ex: MXToolbox)

---

Sistema completo e pronto para produção! 🎉
