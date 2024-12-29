"use client";

import { Button } from "./button";
import { Calendar1Icon, HomeIcon, LogOutIcon, MenuIcon, LogInIcon } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import Link from "next/link";
import { quickSearchOptions } from "@/app/_constants/search";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from "./dialog";
import { signOut, useSession, signIn } from "next-auth/react";
import { Avatar, AvatarImage } from "./avatar";


const SidebarSheet = () => {
    const { data: session } = useSession();
  const handleLogoutClick = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };
    const handleLoginWithGoogleClick = async () => {
        try {
            await signIn('google', {
                redirect: false,
                callbackUrl: '/',
            });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        }
    };

  return (
      <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        <div className="flex items-center justify-between gap-3 border-b border-solid border-b-gray-300 p-5">
          {session?.user ? (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={session.user?.image ?? ""} />
              </Avatar>
              <div>
                <p className="font-bold">{session?.user?.name}</p>
                <p className="text-sm">{session?.user?.email}</p>
              </div>
            </div>
          ) : (
            <h2 className="font-bold">Olá, Faça seu Login!</h2>
          )}
             <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon">
                      {session?.user ? <LogOutIcon/> : <LogInIcon/>}
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%]">
                    {!session?.user ? (
                         <>
                            <DialogHeader>
                                  <DialogTitle>Faça Login na Plataforma</DialogTitle>
                                  <DialogDescription>
                                   Conecte-se usando a sua Conta Google
                                  </DialogDescription>
                             </DialogHeader>
                              <Button
                                variant="outline"
                                className="gap-1 font-bold"
                                onClick={handleLoginWithGoogleClick}
                              >
                                <Image
                                  src="/google.svg"
                                  alt="Google"
                                   width={18}
                                   height={18}
                                />
                                Google
                            </Button>
                       </>
                    ) : (
                        <div className='flex flex-col'>
                            <p className='text-center font-bold'>Deseja sair da sua conta?</p>
                            <Button onClick={handleLogoutClick} variant='outline' className='mt-2'>Sair da conta</Button>
                         </div>
                     )}
                </DialogContent>
            </Dialog>
        </div>

        <div className="flex flex-col gap-2 border-b border-solid border-neutral-500 py-5">
          <SheetClose asChild>
            <Button className="justify-start gap-2" variant="ghost" asChild>
              <Link href="/">
                <HomeIcon size={18} />
                Inicio
              </Link>
            </Button>
          </SheetClose>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/bookings">
              <Calendar1Icon size={18} />
              Agendamento
            </Link>
          </Button>
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
      </SheetContent>
    </Sheet>
  );
};

export default SidebarSheet;