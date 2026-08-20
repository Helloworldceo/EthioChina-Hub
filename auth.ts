import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

const providers: Provider[] = [
  Credentials({
    id: "member-credentials",
    name: "Member",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email as string | undefined;
      const password = credentials?.password as string | undefined;
      if (!email || !password) return null;

      const ip = await clientIp();
      const { allowed } = await checkRateLimit(`login:${ip}:${email}`, 10, 15 * 60 * 1000);
      if (!allowed) return null;

      const member = await prisma.member.findUnique({ where: { email } });
      if (!member?.passwordHash) return null;

      const valid = await bcrypt.compare(password, member.passwordHash);
      if (!valid) return null;

      return {
        id: member.id,
        name: member.name,
        email: member.email,
        role: "member" as const,
        verified: member.verified,
      };
    },
  }),
  Credentials({
    id: "admin-credentials",
    name: "Admin",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email as string | undefined;
      const password = credentials?.password as string | undefined;
      if (!email || !password) return null;

      const ip = await clientIp();
      const { allowed } = await checkRateLimit(`admin-login:${ip}:${email}`, 10, 15 * 60 * 1000);
      if (!allowed) return null;

      const admin = await prisma.admin.findUnique({ where: { email } });
      if (!admin?.passwordHash) return null;

      const valid = await bcrypt.compare(password, admin.passwordHash);
      if (!valid) return null;

      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "admin" as const,
        adminRole: admin.role,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existing = await prisma.member.findUnique({ where: { email: user.email } });
        if (!existing) {
          await prisma.member.create({
            data: {
              email: user.email,
              name: user.name ?? user.email,
              verified: false,
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          const member = await prisma.member.findUnique({ where: { email: user.email! } });
          if (member) {
            token.id = member.id;
            token.role = "member";
            token.verified = member.verified;
          }
        } else {
          token.id = user.id;
          token.role = (user as { role: "member" | "admin" }).role;
          if ("verified" in user) token.verified = user.verified as boolean;
          if ("adminRole" in user) token.adminRole = user.adminRole as string;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "member" | "admin";
        session.user.verified = token.verified as boolean | undefined;
        session.user.adminRole = token.adminRole as string | undefined;
      }
      return session;
    },
  },
});
