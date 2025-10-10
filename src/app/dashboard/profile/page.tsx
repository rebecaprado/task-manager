import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ProfileForm from "profile/components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return <div className="p-3 sm:p-4 md:p-6">Faça login para ver seu perfil.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true },
  });
  if (!user) return <div className="p-3 sm:p-4 md:p-6">Usuário não encontrado.</div>;

  return (
    <div className="mx-auto max-w-3xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <header>
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">Meu Perfil</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Atualize suas informações básicas.</p>
      </header>

      <div className="rounded-xl sm:rounded-2xl border p-3 sm:p-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg sm:text-xl">
              {user.name?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
          <div>
            <div className="font-medium text-sm sm:text-base">{user.name || "Seu nome"}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}