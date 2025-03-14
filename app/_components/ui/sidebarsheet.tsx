"use client"

import { Calendar1Icon, HomeIcon, LogOutIcon, MenuIcon } from "lucide-react"
import Link from "next/link"
import { quickSearchOptions } from "@/app/_constants/search"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "./dialog"
import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarImage } from "./avatar"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"
import { Button } from "./button"
import SignInDialog from "./sign-in-dialog"

const SidebarSheet = () => {
  const { data } = useSession()

  const handleLogoutClick = () => signOut()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        <div className="flex items-center justify-between gap-3 border-b border-solid border-b-gray-300 p-5">
          {data?.user ? (
            <div className="flex items-center gap-2">
              <Avatar>
                {data?.user?.image ? (
                  <AvatarImage
                    src={data.user.image}
                    width={18}
                    height={18}
                    onError={(event) => {
                      console.error(
                        "Erro ao carregar a imagem do usuário:",
                        event,
                      )
                      event.currentTarget.style.display = "none"
                    }}
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                    <span className="text-xl font-semibold uppercase">
                      {data.user.name?.charAt(0).toUpperCase() ?? "?"}
                    </span>
                  </div>
                )}
              </Avatar>
              <div>
                <p className="font-bold">{data.user.name}</p>
                <p className="text-sm">{data.user.email}</p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-bold">Olá, Faça seu Login!</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon">
                    <LogOutIcon />
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
                <Link href={`/`}>
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
        {data?.user && (
          <div className="flex flex-col gap-2 border-b border-solid py-5">
            <Button
              className="justify-start gap-2"
              variant="ghost"
              onClick={handleLogoutClick}
            >
              <LogOutIcon size={18} />
              Sair da Conta
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default SidebarSheet
