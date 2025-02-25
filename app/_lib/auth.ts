import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { Database, ref, get, set } from 'firebase/database';
import { database } from '@/_utils/firebase';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

// Função para sanear o email removendo caracteres inválidos
const sanitizeEmailForFirebase = (email: string | null | undefined): string => {
  if (!email) return 'unknown';
  // Substitui caracteres inválidos por '-'
  return email.replace(/[.#$\[\]]/g, '-');
};

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google') {
          // Cria um credential do Google a partir do token de ID fornecido pelo NextAuth
          const credential = GoogleAuthProvider.credential(account.id_token);
          
          // Autentica o usuário no Firebase usando o credential
          const result = await signInWithCredential(getAuth(), credential);
          const uid = result.user.uid; // Obtém o UID real do usuário do Firebase

          const userRef = ref(database, `User/${uid}`);
          const userSnapshot = await get(userRef);
          if (!userSnapshot.exists()) {
            // Se o usuário não existe, criamos um novo registro
            await set(userRef, {
              email: user.email,
              name: user.name,
              role: user.email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
              firebaseUid: uid,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              photo: user.image,
            });
          } else {
            // Se o usuário já existe, apenas atualizamos o updatedAt
            await set(ref(database, `User/${uid}/updatedAt`), Date.now());
          }
        }
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        name: token.name,
        email: token.email,
        image: token.image,
      };
      return session;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  pages: {
    signIn: '/entrar',
    signOut: '/sair',
    error: '/erro',
  },
};

export default authOptions;