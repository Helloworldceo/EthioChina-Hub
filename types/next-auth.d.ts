import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "member" | "admin";
      verified?: boolean;
      adminRole?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "member" | "admin";
    verified?: boolean;
    adminRole?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "member" | "admin";
    verified?: boolean;
    adminRole?: string;
  }
}
