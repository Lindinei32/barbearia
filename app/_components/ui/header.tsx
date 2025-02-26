"use client";

import Image from "next/image";
import { Button } from "./button";
import {
  Calendar1Icon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  LogInIcon,
  UserIcon,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { quickSearchOptions } from "@/_constants/search";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { signOut, useSession, signIn } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import SignInDialog from "./sign-in-dialog";
import { Card, CardContent } from "./card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);

  useEffect(() => {
    if (session) {
      console.log("Session no Header:", session);
    }
  }, [session]);

  const handleLogoutClick = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: true, callbackUrl: "/" });
    } catch (error) {
      console.error("Erro ao sair:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithGoogleClick = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/bookings",
      });
      if (result?.error) {
        throw new Error(result.error);
      } else {
        setIsSignInDialogOpen(false);
        router.push("/bookings");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    if (status === "unauthenticated" && path === "/bookings") {
      setIsSignInDialogOpen(true);
    } else {
      router.push(path);
    }
  };

  if (status === "loading") {
    return (
      <Card>
        <CardContent className="flex items-center justify-between p-2">
          <Image src="/logo.png" alt="logo" width={120} height={18} />
          <Button size="icon" disabled>
            <MenuIcon />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-2">
        <Image src="/logo.png" alt="logo" width={120} height={18} />

        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" aria-label="Abrir menu lateral">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-left text-white">Menu</SheetTitle>
            </SheetHeader>

            <div className="flex items-center justify-between gap-3 border-b border-solid border-b-gray-300 p-5">
              {session?.user ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={session.user.image!} 
                      alt={session.user.name || ""}
                    />
                    <AvatarFallback>
                      <UserIcon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-white">{session.user.name}</p>
                    <p className="text-sm text-gray-300">{session.user.email}</p>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-bold text-lg text-white">Olá, faça seu Login</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        aria-label="Fazer login"
                        onClick={() => setIsSignInDialogOpen(true)}
                        disabled={isLoading}
                      >
                        <LogInIcon className="text-white" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90%]">
                      <DialogHeader>
                        <DialogTitle>Faça Seu Login Para Reservar</DialogTitle>
                        <DialogDescription>Conecte-se Usando sua Conta Google</DialogDescription>
                      </DialogHeader>
                      <Button
                        variant="outline"
                        onClick={handleLoginWithGoogleClick}
                        disabled={isLoading}
                        className="bg-white text-black hover:bg-gray-100"
                      >
                        <Image src="/google.svg" width={18} height={18} className="mr-2" alt="Google" />
                        Google
                      </Button>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>

            <div className="flex flex-col gap-2 border-b border-solid border-b-gray-300 py-5">
              <SheetClose asChild>
                <Button className="justify-start gap-2 text-white hover:text-white hover:bg-gray-800" variant="ghost" onClick={() => handleNavigation("/")}>
                  <HomeIcon size={18} className="text-white" />
                  Início
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button className="justify-start gap-2 text-white hover:text-white hover:bg-gray-800" variant="ghost" onClick={() => handleNavigation("/bookings")}>
                  <Calendar1Icon size={18} className="text-white" />
                  Agendamento
                </Button>
              </SheetClose>
            </div>

            <div className="flex flex-col gap-2 border-b border-solid border-b-gray-300 py-5">
              {quickSearchOptions.map((option) => (
                <SheetClose key={option.title} asChild>
                  <Button className="justify-start gap-2 text-white hover:text-white hover:bg-gray-800" variant="ghost" onClick={() => handleNavigation("/")}>
                    <Image
                      alt={option.title}
                      src={option.imageUrl}
                      width={18}
                      height={18}
                      
                    />
                    {option.title}
                  </Button>
                </SheetClose>
              ))}
            </div>

            {session?.user && (
              <div className="flex flex-col gap-2 border-b border-solid border-b-gray-300 py-5">
                <SheetClose asChild>
                  <Button
                    className="justify-start gap-2 text-white hover:text-white hover:bg-gray-800"
                    variant="ghost"
                    onClick={handleLogoutClick}
                    disabled={isLoading}
                  >
                    <LogOutIcon size={18} className="text-white" />
                    {isLoading ? "Saindo..." : "Sair da Conta"}
                  </Button>
                </SheetClose>
              </div>
            )}
          </SheetContent>
        </Sheet>

        <Dialog open={isSignInDialogOpen} onOpenChange={(open) => setIsSignInDialogOpen(open)}>
          <DialogContent className="w-[90%]">
            <SignInDialog />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default Header;