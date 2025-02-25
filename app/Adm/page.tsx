// app/Adm/page.tsx
"use client";
import SidebarSheet from "../_components/ui/SidebarSheet";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';



const ADMIN_EMAIL = "lindineisales4@gmail.com";

export default function Adm() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email !== ADMIN_EMAIL) {
      router.push("/");
    }
  }, [session, router]);

  if (!session) {
    return <p>Acessando...</p>;
  }

  return (
    <div>
      
      <h1>Bem-vindo, Adm</h1>
    </div>
  );
}