import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

// Function to send email for verification and password reset
async function sendEmail({ to, subject, text }: { to: string, subject: string, text: string }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  });
}

// BetterAuth configuration
export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    emailVerification: {
      // Send verification email on sign up, but don't require the verification yet
      sendOnSignUp: true,
      // For social sign-on, the verification is not required even if the email is not verified, but the verif. email is sent anyway
      sendVerificationEmail: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Confirme seu endereço de e-mail",
          text: `Clique no link para confirmar seu e-mail: ${url}`,
        });
      },
      autoSignInAfterVerification: true
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {  
        enabled: true,
        // In order to require the verification before login, we set requireEmailVerification to true
        requireEmailVerification: false,
        sendResetPassword: async ({user, url}) => {
            await sendEmail({
              to: user.email,
              subject: "Redefina sua senha",
              text: `Clique no link para redefinir sua senha: ${url}`,
            });
        },
    },
    socialProviders: { 
        github: { 
           clientId: process.env.GITHUB_CLIENT_ID as string, 
           clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        },
    }, 
});