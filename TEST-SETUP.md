# Setup de Testes E2E

Este guia mostra como configurar o usuário de teste para rodar os testes E2E do Playwright.

## 📋 Pré-requisitos

- Banco de dados rodando
- Aplicação rodando (`pnpm dev`)

## 🚀 Configuração do Usuário de Teste

### Passo 1: Criar o usuário manualmente

1. Acesse: http://localhost:3000/sign-up
2. Cadastre com as seguintes credenciais:
   - **Nome:** Playwright Test User
   - **Email:** testuser@playwright.com
   - **Senha:** TestPassword123!

### Passo 2: Marcar como verificado

Depois de criar o usuário, rode o script que marca o email como verificado:

```bash
pnpm test:setup
```

Você verá algo assim:

```
✅ Usuário de teste atualizado!

📋 Credenciais do usuário de teste:
   Email: testuser@playwright.com
   Senha: TestPassword123!
   Email verificado: ✅ true
```

## ✅ Pronto!

Agora você pode rodar os testes E2E:

```bash
# Rodar todos os testes
pnpm test:e2e

# Rodar com interface visual
pnpm test:e2e:ui
```

## 🔑 Credenciais do Usuário de Teste

**Email:** `testuser@playwright.com`  
**Senha:** `TestPassword123!`

> ⚠️ **Nota:** Estas credenciais são **APENAS para testes locais**. Nunca use credenciais reais em testes automatizados!

## 🔄 Resetar o Usuário

Se precisar resetar o usuário de teste:

1. Delete o usuário pelo Prisma Studio: `pnpm studio`
2. Siga o Passo 1 e 2 novamente

