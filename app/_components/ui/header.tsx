import Image from "next/image"
import { Card, CardContent } from "./card"
import { Button } from "./button"
import { Calendar1Icon, HomeIcon, icons, LogIn, LogInIcon, LogOutIcon, MenuIcon } from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"
import { quickSearchOptions } from "@/app/_constants/search"
import { Avatar, AvatarImage } from "./avatar"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./dialog"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"

const Header = () => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-2">
        <Image src="/logo.png" alt="logo" width={120} height={18} />

        <Sheet>
          <SheetTrigger asChild>
            <Button size={"icon"} variant={"outline"}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>

            <div className="flex items-center justify-between gap-3 border-b border-solid border-b-gray-300 p-5">
              <h2 className="font-bold text-lg ">Olá,  Faça Seu Login </h2>
                <Dialog>
                <DialogTrigger asChild>
                <Button size="icon">
                  <LogInIcon   />                
                </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%]">
                  <DialogHeader>
                      <DialogTitle>
                        Faça Seu Login Para Reservar 
                      </DialogTitle>
                      <DialogDescription>
                          Conecte-se Usando sua Conta Google
                      </DialogDescription>
                  </DialogHeader>
                    <Button variant="outline">
                      <Image src="/google.svg" width={18} height={18} className="gap-1 font-bold" alt="Google" />
                      Goolge
                    </Button>
                  </DialogContent>                  
                </Dialog>
                             {/*<Avatar>
                  <AvatarImage src="https://utfs.io/f/3bcf33fc-988a-462b-8b98-b811ee2bbd71-17k.png" />
                </Avatar>

                <div className="ml-3">
                  <p className="font-bold">Lindinei</p>
                  <p className="text-sm">Lindineisales0@gmail.com</p>
                </div> */}

            </div>

            <div className="flex flex-col gap-2 border-b border-solid border-b-gray-300 py-5">
              <SheetClose asChild>
              <Button className="justify-start gap-2" variant="ghost" asChild>
                <Link href="/">
                <HomeIcon size={18} />
                Início 
                </Link>
              </Button>
              </SheetClose>
              <Button className="justify-start gap-2" variant="ghost">
                <Calendar1Icon />
                Agendamentos
              </Button>
            </div>

            <div className="flex flex-col border-b border-solid border-b-gray-300 py-5">
                {quickSearchOptions.map((option) => (
                  <Button
                  key={option.title} 
                  className="justify-start gap-2"
                   variant="ghost">
                    <Image src={option.imageUrl}
                     height={18}
                      width={18}
                      alt={option.title}
                      /> 
                     {option.title}
                  </Button>
                ))}
            </div>
            <div className="flex flex-col gap-3 border-b-gray-300 py-5">
                <Button className="justify-start gap-2" variant="ghost">
                   <LogOutIcon />
                    Sair da Conta
                  </Button>
            </div>

          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  )

}
export default Header
