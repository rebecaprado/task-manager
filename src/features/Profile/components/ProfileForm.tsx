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
      image: user.image ?? "",
    },
  });

  const onSubmit = (values: UserProfileForm) => {
    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("image", values.image ?? "");
    startTransition(async () => {
      const res = await updateProfileAction(fd);
      if (res?.success) toast?.success(res.message ?? "Perfil atualizado!");
      else if (res?.issues) toast?.error("Verifique os campos.");
      else toast?.error(res?.message ?? "Erro ao atualizar.");
    });
  };

  return (
    <div className="rounded-2xl border p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">Nome</FormLabel>
                <FormControl>
                  <Input id="name" placeholder="Seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-1">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input id="email" value={user.email} disabled />
            <p className="text-xs text-muted-foreground">Este campo não é editável.</p>
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="image">Avatar URL</FormLabel>
                <FormControl>
                  <Input id="image" placeholder="https://…" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando…" : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}