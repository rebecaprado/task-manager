"use client";
import { useEffect } from "react";
import { identifyUser } from "utils/analytics";
import { useAuthStore } from "auth/store/authStore";

export default function AuthIdentify() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user?.id) identifyUser({ id: user.id, email: user.email, name: user.name });
  }, [user?.id, user?.email, user?.name]);

  return null;
}