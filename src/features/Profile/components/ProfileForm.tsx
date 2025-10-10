"use client";

import * as React from "react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileSchema, type UserProfileForm } from "schemas/userSchema";
import { updateProfileAction } from "../actions/$updateProfile_actions";
import { Button } from "ui/button";
import { Input } from "ui/input";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "ui/form";
import { toast } from "sonner";

type Props = {
  user: { name: string | null; email: string; image: string | null };
};

export default function ProfileForm({ user }: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UserProfileForm>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: user.name ?? "",
    },
  });

  const onSubmit = (values: UserProfileForm) => {
    const fd = new FormData();
    fd.append("name", values.name);
    startTransition(async () => {
      const res = await updateProfileAction(fd);
      if (res?.success) toast?.success(res.message ?? "Perfil atualizado!");
      else if (res?.issues) toast?.error("Verifique os campos.");
      else toast?.error(res?.message ?? "Erro ao atualizar.");
    });
  };

  return (
    <div className="rounded-xl sm:rounded-2xl border p-3 sm:p-4 md:p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3 sm:gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name" className="text-sm sm:text-base">Nome</FormLabel>
                <FormControl>
                  <Input id="name" placeholder="Seu nome" className="text-sm sm:text-base h-10 sm:h-11" {...field} />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />

          <div className="grid gap-1 sm:gap-1.5">
            <label className="text-sm sm:text-base font-medium" htmlFor="email">Email</label>
            <Input id="email" value={user.email} disabled className="text-sm sm:text-base h-10 sm:h-11 bg-gray-100" />
            <p className="text-[10px] sm:text-xs text-muted-foreground">Este campo não é editável.</p>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto text-sm sm:text-base h-10 sm:h-11">
              {isPending ? "Salvando…" : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}