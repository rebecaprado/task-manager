import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
    basePath: "/api/auth"
})

export const signInWithGithub = async () => {
    return await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
    })
}

export const requestPasswordReset = async (email: string) => {
    return await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
    })
}

export async function handleResetPassword(newPassword: string) {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      // Handle the error
      return { error: "Não foi possível resetar a senha" };
    }
    return await authClient.resetPassword({
      newPassword,
      token,
    });
}

export async function resendVerificationEmail(email: string) {
    // BetterAuth usa a rota sendVerificationEmail diretamente
    const response = await fetch('/api/auth/send-verification-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
        throw new Error('Erro ao enviar email');
    }
    
    return await response.json();
}