"use client";

import React, { useMemo } from 'react';

import { format, isFuture, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Booking from '@/types/Booking';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import Image from 'next/image';

import { Card, CardContent } from './card';
import { Service } from './service-item';
import { Badge } from './badge';

interface BookingItemProps {
  booking: Booking;
  services: Service[];
  isConfirmado: boolean;
  onSelect: () => void;
}

const BookingItem = ({ booking, services, isConfirmado, onSelect }: BookingItemProps) => {
  const bookingDate = useMemo(() => new Date(booking.dataAgendamento), [booking.dataAgendamento]);

  // Verifica se a data do agendamento é futura
  const isBookingActive = useMemo(() => {
    if (!isValid(bookingDate)) return false;
    return isFuture(bookingDate);
  }, [bookingDate]);

  if (!isValid(bookingDate)) {
    console.error("Invalid date:", booking.dataAgendamento);
    return <div className="mb-4 rounded-lg bg-gray-800 p-4 text-white shadow-lg">Data inválida</div>;
  }

  return (
    <Card className="mt-6 min-w-[90%]" onClick={onSelect}>
      <CardContent className="flex justify-between p-0">
        <div className="flex flex-col gap-2 py-5 pl-5">
          <Badge
            className="w-fit"
            variant={isBookingActive ? "default" : "destructive"}
          >
            {isBookingActive ? "Confirmado" : "Finalizado"}
          </Badge>
          <h1 className="text-sm font-semibold">
            {booking.serviceName || services[0]?.name || "Serviço Não Encontrado"}
          </h1>
          <div className="flex items-center gap-2">
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={booking.serviceImage || services[0]?.imageUrl || "/no-image.png"} 
                alt={booking.serviceName} 
              />
            </Avatar>
            <p className="text-sm font-bold text-primary">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
              }).format(booking.precoServico)}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
          <p className="text-sm capitalize">
            {format(bookingDate, "MMMM", { locale: ptBR })}
          </p>
          <p className="text-2xl">{format(bookingDate, "d", { locale: ptBR })}</p>
          <p className="text-sm">{booking.horaAgendamento}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingItem;