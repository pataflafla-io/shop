import { NextRequest } from 'next/server';
import bcrypjs from 'bcryptjs';
import NextAuth, { Session, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import z from 'zod';
import prisma from './lib/prisma';

const protectedRoutes: string[] = ['/checkout', '/checkout/address', '/orders', '/profile'];

export const authConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  callbacks: {
    // https://next-auth.js.org/configuration/callbacks
    authorized: async (params: { request: NextRequest; auth: Session | null }) => {
      const { auth: authorizedUser, request } = await params;
      const isUserLoggedIn = !!authorizedUser?.user;
      const urlRequest = request;
      const pathname = request.nextUrl.pathname;

      if (protectedRoutes.includes(pathname)) {
        if (isUserLoggedIn) {
          return true;
        }
        return false;
      } else if (isUserLoggedIn) {
        Response.redirect(new URL('', urlRequest.nextUrl.href));
      }

      return true;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.data = user;
      }

      return token;
    },
    session: ({ session, token, user }) => {
      // En éste punto hay que chequear si el usuario
      // validó por email; también, si la bd del User
      // tuviera una columna de isActive (actualmente no
      // definida) la cual funcionaría como Usuario baneado.
      session.user = token.data as any;
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        // Si pasa la validación de Zod entonces
        // obtenemos el email y el password ingresado para realizar
        // la validación contra la BD si el usuario existe y todo eso.
        // Importante: todo ésto sucede en el backend
        const { email, password } = parsedCredentials.data;

        // Buscamos usario en la BD
        const user = await prisma.user.findFirst({ where: { email: email.toLowerCase() } });

        // Existe el usuario?
        if (!user) {
          return null;
        }

        // Confirmamos password
        if (!bcrypjs.compareSync(password, user.password)) {
          return null;
        }

        // Si hay match entonces devolvemos el usuario
        // para que sea parte de la sesión.
        // No queremos que el password viaje en las
        // peticiones http, hacemos rest del objeto
        // devuelto por la consulta.
        const { password: _, ...rest } = user;

        return rest;
      },
    }),
  ],
} satisfies NextAuthConfig;

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
