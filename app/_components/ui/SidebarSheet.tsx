"use client";

import { Button } from "./button";
import {
  Calendar1Icon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  LogInIcon,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import Link from "next/link";
import { quickSearchOptions } from "@/_constants/search";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "./dialog";
import { signOut, useSession, signIn } from "next-auth/react";
import { Avatar, AvatarImage } from "./avatar";
import SignInDialog from "./sign-in-dialog";
import { useState } from "react";

const SidebarSheet = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false); // Estado para carregamento

  const handleLogoutClick = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error("Erro ao sair:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithGoogleClick = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        redirect: false,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderização condicional enquanto a sessão está carregando
  if (status === "loading") {
    return (
      <Button size="icon" disabled>
        <MenuIcon />
      </Button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" aria-label="Abrir menu lateral">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        <div className="flex items-center justify-between gap-3 border-b border-solid border-b-gray-300 p-3">
          {session?.user ? (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={session.user.image ?? ""} alt={session.user.name ?? "Usuário"} />
              </Avatar>
              <div>
                <p className="font-bold">{session.user.name ?? "Usuário"}</p>
                <p className="text-sm">{session.user.email ?? ""}</p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-bold">Olá, faça seu Login</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    aria-label="Fazer login"
                    onClick={handleLoginWithGoogleClick}
                    disabled={isLoading}
                  >
                    <LogInIcon />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%]">
                  <SignInDialog />
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 border-b border-solid border-neutral-500 py-5">
          <SheetClose asChild>
            <Button className="justify-start gap-2" variant="ghost" asChild>
              <Link href="/">
                <HomeIcon size={18} />
                Início
              </Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button className="justify-start gap-2" variant="ghost" asChild>
              <Link href="/bookings">
                <Calendar1Icon size={18} />
                Agendamento
              </Link>
            </Button>
          </SheetClose>
        </div>

        <div className="flex flex-col gap-2 border-b border-solid border-neutral-500 py-5">
          {quickSearchOptions.map((option) => (
            <SheetClose key={option.title} asChild>
              <Button className="justify-start gap-2" variant="ghost" asChild>
                <Link href={`/barbershops?service=${option.title}`}>
                  <Image
                    alt={option.title}
                    src={option.imageUrl}
                    width={18}
                    height={18}
                  />
                  {option.title}
                </Link>
              </Button>
            </SheetClose>
          ))}
        </div>

        {session?.user && (
          <div className="flex flex-col gap-2 border-b border-solid border-neutral-500 py-5">
            <SheetClose asChild>
              <Button
                className="justify-start gap-2"
                variant="ghost"
                onClick={handleLogoutClick}
                disabled={isLoading}
              >
                <LogOutIcon size={18} />
                {isLoading ? "Saindo..." : "Sair da Conta"}
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SidebarSheet;