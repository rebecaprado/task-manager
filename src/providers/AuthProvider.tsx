"use client";

import { ReactNode, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { posthog } from "@/Config/posthog";

type Props = { children: ReactNode };

export function AuthProvider({ children }: Props) {
  useEffect(() => {
    async function loadSession() {
      const s = await authClient.getSession();
      const u = s.data?.user;

      if (u?.id) {
        // Identifica sempre que a sessão está ativa
        posthog.identify(u.id, { user_id: u.id, email: u.email });
      } else {
        // Se não tiver usuário, garante que não fica preso ao anterior
        posthog.reset();
      }
    }

    loadSession();
  }, []);

  return <>{children}</>;
}