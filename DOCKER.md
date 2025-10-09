# 🐳 Guia Docker - Task Manager

Este guia mostra como rodar o projeto completo usando Docker e Docker Compose.

## 📋 Pré-requisitos

- Docker instalado
- Docker Compose instalado

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd task-manager
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
# Better Auth
BETTER_AUTH_SECRET=seu-secret-aqui-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Database (não altere - usado pelo Docker)
DATABASE_URL="postgresql://postgres:postgres@db:5432/taskmanager"
DIRECT_URL="postgresql://postgres:postgres@db:5432/taskmanager"

# Github OAuth (opcional)
GITHUB_CLIENT_ID=seu-client-id
GITHUB_CLIENT_SECRET=seu-client-secret

# Email (configure com suas credenciais)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
EMAIL_FROM="Task Manager <seu-email@gmail.com>"

# PostHog (opcional)
NEXT_PUBLIC_POSTHOG_KEY=sua-key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### 3. Suba os containers

```bash
docker-compose up -d
```

Isso vai:
- ✅ Criar container PostgreSQL na porta 5432
- ✅ Criar container da aplicação na porta 3000
- ✅ Conectar os dois automaticamente
- ✅ Criar volume persistente para os dados

### 4. Rode as migrations

```bash
docker-compose exec app npx prisma migrate deploy --schema=database/schema.prisma
```

### 5. Acesse a aplicação

Abra: http://localhost:3000

## 🛠️ Comandos úteis

```bash
# Ver logs
docker-compose logs -f

# Parar os containers
docker-compose down

# Parar e APAGAR os dados
docker-compose down -v

# Reconstruir containers após mudanças no código
docker-compose up -d --build

# Acessar o banco de dados
docker-compose exec db psql -U postgres -d taskmanager
```

## 📦 O que está configurado

- **PostgreSQL 15:** Banco de dados local
- **Next.js:** Aplicação rodando em produção
- **Volumes:** Dados persistem mesmo após reiniciar containers
- **Health Check:** App só inicia quando DB estiver pronto

## ⚠️ Importante

Este Docker é para **desenvolvimento local**. Para produção, use:
- Vercel para deploy do app
- Supabase para banco de dados

