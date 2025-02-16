import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Email & Password",
      async authorize(credentials) {
        await connectToDatabase();
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const email = credentials.email.toLowerCase();
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordCorrect = bcrypt.compareSync(
          credentials.password,
          user.password
        );
        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectToDatabase();
      let existingUser = await User.findOne({ email: user.email });

      // If user does not exist, create one (Google, GitHub sign-in)
      if (!existingUser) {
        existingUser = await User.create({
          name: user.name,
          email: user.email,
          role: "job-seeker",
        });
      }

      return true; // Continue sign-in process
    },
    async session({ session }) {
      await connectToDatabase();
      const dbUser = await User.findOne({ email: session.user.email });

      if (!dbUser) {
        return session; // Prevent error if user is not found
      }

      session.user.id = dbUser._id.toString();
      session.user.role = dbUser.role;
      return session;
    },
  },
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
