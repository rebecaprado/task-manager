import { authClient } from "@/lib/auth-client";
import { posthog } from "@/Config/posthog";

export async function signIn(email: string, password: string) {
    const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
        rememberMe: false,
    }, {
        onRequest: () => {
            //show loading (already implemented in the component)
        },
        onSuccess: async () => {
            const s = await authClient.getSession();
            const u = s.data?.user;
            if (u?.id) {
              posthog.identify(u.id, { email: u.email });
              posthog.capture("login", { $set: { user_id: u.id, email: u.email } });
            }
        },
        onError: () => {
            // display the error message (already implemented in the component)
        },
    });
    return { data, error };
}