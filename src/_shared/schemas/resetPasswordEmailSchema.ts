import { z } from "zod";

export const resetPasswordEmailSchema = z.object({
    email: z.string().min(1, "Campo obrigatório").email("E-mail inválido")
})

export type ResetPasswordEmailFormSchema = z.infer<typeof resetPasswordEmailSchema>;