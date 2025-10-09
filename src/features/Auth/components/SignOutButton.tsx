import { signOut } from "@/lib/user-card";
import { Button } from "ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "authstore/authStore";

export default function SignOutButton() {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);

    async function onClick() {
        // 1. Limpa a store local
        logout();
        
        // 2. Chama o backend para destruir a sessão
        await signOut();
        
        // 3. Redireciona para login
        router.push("/sign-in");
    }

    return (
        <Button className="w-full bg-red-500 text-white hover:bg-red-600 text-sm sm:text-base h-9 sm:h-10" onClick={onClick}>
            Sair
        </Button>
    )
}