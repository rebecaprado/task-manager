"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { userProfileSchema } from "schemas/userSchema";

export async function updateProfileAction(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false, message: "Não autenticado." };
  }

  const parsed = userProfileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Dados inválidos.",
      issues: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: parsed.data.name,
      },
    });

    return { success: true, message: "Perfil atualizado com sucesso." };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Erro ao atualizar o perfil." };
  }
}