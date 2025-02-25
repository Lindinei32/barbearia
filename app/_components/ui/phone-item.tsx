// app/_components/ui/phone-item.tsx
"use client";

import { Button } from "./button";
import { PhoneIcon, CopyIcon } from "lucide-react";

interface PhoneItemProps {
  phone: string;
  onCopy: () => void; // Adicionado aqui
}

const PhoneItem = ({ phone, onCopy }: PhoneItemProps) => {
  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <PhoneIcon size={18} />
        <span>{phone}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={onCopy} aria-label={`Copiar ${phone}`}>
        <CopyIcon size={18} />
      </Button>
    </div>
  );
};

export default PhoneItem;