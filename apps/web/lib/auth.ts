import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    // No email verification - users sign up and sign in immediately
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // No-op: email verification disabled
    },
  },
});
