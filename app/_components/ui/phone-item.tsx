"use client";

import { SmartphoneIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./button";
import { Sonner } from "sonner";

interface Props {
  phone: string;
}

const PhoneItem = ({ phone }: Props) => {
  const handlerCopyPhoneClick = (phone: string) => {
    
    toast.success("Número de telefone copiado com sucesso!");
  };

  return (
    <div className="phone-container flex justify-between justify-items-center">
      <div className="phone-info flex items-center gap-2">
        <SmartphoneIcon />
        <p className="text-sm">{phone}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlerCopyPhoneClick(phone)}
        className="ml-auto"
      >
        Copiar
      </Button>
    </div>
  );
};

export default PhoneItem;