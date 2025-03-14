"use client"

import { SmartphoneIcon } from "lucide-react"
import { Button } from "./button"
import { toast } from "sonner"

interface PhoneItemProps {
  phone: string
  key: string // Adicionado a prop key
}

const PhoneItem = ({ phone, key }: PhoneItemProps) => {
  // key agora é uma prop
  const handleCopyPhoneClick = (phone: string) => {
    try {
      navigator.clipboard.writeText(phone)
      toast.success("Telefone copiado com sucesso")
    } catch (error) {
      console.error("Erro ao copiar telefone:", error)
      toast.error("Erro ao copiar telefone")
    }
  }

  return (
    <div key={key} className="flex items-center justify-between">
      {" "}
      {/* Usando key */}
      {/* Esquerda */}
      <div className="flex items-center gap-2">
        <SmartphoneIcon />
        <p className="text-sm">{phone}</p>
      </div>
      {/* Direita */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleCopyPhoneClick(phone)}
        aria-label={`Copiar número de telefone ${phone}`}
      >
        Copiar
      </Button>
    </div>
  )
}

export default PhoneItem
