// app/Adm/page.tsx
'use client';

import { useSession } from "next-auth/react";
import { Session } from "next-auth";import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface CustomSession extends Session {
  user?: {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    role?: string;
  };
}

const Dashboard = () => {
  const { data: session } = useSession();
    const router = useRouter();
  
    const customSession = session as CustomSession;

    useEffect(()=>{
       if(!customSession?.user){
             router.push('/');
       }else if(customSession?.user?.role !== 'admin'){
             router.push('/');
        }
    }, [customSession,router])
  if (!customSession?.user) {
    return (
       <div>
           <h1>Faça Login</h1>
        </div>
    );
  }
  if (customSession?.user?.role !== "admin") {
    return (
      <div>
        <h1>Acesso negado!</h1>
      </div>
    );
  }
  return (
    <div>
      <h1>Painel de Administração</h1>
      {customSession?.user && <p>Olá, {customSession.user.name}</p>}
    </div>
  );
};

export default Dashboard;