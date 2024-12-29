"use client"

import Image from "next/image"
import { Card, CardContent } from "./card"
import { Button } from "./button"


export interface Service {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
}

export interface Barbearia {
  id: string
  name: string
  description: string
  address: string
  imageUrl: string
  phones: string[]
}

interface Props {
  service: Service
}

const ServiceItem = ({ service }: Props) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 ">
        <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
          <Image
            alt={service.name}
            src={service.imageUrl}
            fill
            className="rounded-ld object-cover"
          />
        </div>

        {/*Direita */}
        <div className="space-y-3">
          <h3 className="font-semibold">{service.name}</h3>
          <p className="text-sm text-gray-400">{service.description}</p>

          {/* Preço e botão */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-primary">
              R$ R${" "}
              {service.price.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>

            <Button variant="secondary" size="sm">
              {" "}
              Reservar{" "}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServiceItem
