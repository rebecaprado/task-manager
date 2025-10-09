# Test Plan - Task Manager

Este documento descreve os testes planejados para o projeto **Task Manager**, divididos em níveis: Unitários, Integração e End-to-End (E2E).

---

## ✅ Testes Unitários (Jest)
- [x] `formatDate` retorna datas no formato esperado
- [x] Validação Zod acusa título vazio como erro
- [x] Validação Zod rejeita status inválido
- [x] Validação de `dueDate` não aceita datas passadas
- [x] Cálculo de métricas (tarefas concluídas por dia, tempo médio)
- [x] AuthStore mantém estado do usuário corretamente

---

## 🌐 Testes End-to-End (Playwright)
- [x] Cadastro redireciona para login
- [x] Login sem verificação de email mostra erro 
- [x] Login com email inexistente mostra erro

---

## Observações
- Os testes unitários garantem regras de negócio e funções isoladas.
- Os testes de integração validam a comunicação entre componentes/formulários e actions.
- Os testes E2E validam fluxos críticos do usuário de ponta a ponta.

## Comandos para rodar o Jest
- Pelo nome do teste: pnpm jest -t "formatDate"
- Pelo caminho do arquivo: pnpm jest __tests__/utils/formatDate.test.ts

## Comando para rodar todos os testes Jest de uma vez
pnpm jest --verbose
