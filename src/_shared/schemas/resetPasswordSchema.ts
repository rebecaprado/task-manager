import { z } from "zod";

export const resetPasswordSchema = z.object({
    newPassword: z.string()
    .min(8, "Senha inválida")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[!@#$%^&*]/, "Senha deve conter pelo menos um caractere especial"),
    confirmNewPassword: z.string()
    .min(8, "Senha inválida")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[!@#$%^&*]/, "Senha deve conter pelo menos um caractere especial"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmNewPassword"],
});

export type ResetPasswordFormSchema = z.infer<typeof resetPasswordSchema>;