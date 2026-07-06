import NextAuth, { DefaultSession } from "next-auth";

declare module 'next-auth' {
    interface Session {
        user: {
            id: string,
            name: string,
            email: string,
            emailVerification?: boolean,
            role: string,
            image?: string
        } & DefaultSession["user"]
    }
} 