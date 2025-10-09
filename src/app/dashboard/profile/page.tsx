import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ProfileForm from "profile/components/ProfileForm";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return <div className="p-6">Faça login para ver seu perfil.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true },
  });
  if (!user) return <div className="p-6">Usuário não encontrado.</div>;

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Meu Perfil</h1>
        <p className="text-sm text-muted-foreground">Atualize suas informações básicas.</p>
      </header>

      <div className="rounded-2xl border p-4">
        <div className="flex items-center gap-4">
            {user.image ? (
                <Image src={user.image} alt="Avatar" width={56} height={56} />
            ) : (
                <div className="h-14 w-14 rounded-full bg-gray-300"></div>
            )}
        </div>
        <div>
            <div className="font-medium">{user.name || "Seu nome"}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}