"use client";

// ADICIONAR ESQUECI SENHA
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
import { loginSchema, LoginForm } from "schemas/loginSchema";
import { useAuthStore } from "authstore/authStore";
import { signIn } from "@/lib/sign-in";
import { Loader2, LogIn, Computer } from "lucide-react";
import { signInWithGithub } from "@/lib/auth-client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  // Get the setUser function from the auth store
  const setUser = useAuthStore((state) => state.setUser);

  // Define the form
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginForm) {
    // Call the signIn function
    const result = await signIn(data.email, data.password);

    // If the user's email is not verified, display error
    if (result?.error?.status === 403) {
      form.setError("email", {
        message: "Por favor, confirme seu e-mail para acessar sua conta.",
      });
      return;
    }

    // If there is an error, show it
    if (result?.error) {
      form.setError("root", {
        message: "E-mail ou senha inválidos. Tente novamente.",
      });
      return;
    }

    // If there is no error, set the user in the auth store
    setUser(
      result?.data?.user
        ? { ...result.data.user, image: result.data.user.image ?? undefined }
        : null
    );
    setTimeout(() => {
      router.replace(callbackUrl);
    }, 100);
  }

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 max-w-xs sm:max-w-sm md:max-w-md mt-4 sm:mt-6 md:mt-[8vh] lg:mt-[10vh] mx-auto p-3 sm:p-4 md:p-6">
        <div className="flex justify-center items-center gap-1.5 sm:gap-2">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">Acesse sua conta</h1>
          <LogIn className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </div>
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
        <div className="text-right">
          <Link href="/reset-password" className="text-xs sm:text-sm text-blue-600 hover:underline">
            Esqueci minha senha
          </Link>
        </div>
        {form.formState.errors.root && (
        <p className="text-xs sm:text-sm text-red-500">
          {form.formState.errors.root.message}
        </p>
        )}
        <Button type="submit" className="w-full bg-black text-white hover:bg-green-500 hover:text-black text-sm sm:text-base h-10 sm:h-11" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
        <div className="flex justify-center">
          <Button type="button" onClick={signInWithGithub} className="w-full border-zinc-300 border bg-white text-black flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base h-10 sm:h-11 py-2 sm:py-2.5 hover:bg-gray-300 transition-colors">
            Entre com GitHub
            <Computer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </div>
        <div className="text-center">
          <Link href="/sign-up" className="text-xs sm:text-sm text-blue-600 hover:underline">
            Não tem uma conta? Cadastre-se
          </Link>
        </div>
      </form>
    </Form>
  )
}