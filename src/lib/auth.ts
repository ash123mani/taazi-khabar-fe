import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const ENABLE_GOOGLE = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN === 'true';

const providers: any[] = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) return null;

      return {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        is_admin: data.user.is_admin,
        access_token: data.access_token,
      };
    },
  }),
];

if (ENABLE_GOOGLE) {
  const GoogleProvider = require('next-auth/providers/google').default;
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user, account }) {
      if (ENABLE_GOOGLE && account && account.provider === 'google') {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.email,
            name: user?.name,
            google_id: account.providerAccountId,
            avatar_url: (user as any)?.image,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          token.id = data.user.id;
          token.is_admin = data.user.is_admin;
          token.access_token = data.access_token;
        }
      } else if (user) {
        token.id = user.id;
        token.is_admin = (user as any).is_admin;
        token.access_token = (user as any).access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).is_admin = token.is_admin;
        (session as any).access_token = token.access_token;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
