import { test, expect } from '@playwright/test';

test('cadastro redireciona para login', async ({ page }) => {
    const timestamp = Date.now();
    
    await page.goto('/sign-up')
    
    await page.fill('[name="name"]', `Test User ${timestamp}`)
    await page.fill('[name="email"]', `test${timestamp}@example.com`)
    await page.fill('[name="password"]', 'Password123!')
    await page.fill('[name="confirmPassword"]', 'Password123!')
    await page.click('button[type="submit"]')
    
    // Verifica que redireciona para sign-in após cadastro
    await expect(page).toHaveURL('/sign-in', { timeout: 10000 })
})

test('login sem verificação de email mostra erro', async ({ page }) => {
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    
    // Criar conta
    await page.goto('/sign-up')
    
    await page.fill('[name="name"]', `Test User ${timestamp}`)
    await page.fill('[name="email"]', email)
    await page.fill('[name="password"]', 'Password123!')
    await page.fill('[name="confirmPassword"]', 'Password123!')
    await page.click('button[type="submit"]')
    
    // Aguarda redirecionamento para sign-in
    await page.waitForURL('/sign-in', { timeout: 10000 })
    
    // Tenta fazer login (sem verificar email)
    await page.fill('[name="email"]', email)
    await page.fill('[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    
    // Verifica que mostra mensagem de erro de email não verificado
    await expect(page.locator('text=Por favor, confirme seu e-mail')).toBeVisible({ timeout: 5000 })
})

test('login com email inexistente mostra erro', async ({ page }) => {
    await page.goto('/sign-in')
    
    await page.fill('[name="email"]', 'naocadastrado@example.com')
    await page.fill('[name="password"]', 'Password123!')
    
    // Aguarda a resposta da API
    const responsePromise = page.waitForResponse(resp => 
        resp.url().includes('/api/auth') && resp.request().method() === 'POST'
    );
    
    await page.click('button[type="submit"]')
    await responsePromise;
    
    // Procura pela mensagem de erro - usando contém ao invés de texto exato
    await expect(page.locator('text=E-mail ou senha inválidos')).toBeVisible({ timeout: 5000 })
})