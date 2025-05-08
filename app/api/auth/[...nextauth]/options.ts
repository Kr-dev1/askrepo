import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        identifier: { type: "text", label: "identifier" },
        password: { type: "text", label: "Password" },
      },
      authorize: async (credentials) => {
        let user = null;
        const identifier = credentials.identifier as string;
        const password = credentials.password as string;
        try {
          const findExisting = await prisma.user.findFirst({
            where: {
              OR: [
                { name: { equals: identifier } },
                { email: { equals: identifier } },
              ],
            },
          });
          if (!findExisting) {
            throw new Error("No user found");
          }
          user = findExisting;
          const checkPassword = await bcrypt.compare(
            password,
            findExisting.password || ""
          );
          if (!checkPassword) {
            throw new Error("Invalid email/username or password");
          }
          return {
            id: user.id,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            name: user.name,
          };
        } catch (err: any) {
          throw new Error(
            "There was an error logging in please try again later"
          );
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || user.email!.split("@")[0],
                password: "",
              },
            });
          }
          user.id = existingUser?.id as string;
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
