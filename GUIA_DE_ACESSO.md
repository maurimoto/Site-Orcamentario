# 🔐 Guia Completo de Acesso - SteelFrame Pro

## 📍 Todas as Páginas Disponíveis

### Área Pública
| Página | URL | Descrição |
|--------|-----|-----------|
| Home | `http://localhost:5173/` | Landing page com informações do sistema |
| Login | `http://localhost:5173/login` | Página de autenticação |
| Planos | `http://localhost:5173/plans` | Visualizar planos disponíveis |

### Área do Cliente (Requer Login)
| Página | URL | Descrição |
|--------|-----|-----------|
| Dashboard | `http://localhost:5173/dashboard` | Visão geral com estatísticas |
| Novo Orçamento | `http://localhost:5173/new-quote` | Criar e calcular novo orçamento |

### Área do Administrador (Requer Login Admin)
| Página | URL | Descrição |
|--------|-----|-----------|
| Dashboard Admin | `http://localhost:5173/admin` | Métricas e visão geral do negócio |
| Gestão de Clientes | `http://localhost:5173/admin/clients` | Lista e gerencia todos os clientes |
| Gestão de Orçamentos | `http://localhost:5173/admin/quotes` | Todos os orçamentos da plataforma |
| Regras de Cálculo | `http://localhost:5173/admin/rules` | Configuração das regras de precificação |

---

## 👤 Acesso Rápido (Via Botões)

1. Acesse: `http://localhost:5173/login`
2. Escolha uma das opções:

**Cliente Demo:**
- Clique em **"Entrar como Cliente"**
- Redirecionamento automático para `/dashboard`

**Administrador Demo:**
- Clique em **"Entrar como Administrador"**
- Redirecionamento automático para `/admin`

---

## 🗺️ Mapa Completo de Navegação

### 📱 ÁREA DO CLIENTE

#### Dashboard (`/dashboard`)
**Funcionalidades:**
- ✅ Estatísticas pessoais (2 orçamentos, R$ 500k em projetos)
- ✅ Status da assinatura (Plano Profissional)
- ✅ Lista de orçamentos recentes
- ✅ Ações rápidas:
  - Criar novo orçamento
  - Ver todos os orçamentos
  - Gerenciar assinatura
- ✅ Navegação para:
  - `/new-quote` - Novo Orçamento
  - `/plans` - Planos e Assinaturas

#### Novo Orçamento (`/new-quote`)
**Funcionalidades:**
- ✅ Formulário completo de orçamento:
  - Tipo de projeto (Residencial/Comercial/Industrial)
  - Área total em m²
  - Número de pavimentos
  - Tipo de acabamento (Básico/Padrão/Premium)
  - Localização
  - Observações
- ✅ Cálculo automático baseado em regras
- ✅ Resumo em tempo real
- ✅ Valor total estimado
- ✅ Valor por m²

**Regras de Cálculo Implementadas:**
- Custo base: R$ 1.200/m²
- Multiplicadores por tipo de projeto:
  - Residencial: 1.0x
  - Comercial: 1.2x
  - Industrial: 0.9x
- Multiplicadores por acabamento:
  - Básico: 0.85x (-15%)
  - Padrão: 1.0x
  - Premium: 1.35x (+35%)
- Custo adicional: R$ 150/m² por pavimento extra

---

### 👔 ÁREA DO ADMINISTRADOR

#### Dashboard Admin (`/admin`)
**Métricas Exibidas:**
- 127 clientes totais (+12 este mês)
- 89 assinaturas ativas (70% conversão)
- 87 orçamentos este mês (456 total)
- R$ 17.460/mês de receita (MRR)

**Recursos:**
- ✅ Cards com estatísticas principais
- ✅ Gráfico de distribuição de planos
- ✅ Tabela de orçamentos recentes
- ✅ Ações rápidas para todas as áreas
- ✅ Navegação completa no menu superior

#### Gestão de Clientes (`/admin/clients`)
**Funcionalidades:**
- ✅ Lista completa de clientes com:
  - Nome e email
  - Telefone
  - Plano atual
  - Status (Ativo/Inativo)
  - Data de cadastro
- ✅ Busca por nome ou email
- ✅ Filtros avançados
- ✅ Ações:
  - Editar cliente
  - Excluir cliente
  - Adicionar novo cliente

**Dados de Exemplo:**
- 4 clientes cadastrados
- 3 ativos, 1 inativo
- Planos variados (Básico, Profissional, Empresarial)

#### Gestão de Orçamentos (`/admin/quotes`)
**Funcionalidades:**
- ✅ Visão completa de todos os orçamentos:
  - Informações do cliente
  - Tipo e detalhes do projeto
  - Área em m²
  - Localização
  - Valor estimado
  - Status (Concluído/Rascunho)
- ✅ Cards com resumo:
  - Total de orçamentos
  - Orçamentos concluídos
  - Valor total gerado
- ✅ Busca por cliente, tipo ou localização
- ✅ Filtro por status
- ✅ Ações:
  - Visualizar detalhes
  - Download do orçamento

**Dados de Exemplo:**
- 5 orçamentos cadastrados
- Variados tipos (Residencial, Comercial, Industrial)
- Valores de R$ 245k a R$ 890k

#### Regras de Cálculo (`/admin/rules`)
**Funcionalidades:**
- ✅ Visualização de todas as 8 regras ativas:
  1. Custo Base por M² (R$ 1.200)
  2. Multiplicador Residencial (1.0x)
  3. Multiplicador Comercial (1.2x)
  4. Multiplicador Industrial (0.9x)
  5. Multiplicador Básico (0.85x)
  6. Multiplicador Padrão (1.0x)
  7. Multiplicador Premium (1.35x)
  8. Custo por Pavimento (R$ 150)
- ✅ Cards individuais com detalhes completos
- ✅ Status ativo/inativo
- ✅ Tipo de regra identificado
- ✅ Valores e multiplicadores
- ✅ Condições em JSON
- ✅ Ações:
  - Editar regra
  - Excluir regra
  - Adicionar nova regra
- ✅ Explicação de como funcionam as regras

---

## 📊 Dados Completos Disponíveis

### Clientes (Admin)
```
João Silva
- Email: joao.silva@email.com
- Telefone: (11) 98765-4321
- Plano: Profissional
- Status: Ativo
- Cadastro: há 45 dias

Maria Santos
- Email: maria.santos@email.com
- Telefone: (21) 97654-3210
- Plano: Empresarial
- Status: Ativo
- Cadastro: há 30 dias

Pedro Costa
- Email: pedro.costa@email.com
- Telefone: (31) 96543-2109
- Plano: Básico
- Status: Ativo
- Cadastro: há 15 dias

Ana Oliveira
- Email: ana.oliveira@email.com
- Telefone: (41) 95432-1098
- Plano: Profissional
- Status: Inativo
- Cadastro: há 60 dias
```

### Orçamentos Detalhados (Admin)
```
1. João Silva
   - Residencial, 120m², 2 pisos, Padrão
   - São Paulo, SP
   - R$ 245.000

2. Maria Santos
   - Comercial, 350m², 1 piso, Premium
   - Rio de Janeiro, RJ
   - R$ 580.000

3. Pedro Costa
   - Industrial, 800m², 1 piso, Básico
   - Belo Horizonte, MG
   - R$ 890.000

4. Ana Oliveira
   - Residencial, 180m², 3 pisos, Premium
   - Curitiba, PR
   - R$ 420.000 (Rascunho)

5. Carlos Mendes
   - Comercial, 450m², 2 pisos, Padrão
   - Porto Alegre, RS
   - R$ 670.000
```

### Planos (Banco D1)
```
Básico - R$ 97/mês
- Até 20 orçamentos/mês
- Geração automática
- Histórico de projetos
- Suporte por email

Profissional - R$ 197/mês
- Orçamentos ilimitados
- Relatórios personalizados
- Suporte prioritário
- API de integração

Empresarial - R$ 497/mês
- Múltiplos usuários
- Customização avançada
- Consultoria dedicada
- SLA garantido
```

---

## 🎯 Fluxos Completos de Uso

### Fluxo 1: Cliente Cria Orçamento

1. Login em `/login` → Clique "Entrar como Cliente"
2. Dashboard `/dashboard` → Visualiza resumo
3. Clique "Novo Orçamento" → `/new-quote`
4. Preenche formulário:
   - Tipo: Residencial
   - Área: 150m²
   - Pavimentos: 2
   - Acabamento: Premium
   - Localização: São Paulo, SP
5. Clica "Calcular Orçamento"
6. Sistema calcula: R$ 378.000
7. Visualiza resumo completo

### Fluxo 2: Admin Gerencia Clientes

1. Login em `/login` → Clique "Entrar como Administrador"
2. Dashboard `/admin` → Visualiza métricas gerais
3. Clique "Clientes" no menu → `/admin/clients`
4. Visualiza 4 clientes cadastrados
5. Usa busca para filtrar
6. Clica "Editar" em um cliente
7. Pode adicionar novo cliente com "+Novo Cliente"

### Fluxo 3: Admin Revisa Orçamentos

1. Acessa `/admin/quotes`
2. Visualiza 5 orçamentos com detalhes completos
3. Usa filtros (Todos/Concluídos/Rascunhos)
4. Busca por cliente ou localização
5. Clica "Ver" para detalhes
6. Pode fazer download do orçamento

### Fluxo 4: Admin Configura Regras

1. Acessa `/admin/rules`
2. Visualiza 8 regras ativas
3. Entende como cada regra funciona
4. Pode editar multiplicadores
5. Pode adicionar novas regras
6. Ativa/desativa regras conforme necessário

---

## 🚀 Como Iniciar

```bash
cd c:\Users\skibi\OneDrive\Desktop\site
npm run dev
```

Acesse: `http://localhost:5173`

---

## ✅ Checklist de Funcionalidades

### Área do Cliente
- [x] Dashboard com resumo pessoal
- [x] Visualizar orçamentos
- [x] Criar novo orçamento
- [x] Calculadora de orçamento funcional
- [x] Visualizar planos
- [x] Status da assinatura
- [x] Navegação completa
- [ ] Editar orçamento
- [ ] Download de orçamento
- [ ] Histórico completo

### Área do Administrador
- [x] Dashboard com métricas
- [x] Gestão de clientes (CRUD interface)
- [x] Gestão de orçamentos (visualização)
- [x] Regras de cálculo (visualização)
- [x] Busca e filtros
- [x] Navegação completa
- [x] Estatísticas em tempo real
- [ ] CRUD completo de clientes
- [ ] CRUD completo de regras
- [ ] Relatórios e gráficos
- [ ] Configurações do sistema

### Geral
- [x] Autenticação (demo)
- [x] Proteção de rotas
- [x] Design responsivo
- [x] UI moderna e profissional
- [x] Dados simulados realistas
- [x] Integração com banco D1 (planos)

---

## 📝 Páginas Detalhadas

### `/new-quote` - Criar Orçamento
**Campos do Formulário:**
- Tipo de Projeto (select)
- Área Total em m² (number)
- Número de Pavimentos (number)
- Tipo de Acabamento (select)
- Localização (text)
- Observações (textarea)

**Cálculo Automático:**
- Aplica regras do banco de dados
- Mostra valor total
- Mostra valor por m²
- Atualiza em tempo real
- Salva como rascunho

### `/admin/clients` - Gestão de Clientes
**Colunas da Tabela:**
- Cliente (Nome + Email)
- Telefone
- Plano Atual
- Status (Ativo/Inativo)
- Data de Cadastro
- Ações (Editar/Excluir)

**Recursos:**
- Busca por nome ou email
- Filtro por status
- Adicionar novo cliente
- Ordenação por coluna

### `/admin/quotes` - Gestão de Orçamentos
**Colunas da Tabela:**
- Cliente (Nome + Email)
- Projeto (Tipo + Detalhes)
- Área em m²
- Localização
- Valor Estimado
- Status
- Ações (Ver/Download)

**Cards de Resumo:**
- Total de orçamentos
- Orçamentos concluídos
- Valor total gerado

### `/admin/rules` - Regras de Cálculo
**Informações de Cada Regra:**
- Nome da regra
- Tipo de regra
- Status (Ativa/Inativa)
- Valor base (se aplicável)
- Multiplicador
- Condições (JSON)
- Ações (Editar/Excluir)

**Tipos de Regras:**
- Custo Base
- Multiplicador de Projeto
- Multiplicador de Acabamento
- Custo por Pavimento

---

## 🎨 Recursos Visuais

- Cards com ícones coloridos
- Tabelas responsivas
- Badges de status
- Gráficos de barra (distribuição de planos)
- Loading states
- Estados vazios informativos
- Formulários bem estruturados
- Navegação sticky

---

## 💡 Dicas de Uso

1. **Navegação**: Use o menu superior em cada área
2. **Busca**: Todos os listings têm busca integrada
3. **Filtros**: Use filtros para refinar resultados
4. **Ações Rápidas**: Botões no dashboard levam direto às funções
5. **Voltar**: Use o botão "Voltar" ou navegação breadcrumb
6. **Logout**: Sempre disponível no canto superior direito

---

## 🔧 Desenvolvimento Futuro

- Conectar CRUD ao banco de dados real
- Implementar upload de documentos
- Adicionar sistema de notificações
- Criar relatórios em PDF
- Implementar chat de suporte
- Adicionar dashboard de métricas avançadas
- Sistema de permissões granular
- API REST completa
