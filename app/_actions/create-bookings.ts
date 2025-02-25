// app/_actions/create-booking.ts
"use server";

import { database } from "@/_utils/firebase";
import { Booking } from "@/types/Booking";
import { isSameDay } from "date-fns";
import { get, push, ref, set } from "firebase/database";
import { revalidatePath } from "next/cache";

interface CreateBookingParams {
  serviceId: string;
  userId: string;
  date: Date;
  precoServico: number;
  imagemServico: string;
  userName: string;
  horaAgendamento: string; // Formato esperado: "HH:mm"
  serviceName: string;
}

export const createBooking = async ({
  serviceId,
  userId,
  date,
  precoServico,
  imagemServico,
  userName,
  horaAgendamento,
  serviceName,
}: CreateBookingParams) => {
  try {
    const dataAtual = new Date();

    if (isSameDay(date, dataAtual)) {
      const [horaAgendamentoNumber, minutoAgendamentoNumber] = horaAgendamento.split(":").map(Number);
      const bookingTime = new Date(dataAtual);
      bookingTime.setHours(horaAgendamentoNumber, minutoAgendamentoNumber, 0, 0);

      if (bookingTime < dataAtual) {
        throw new Error("Não é possível agendar para uma data e hora anteriores à atual.");
      }

      if (horaAgendamentoNumber >= 19) {
        throw new Error("Desculpe não é possível Agendar !! Reserve seu horário para Amanhã !!!!");
      }
    }

    const bookingsRef = ref(database, "bookings");
    const bookingsSnapshot = await get(bookingsRef);
    if (bookingsSnapshot.exists()) {
      const bookingsData = bookingsSnapshot.val();
      const bookings = Object.values(bookingsData);

      const reservaExistente = (bookings as Booking[]).find((booking: Booking) => {
        const dataReserva = new Date(booking.dataAgendamento);
        return (
          booking.serviceId === serviceId &&
          isSameDay(dataReserva, date) &&
          booking.horaAgendamento === horaAgendamento
        );
      });

      if (reservaExistente) {
        throw new Error("Já existe uma reserva para esse serviço nesta data e horário.");
      }
    }

    const bookingRef = push(ref(database, "bookings"));
    await set(bookingRef, {
      id: bookingRef.key,
      serviceId: serviceId,
      userId: userId,
      dataAgendamento: date.getTime(), // Salvando como timestamp para consistência
      horaAgendamento: horaAgendamento,
      precoServico: precoServico,
      imagemServico: imagemServico,
      userName: userName,
      serviceName: serviceName,
    });

    revalidatePath("/bookings");
  } catch (error) {
    console.error("Erro ao Criar Reserva:", error);
    throw error;
  }
};