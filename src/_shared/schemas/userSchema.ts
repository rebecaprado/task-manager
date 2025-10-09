import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Campo obrigatório"),
  email: z.string().email("E-mail inválido"),
  emailVerified: z.boolean(),
  image: z.string().url("URL de imagem inválida").optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

export const userProfileSchema = z.object({
  name: z.string().min(1, "Campo obrigatório"),
  image: z.union([z.literal(""), z.string().url("URL inválida")])
           .transform((v) => (v === "" ? undefined : v)).optional(),
});
export type UserProfileForm = z.infer<typeof userProfileSchema>;