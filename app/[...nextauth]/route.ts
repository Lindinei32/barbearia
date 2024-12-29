// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, Session, DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { database } from '@/app/_utils/firebase';
import { ref, get, set } from 'firebase/database';

interface CustomSession extends Session {
  user?: {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    role?: string;
  };
}
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
  ],
    session: {
        strategy: 'jwt'
    },
  callbacks: {
    async signIn({ user, account, profile }) {
      if(account?.provider === 'google'){
        const userRef = ref(database, `users/${user.id}`);
        const userSnapshot = await get(userRef)
        if(!userSnapshot.exists()){
          await set(userRef,{
            name: user.name,
            email: user.email,
            role: 'user',
            uid: user.id,
          })
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
        if (url.startsWith(baseUrl)) return url
        if (url.startsWith('/')) return new URL(url, baseUrl).href
          return baseUrl
     },
    async session({ session, token, user}) {
        if(session?.user){
             const userRef = ref(database, `users/${user.id}`);
             const userSnapshot = await get(userRef);
             const customSession = {
                 ...session,
                  user: {
                    ...session.user,
                     role: userSnapshot.val()?.role || 'user'
                   }
            }
        return customSession as CustomSession;
      }
        return session as CustomSession
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };