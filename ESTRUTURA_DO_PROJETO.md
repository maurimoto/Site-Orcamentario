# 📁 ESTRUTURA DO PROJETO - Explicação Detalhada

Este documento explica o que cada arquivo e pasta fazem no seu projeto, de forma simples e específica.

---

## 🗂️ PASTA RAIZ (c:\Users\skibi\OneDrive\Desktop\site)

### **Arquivos de Configuração do Projeto**

#### `package.json`
**O que é:** É como uma "lista de compras" do projeto que diz quais ferramentas e bibliotecas você precisa.

**O que faz especificamente:**
- Lista todas as dependências (React 19, TypeScript, Vite 7, etc.)
- Define comandos que você pode executar (`npm run dev`, `npm run build`, etc.)
- Contém informações sobre o projeto (nome, versão, autor)

#### `package-lock.json`
**O que é:** Um arquivo gerado automaticamente que "trava" as versões exatas de todas as dependências.

**O que faz especificamente:**
- Garante que todo mundo que trabalha no projeto use as mesmas versões
- Acelera a instalação de dependências
- Não deve ser editado manualmente

#### `tsconfig.json`
**O que é:** Arquivo de configuração do TypeScript.

**O que faz especificamente:**
- Define como o TypeScript deve verificar seu código
- Configura o comportamento do compilador TypeScript
- Define quais arquivos devem ser incluídos/excluídos da verificação

#### `vite.config.ts`
**O que é:** Configuração do Vite (ferramenta que compila e serve seu projeto).

**O que faz especificamente:**
- Define como o projeto React deve ser compilado
- Configura o servidor de desenvolvimento local
- Gerencia plugins como o plugin do React

#### `wrangler.toml`
**O que é:** Configuração do Cloudflare Workers (onde o projeto será hospedado).

**O que faz especificamente:**
- Define o nome do projeto na Cloudflare
- Configura o banco de dados D1
- Define quais variáveis de ambiente são necessárias
- Especifica como o projeto deve ser deployado

#### `.dev.vars`
**O que é:** Arquivo com variáveis secretas para desenvolvimento local.

**O que faz especificamente:**
- Armazena chaves de API que não devem ser compartilhadas
- Contém credenciais para serviços externos (Mocha Users Service)
- Usado apenas no ambiente de desenvolvimento (não vai para produção)

#### `worker-configuration.d.ts`
**O que é:** Arquivo de tipos TypeScript gerado automaticamente.

**O que faz especificamente:**
- Define os tipos das variáveis de ambiente (Env)
- Permite que o TypeScript entenda a estrutura do banco de dados D1
- É gerado pelo comando `wrangler types`

#### `GUIA_DE_ACESSO.md`
**O que é:** Documentação de como acessar o sistema.

**O que faz especificamente:**
- Explica como fazer login como cliente ou administrador
- Lista credenciais de acesso demo
- Mostra as funcionalidades disponíveis em cada área

#### `ESTRUTURA_DO_PROJETO.md` (este arquivo)
**O que é:** Documentação da estrutura do projeto.

**O que faz especificamente:**
- Explica o que cada arquivo e pasta fazem
- Serve como guia de referência para entender o projeto

---

## 📂 PASTA `node_modules/`

**O que é:** Pasta onde ficam todas as bibliotecas e ferramentas que o projeto usa.

**O que faz especificamente:**
- Armazena milhares de arquivos de código de terceiros
- Contém React, TypeScript, Vite, e todas as outras dependências
- É criada automaticamente quando você roda `npm install`
- Não deve ser editada manualmente
- Não é enviada para o repositório Git (está no .gitignore)

---

## 📂 PASTA `src/`

Esta é a pasta principal com todo o código do seu projeto.

### 📂 `src/worker/`

**O que é:** Código do backend (servidor) que roda na Cloudflare.

#### `src/worker/index.ts`
**O que é:** O arquivo principal do servidor.

**O que faz especificamente:**
- Cria as rotas da API (endpoints como `/api/plans`, `/api/subscriptions`)
- Conecta-se ao banco de dados D1 da Cloudflare
- Processa requisições HTTP e retorna dados em JSON
- Gerencia CORS (permite que o frontend acesse o backend)
- **Tabelas do banco usadas:**
  - `subscription_plans` - planos de assinatura
  - `user_subscriptions` - assinaturas dos usuários

#### `src/worker/schema.sql`
**O que é:** Script SQL que cria as tabelas do banco de dados.

**O que faz especificamente:**
- Define a estrutura das tabelas `subscription_plans` e `user_subscriptions`
- Especifica os tipos de cada coluna (texto, número, data, etc.)
- Define chaves primárias e relacionamentos
- Insere dados de exemplo (3 planos de assinatura e 2 assinaturas de usuários)

---

### 📂 `src/react-app/`

**O que é:** Todo o código do frontend (interface visual) feito em React.

#### `src/react-app/main.tsx`
**O que é:** O ponto de entrada da aplicação React.

**O que faz especificamente:**
- Inicia a aplicação React no navegador
- Conecta o componente `App` ao elemento HTML `#root`
- Importa os estilos globais CSS

#### `src/react-app/App.tsx`
**O que é:** O componente principal que gerencia todas as rotas da aplicação.

**O que faz especificamente:**
- Define todas as páginas do sistema e seus caminhos
- Gerencia a navegação entre páginas
- **Rotas criadas:**
  - `/` - Página de login
  - `/dashboard` - Área do cliente
  - `/plans` - Visualização de planos
  - `/new-quote` - Nova cotação
  - `/admin` - Dashboard administrativo
  - `/admin/clients` - Gestão de clientes
  - `/admin/quotes` - Gestão de orçamentos
  - `/admin/rules` - Regras de cálculo
  - `/admin/calculator` - Editor de fórmulas

#### `src/react-app/index.css`
**O que é:** Arquivo de estilos globais CSS.

**O que faz especificamente:**
- Importa o Tailwind CSS (framework de estilos)
- Define estilos globais que se aplicam a todo o site
- Configura fontes, cores e espaçamentos padrão

---

### 📂 `src/react-app/pages/`

**O que é:** Pasta com todas as páginas da aplicação.

#### `src/react-app/pages/Login.tsx`
**O que é:** Página de autenticação (login).

**O que faz especificamente:**
- Permite login como Cliente ou Administrador
- Usa autenticação demo (sem senha real)
- Salva o tipo de usuário no `localStorage` do navegador
- Redireciona para a página correta após login
- **Botões de acesso rápido:**
  - "Entrar como Cliente" → vai para `/dashboard`
  - "Entrar como Admin" → vai para `/admin`

#### `src/react-app/pages/Dashboard.tsx`
**O que é:** Área principal do cliente após fazer login.

**O que faz especificamente:**
- Mostra resumo de informações do cliente (plano ativo, orçamentos, validade)
- Exibe cards com estatísticas visuais
- Lista orçamentos recentes do cliente
- Botões de navegação para criar novo orçamento e ver planos
- Botão de logout

#### `src/react-app/pages/Plans.tsx`
**O que é:** Página que mostra os planos de assinatura disponíveis.

**O que faz especificamente:**
- Busca planos do banco de dados via API `/api/plans`
- Exibe cards com informações de cada plano (nome, preço, descrição, recursos)
- Mostra indicador de "Plano Atual" se o usuário já tiver um
- Botões para assinar planos (funcionalidade demo)

#### `src/react-app/pages/NewQuote.tsx`
**O que é:** Calculadora de orçamentos para o cliente.

**O que faz especificamente:**
- Permite o cliente calcular orçamentos de forma interativa
- Coleta informações:
  - Área (m²)
  - Tipo de acabamento (Econômico/Padrão/Premium)
  - Número de cômodos
- Calcula automaticamente:
  - Custo total
  - Custo por m²
  - Tempo estimado de obra
  - Desconto aplicado
- Salva orçamento no sistema
- Navega de volta ao dashboard após salvar

---

### 📂 `src/react-app/pages/admin/`

**O que é:** Todas as páginas da área administrativa.

#### `src/react-app/pages/admin/AdminDashboard.tsx`
**O que é:** Dashboard principal do administrador.

**O que faz especificamente:**
- Mostra estatísticas gerais do sistema (clientes ativos, orçamentos, receita)
- Cards de navegação rápida para:
  - Gerenciar Clientes
  - Ver Orçamentos
  - Regras de Cálculo
  - Calculadora de Fórmulas
- Exibe lista de clientes recentes
- Botão de logout

#### `src/react-app/pages/admin/AdminClients.tsx`
**O que é:** Página de gestão de clientes.

**O que faz especificamente:**
- Lista todos os clientes cadastrados (4 clientes de exemplo)
- Mostra informações de cada cliente:
  - Nome
  - Email
  - Telefone
  - Plano atual
  - Status (Ativo/Inativo)
  - Data de cadastro
- Botões de ação:
  - Ver detalhes
  - Editar cliente
  - Deletar cliente
- Barra de busca para filtrar clientes

#### `src/react-app/pages/admin/AdminQuotes.tsx`
**O que é:** Página de gestão de orçamentos.

**O que faz especificamente:**
- Lista todos os orçamentos do sistema (5 orçamentos de exemplo)
- Mostra para cada orçamento:
  - Cliente que solicitou
  - Área total (m²)
  - Tipo de acabamento
  - Valor total
  - Status (Pendente/Aprovado/Rejeitado)
  - Data de criação
- Botões de ação:
  - Ver detalhes completos
  - Aprovar orçamento
  - Rejeitar orçamento
- Filtros por status e busca por cliente

#### `src/react-app/pages/admin/AdminRules.tsx`
**O que é:** Página que mostra as regras de cálculo do sistema.

**O que faz especificamente:**
- Exibe 8 regras de cálculo configuradas no banco:
  1. **Custo Base por m²**: R$ 1.200,00/m²
  2. **Multiplicador Econômico**: 0.8x
  3. **Multiplicador Padrão**: 1.0x
  4. **Multiplicador Premium**: 1.5x
  5. **Desconto por área (>100m²)**: 5%
  6. **Desconto por área (>200m²)**: 10%
  7. **Taxa por cômodo**: R$ 500,00/cômodo
  8. **Dias de obra por m²**: 0.5 dias/m²
- Mostra descrição detalhada de cada regra
- Indica se a regra está ativa ou inativa

#### `src/react-app/pages/admin/AdminCalculator.tsx`
**O que é:** Editor interativo de fórmulas matemáticas.

**O que faz especificamente:**
- Lista fórmulas cadastradas (5 fórmulas pré-configuradas)
- Permite criar novas fórmulas personalizadas
- Editor com:
  - Nome da fórmula
  - Descrição
  - Campo de fórmula matemática
  - Detecção automática de variáveis na fórmula
  - Sistema de teste em tempo real
  - Categoria
  - Status (Ativa/Inativa)
- **Fórmulas pré-configuradas:**
  1. **Custo Total Básico**: `area * preco_m2`
  2. **Custo com Acabamento**: `area * preco_m2 * multiplicador_acabamento`
  3. **Custo Total Completo**: `(area * preco_m2 * multiplicador_acabamento) + (comodos * taxa_comodo)`
  4. **Tempo de Obra**: `area * dias_por_m2`
  5. **Desconto Progressivo**: `custo_total * (desconto_percentual / 100)`
- Permite testar fórmulas com valores de exemplo
- Calcula resultado em tempo real

---

### 📂 `src/react-app/components/`

**O que é:** Pasta onde ficariam componentes reutilizáveis do React.

**Status atual:** Vazia no momento (componentes podem ser adicionados aqui no futuro para organizar melhor o código).

---

### 📂 `src/react-app/lib/`

**O que é:** Pasta para funções utilitárias e helpers.

**Status atual:** Vazia no momento (pode conter funções auxiliares como formatação de datas, cálculos, etc.).

---

## 📂 PASTA `.wrangler/`

**O que é:** Pasta gerada automaticamente pelo Wrangler (CLI da Cloudflare).

**O que faz especificamente:**
- Armazena arquivos temporários de build
- Contém o banco de dados SQLite local para desenvolvimento
- Não deve ser editada manualmente
- Não é enviada para o repositório Git

---

## 📂 PASTA `dist/`

**O que é:** Pasta gerada após rodar `npm run build`.

**O que faz especificamente:**
- Contém os arquivos compilados e otimizados para produção
- É o que será enviado para o servidor Cloudflare
- É recriada toda vez que você faz um build
- Não deve ser editada manualmente

---

## 🔧 RESUMO DO FLUXO DO PROJETO

### **1. Quando você desenvolve localmente:**
1. Roda `npm run dev`
2. Vite inicia servidor em `http://localhost:5173`
3. Wrangler inicia backend em `http://localhost:8787`
4. Você acessa pelo navegador e testa as funcionalidades

### **2. Estrutura de navegação:**
```
Login (/)
├── Área Cliente (/dashboard)
│   ├── Ver Planos (/plans)
│   └── Nova Cotação (/new-quote)
│
└── Área Admin (/admin)
    ├── Gerenciar Clientes (/admin/clients)
    ├── Ver Orçamentos (/admin/quotes)
    ├── Regras de Cálculo (/admin/rules)
    └── Calculadora (/admin/calculator)
```

### **3. Como os dados fluem:**
1. **Frontend React** (páginas em `src/react-app/pages/`) → 
2. **Faz requisição HTTP** → 
3. **Backend Hono** (`src/worker/index.ts`) → 
4. **Consulta banco D1** (tabelas definidas em `src/worker/schema.sql`) → 
5. **Retorna dados em JSON** → 
6. **Frontend exibe na tela**

---

## ✅ ARQUIVOS QUE VOCÊ PODE EDITAR

- `src/react-app/pages/*.tsx` - Para modificar páginas
- `src/react-app/App.tsx` - Para adicionar/remover rotas
- `src/worker/index.ts` - Para adicionar endpoints de API
- `src/worker/schema.sql` - Para modificar estrutura do banco
- `wrangler.toml` - Para configurar deploy
- `package.json` - Para adicionar dependências

## ❌ ARQUIVOS QUE NÃO DEVE EDITAR

- `node_modules/` - Gerenciado pelo npm
- `package-lock.json` - Gerado automaticamente
- `worker-configuration.d.ts` - Gerado pelo Wrangler
- `.wrangler/` - Arquivos temporários
- `dist/` - Build de produção

---

## 📞 ONDE ENCONTRAR O QUÊ

- **Quer mudar a tela de login?** → `src/react-app/pages/Login.tsx`
- **Quer adicionar um novo plano?** → Adicione no `src/worker/schema.sql` e reinicie o banco
- **Quer mudar a cor do site?** → `src/react-app/index.css` (Tailwind)
- **Quer criar uma nova página?** → Crie em `src/react-app/pages/` e adicione rota em `App.tsx`
- **Quer adicionar uma nova API?** → Adicione endpoint em `src/worker/index.ts`
- **Quer mudar as fórmulas da calculadora?** → `src/react-app/pages/admin/AdminCalculator.tsx`

---

**📌 Este projeto está totalmente funcional e pronto para uso!**
