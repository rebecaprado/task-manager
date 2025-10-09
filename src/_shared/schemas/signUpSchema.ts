import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "Campo obrigatório").email("E-mail inválido"),
  password: z.string()
  .min(8, "Senha deve ter pelo menos 8 caracteres")
  .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
  .regex(/[0-9]/, "Senha deve conter pelo menos um número")
  .regex(/[!@#$%^&*]/, "Senha deve conter pelo menos um caractere especial"),
  confirmPassword: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

export type SignUpFormSchema = z.infer<typeof signUpSchema>;