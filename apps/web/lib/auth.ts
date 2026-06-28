import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: {
		allowedHosts: [
			"*.vercel.app",
		],
		fallback: "wakaima.vercel.app",
	},
  database: prismaAdapter(prisma, {
    provider: "postgresql",
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
