import { authClient } from "@/lib/auth-client";
import { posthog } from "@/Config/posthog";

export async function signOut() {
    posthog.capture("logout", {}, { send_instantly: true });
    try {
      await authClient.signOut();
    } finally {
      posthog.reset();
    }
}