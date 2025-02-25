// next-auth.d.ts
import { Session } from 'next-auth';
import { CustomUser } from '@/app/types'; // Assuming CustomUser is defined in this location, adjust if needed

// extend.d.ts

export interface CustomUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export interface CustomSession {
  user?: CustomUser;
}

declare module 'next-auth' {
  /**
   * Extende a interface Session para incluir CustomUser como user.
   * Isso permite que a propriedade 'role' seja reconhecida em session.user.
   */
  interface Session {
    user: CustomUser;
  }
}

declare module 'next-auth/react' {
  /**
   * Repete a extensão para o módulo 'next-auth/react' para consistência.
   */
  interface Session {
    user: CustomUser;
  }
}