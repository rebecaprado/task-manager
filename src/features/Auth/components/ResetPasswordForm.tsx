"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordFormSchema } from "schemas/resetPasswordSchema";
import { resetPasswordEmailSchema, ResetPasswordEmailFormSchema } from "schemas/resetPasswordEmailSchema";
import { 
    Form, 
    FormControl,
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage,
} from "ui/form";
import { Input } from "ui/input";
import { Button } from "ui/button";
import { Loader2, Lock } from "lucide-react";
import { requestPasswordReset, handleResetPassword } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordForm() {
    const router = useRouter();
    const form = useForm<ResetPasswordFormSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmNewPassword: "",
        }
    })

    // Check if there is a token in the URL to render the correct form
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    if (!token) {
        return <ResetPasswordEmailForm />;
    }

    async function onSubmit(data: ResetPasswordFormSchema) {
        const isPasswordReset = await handleResetPassword(data.newPassword);

        if (!isPasswordReset?.error) {
            toast.success("Senha redefinida com sucesso!");
            router.push("/sign-in");
        }
        else {
            toast.error("Erro ao redefinir senha");
        }
    }

    return (
        <Form {...form}>
            <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 max-w-xs sm:max-w-sm md:max-w-md mt-6 sm:mt-[8vh] md:mt-[10vh] mx-auto p-3 sm:p-4 md:p-6">
                <div className="flex justify-center items-center gap-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Redefina sua senha</h1>
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-center">Digite sua nova senha abaixo</h2>
                <FormField control={form.control} name="newPassword" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nova senha</FormLabel>
                        <FormControl>
                            <Input className="border-zinc-300 border" type="password" placeholder="Nova senha" autoFocus {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="confirmNewPassword" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Confirme sua nova senha</FormLabel>
                        <FormControl>
                            <Input className="border-zinc-300 border" type="password" placeholder="Confirme sua nova senha" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" className="w-full bg-black text-white" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                        <>
                            Redefinindo senha...
                            <Loader2 className="w-4 h-4 animate-spin" />
                        </>
                    ) : (
                        "Redefinir senha"
                    )}
                </Button>
                <Link href="/sign-in" className="block mt-4 text-sm text-blue-600 hover:underline text-center">
                    Voltar para o login
                </Link>
            </form>
        </Form >
    )
}

export function ResetPasswordEmailForm() {
    const form = useForm<ResetPasswordEmailFormSchema>({
        resolver: zodResolver(resetPasswordEmailSchema),
        defaultValues: {
            email: "",
        }
    })

    async function onSubmit(data: ResetPasswordEmailFormSchema) {
        const isEmailSent = await requestPasswordReset(data.email);

        if (isEmailSent?.error) {
            toast.error("Erro ao enviar e-mail de redefinição de senha");
          } else {
            toast.success("E-mail de redefinição de senha enviado com sucesso!");
          }
    }

    return (
        <Form {...form}>
            <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 max-w-xs sm:max-w-sm md:max-w-md mt-6 sm:mt-[8vh] md:mt-[10vh] mx-auto p-3 sm:p-4 md:p-6">
                <div className="flex justify-center content-center gap-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Recupere seu acesso</h1>
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-center">Insira seu e-mail. Se ele existir, enviaremos um link para redefinir sua senha.</h3>
                <FormField 
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input className="border-zinc-300 border" placeholder="E-mail" autoFocus {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full bg-black text-white hover:bg-green-500 hover:text-black text-sm sm:text-base" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                        <>
                            Enviando e-mail...
                            <Loader2 className="w-4 h-4 animate-spin" />
                        </>
                    ) : (
                        "Receber e-mail"
                    )}
                </Button>
                <Link href="/sign-in" className="block mt-2 sm:mt-2 text-sm text-blue-600 hover:underline text-center">
                    Voltar para o login
                </Link>
            </form>
        </Form>
    )
}