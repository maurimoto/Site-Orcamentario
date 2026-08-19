# SteelFrame Pro

Sistema SaaS para projetos e orçamentos em Steel Frame.

## 🚀 Como executar o projeto

### Pré-requisitos
- Node.js instalado (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Instale as dependências:
```bash
npm install --legacy-peer-deps
```

2. Configure o banco de dados local:
```bash
npx wrangler d1 execute 019c491d-41e8-77f4-8f6b-8c5f46e93f44 --local --file=migrations/6.sql
```

### Executar em modo de desenvolvimento

```bash
npm run dev
```

O site estará disponível em: `http://localhost:5173`

### Build para produção

```bash
npm run build
```

### Deploy (Cloudflare Workers)

```bash
npx wrangler deploy
```

## 📋 Estrutura do Projeto

- `/src/react-app` - Aplicação React (frontend)
- `/src/worker` - Worker Cloudflare (backend)
- `/src/backend` - Lógica de backend (APIs)
- `/migrations` - Scripts SQL do banco de dados

## 🎨 Tecnologias

- **Frontend**: React 19, TypeScript, Tailwind CSS, React Router
- **Backend**: Hono.js, Cloudflare Workers
- **Banco de Dados**: Cloudflare D1 (SQLite)
- **Build**: Vite

## 📦 Planos Disponíveis

O sistema inclui 3 planos pré-configurados:

1. **Básico** - R$ 97/mês
   - Até 20 orçamentos/mês
   - Geração automática
   - Histórico de projetos

2. **Profissional** - R$ 197/mês
   - Orçamentos ilimitados
   - Relatórios personalizados
   - Suporte prioritário

3. **Empresarial** - R$ 497/mês
   - Múltiplos usuários
   - Customização avançada
   - Consultoria dedicada

## 🔧 Comandos Úteis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Compila para produção
- `npm run lint` - Verifica erros de código
- `npm run cf-typegen` - Gera tipos do Cloudflare

## 📝 Notas

- O banco de dados é criado automaticamente no primeiro uso
- Os dados são armazenados localmente em `.wrangler/state/v3/d1`
- Para produção, configure as variáveis de ambiente no Cloudflare Dashboard
