"use client";

import { Button } from "ui/button";
import { Input} from "ui/input";
import { 
    Form, 
    FormControl,
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage,
} from "ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpSchema, SignUpFormSchema } from "schemas/signUpSchema";
import { User, Loader2 } from 'lucide-react';
import { signUp } from "@/lib/sign-up";
import { signIn } from "@/lib/sign-in";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInWithGithub } from "@/lib/auth-client";
import { Computer } from "lucide-react";
import { useAuthStore } from "authstore/authStore";

export default function SignUpForm() {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    const form = useForm<SignUpFormSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data: SignUpFormSchema) {
        const result = await signUp(data.email, data.password, data.name);

        // If the backend returns error 422 (email already registered)
        if (result?.error?.status === 422) {
            form.setError("email", {
                message: "E-mail já cadastrado.",
            });
            return;
        }

        // '?' -> guarantee that if the error is null/undefined, it does not throw an error
        // If it's null/undefined, it means that there is no error
        if (result?.error) {
            form.setError("root", {
                message: "Erro ao criar conta. Tente novamente.",
            });
            return;
        }

        // If there's no error, login automatically
        toast.success("Conta criada com sucesso!");
        
        // Auto login após cadastro
        const loginResult = await signIn(data.email, data.password);
        
        if (!loginResult?.error) {
            // Set user in store
            setUser(
                loginResult?.data?.user
                    ? { ...loginResult.data.user, image: loginResult.data.user.image ?? undefined }
                    : null
            );
            // Redirect to dashboard
            setTimeout(() => {
                router.replace("/dashboard");
            }, 100);
        } else {
            // Se falhar o auto-login, vai para sign-in
            router.push("/sign-in");
        }
    }

    return (
        <Form {...form}>
            <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 max-w-xs sm:max-w-sm md:max-w-md mt-4 sm:mt-6 md:mt-[8vh] lg:mt-[10vh] mx-auto p-3 sm:p-4 md:p-6">
                <div className="flex justify-center items-center gap-1.5 sm:gap-2">
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">Crie sua conta</h1>
                    <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base">Nome de usuário</FormLabel>
                            <FormControl>
                                <Input className="border-zinc-300 border text-sm sm:text-base h-10 sm:h-11" placeholder="Nome de usuário" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base">E-mail</FormLabel>
                            <FormControl>
                                <Input className="border-zinc-300 border text-sm sm:text-base h-10 sm:h-11" placeholder="E-mail" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base">Senha</FormLabel>
                            <FormControl>
                                <Input className="border-zinc-300 border text-sm sm:text-base h-10 sm:h-11" type="password" placeholder="Senha" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base">Confirme sua senha</FormLabel>
                            <FormControl>
                                <Input className="border-zinc-300 border text-sm sm:text-base h-10 sm:h-11" type="password" placeholder="Confirme sua senha" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                    )}
                />
                {form.formState.errors.root && (
                <p className="text-xs sm:text-sm text-red-500">
                    {form.formState.errors.root.message}
                </p>
                )}
                <Button type="submit" className="w-full bg-black text-white hover:bg-green-500 hover:text-black text-sm sm:text-base h-10 sm:h-11" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                            Criando conta...
                        </>
                    ) : (
                        <>
                            Criar conta
                        </>
                    )}
                </Button>
                <div className="flex justify-center">
                    <Button type="button" onClick={signInWithGithub} className="w-full border-zinc-300 border bg-white text-black flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base h-10 sm:h-11 py-2 sm:py-2.5 hover:bg-gray-300 transition-colors">
                        Continue com GitHub
                        <Computer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                </div>
            </form>
        </Form>
    )
}