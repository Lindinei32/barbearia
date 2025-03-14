import { signIn } from "next-auth/react"
import { DialogTitle, DialogDescription, DialogHeader } from "./dialog"
import { Button } from "./button"
import Image from "next/image"

const handleLoginWithGoogleClick = () => {
  signIn("google")
}

const SignInDialog = () => {
  return (
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
        <Image src="/google.svg" alt="Google" width={18} height={18} />
        Google
      </Button>
    </>
  )
}

export default SignInDialog
