"use server";

import { ref, remove } from "firebase/database";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";
import { database } from "@/_utils/firebase";

interface DeleteBookingParams {
  bookingId: string;
}

export const deleteBooking = async ({ bookingId }: DeleteBookingParams) => {
  try {
    await remove(ref(database, `bookings/${bookingId}`));
    // Como 'toast' é client-side, não funciona diretamente em server actions.
    // Vamos retornar um sucesso e lidar com o toast no cliente.
    revalidatePath("/bookings"); // Revalida a página de reservas
    return { success: true, message: "Reserva cancelada com sucesso!" };
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error);
    return { success: false, message: "Erro ao cancelar reserva. Tente novamente." };
  }
};