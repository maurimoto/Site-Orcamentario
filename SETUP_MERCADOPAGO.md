# Guia de Integração - Mercado Pago

## 1. Criar Conta no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/
2. Clique em "Criar conta"
3. Complete o cadastro (pessoa física ou jurídica)
4. Ative sua conta via e-mail

## 2. Obter Credenciais

### Modo Sandbox (Testes)

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em "Suas integrações" > "Criar aplicação"
3. Preencha os dados da aplicação
4. Em "Credenciais de teste", copie o **Access Token**

### Modo Produção

1. No mesmo painel, vá em "Credenciais de produção"
2. Ative sua conta para produção (pode requerer certificação)
3. Copie o **Access Token de produção**

## 3. Configurar Variáveis de Ambiente

### Desenvolvimento Local

Crie o arquivo `.dev.vars` na raiz do projeto:

```
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-123456-abcdef1234567890abcdef1234567890-123456789
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
DATABASE=sua-database-id
```

### Produção (Cloudflare)

Execute os comandos:

```bash
wrangler secret put MERCADOPAGO_ACCESS_TOKEN
# Cole o Access Token de PRODUÇÃO

wrangler secret put RESEND_API_KEY
# Cole sua API key do Resend

wrangler secret put DATABASE
# Cole o ID do seu database D1
```

## 4. Configurar Webhooks

### URL do Webhook

Sua URL será: `https://seu-dominio.com/api/payments/webhook`

### Configurar no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em sua aplicação > "Webhooks"
3. Clique em "Configurar notificações"
4. Adicione a URL: `https://seu-dominio.com/api/payments/webhook`
5. Selecione os eventos:
   - `payment` (Pagamentos)
   - `merchant_order` (Pedidos)

## 5. Como Funciona o Fluxo

### 1. Cliente Seleciona Plano
- Na página `/client/subscription`, cliente clica em "Assinar"

### 2. Backend Cria Preferência
```typescript
POST /api/payments/create-preference
Body: {
  "planId": 1,
  "userId": 123
}
```

### 3. Cliente é Redirecionado
- Para o Checkout Pro do Mercado Pago
- Preenche dados de pagamento

### 4. Mercado Pago Processa
- Pagamento aprovado → `/payment/success?external_reference=USER_123_PLAN_1`
- Pagamento recusado → `/payment/failure`
- Pagamento pendente → `/payment/pending` (boleto, transferência)

### 5. Webhook Notifica
- Mercado Pago envia POST para `/api/payments/webhook`
- Sistema atualiza assinatura automaticamente

### 6. Cliente Acessa Sistema
- Status da assinatura é atualizado em tempo real

## 6. Integrar na Interface

### Exemplo: Botão de Pagamento

Adicione em `ClientSubscription.tsx`:

```typescript
const handleUpgrade = async (planId: number) => {
  try {
    const response = await fetch('/api/payments/create-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ planId })
    });

    const data = await response.json();
    
    if (data.init_point) {
      // Redireciona para checkout do Mercado Pago
      window.location.href = data.init_point;
    }
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
  }
};
```

## 7. Testar Integração

### Cartões de Teste (Sandbox)

**APROVADO**
- Cartão: 5031 4332 1540 6351
- CVV: 123
- Validade: 11/25
- Titular: APRO

**RECUSADO**
- Cartão: 5031 4332 1540 6351
- CVV: 123
- Validade: 11/25
- Titular: OXXO

### Fluxo de Teste

1. Crie usuário de teste
2. Faça login
3. Vá em "Minha Assinatura"
4. Clique em "Assinar" em um plano
5. Use cartão de teste APRO
6. Verifique redirecionamento para `/payment/success`
7. Confira se assinatura foi atualizada no banco

## 8. Verificar Logs

### Ver status do webhook no Mercado Pago

1. Vá em: https://www.mercadopago.com.br/developers/panel
2. Clique em "Webhooks" > "Histórico"
3. Veja todas as notificações enviadas e respostas

### Ver logs no Cloudflare

```bash
wrangler tail
```

## 9. Valores dos Planos

| Plano | Valor | Descrição |
|-------|-------|-----------|
| Trial | R$ 0,00 | 7 dias grátis, 4 orçamentos |
| Básico | R$ 29,90 | 10 orçamentos/mês |
| Profissional | R$ 49,90 | 50 orçamentos/mês |
| Empresarial | R$ 99,90 | Orçamentos ilimitados |

## 10. Checklist de Produção

- [ ] Conta Mercado Pago criada e verificada
- [ ] Access Token de PRODUÇÃO obtido
- [ ] Variáveis de ambiente configuradas no Cloudflare
- [ ] Webhook configurado com URL de produção
- [ ] SSL/HTTPS ativo no domínio
- [ ] Testes realizados em sandbox
- [ ] Fluxo completo testado: checkout → webhook → atualização
- [ ] Páginas de retorno (success/failure/pending) testadas
- [ ] Logs de webhook verificados

## 11. Suporte

### Documentação Oficial
- Mercado Pago Developers: https://www.mercadopago.com.br/developers/
- API Reference: https://www.mercadopago.com.br/developers/pt/reference

### Problemas Comuns

**Webhook não recebe notificações**
- Verifique se URL está acessível publicamente
- Confirme se HTTPS está ativo
- Veja logs no painel do Mercado Pago

**Pagamento aprovado mas assinatura não atualiza**
- Verifique logs do webhook
- Confirme se `external_reference` está correto
- Veja tabela `subscription_history` no banco

**Erro "Access Token inválido"**
- Verifique se usou token de PRODUÇÃO (não teste)
- Confirme variável de ambiente no Cloudflare
- Token deve começar com `APP_USR-` para produção
