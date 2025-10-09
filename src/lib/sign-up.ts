import { authClient } from "@/lib/auth-client"; //import the auth client
 
export async function signUp(email: string, password: string, name: string, image?: string) {
    const { data, error } = await authClient.signUp.email({
        email,
        password, // user password -> min 8 characters by default
        name,
        image, // User image URL (optional)
        callbackURL: "/sign-in"
    }, {
        onRequest: () => {
            //show loading (already implemented in the component)
        },
        onSuccess: () => {
            //redirect to the sign-in page (already implemented in the component)
        },
        onError: () => {
            // display the error message (already implemented in the component)
        },
    });
    return { data, error };
}