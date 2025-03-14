"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { db } from "../_lib/prisma"

export const getConcludeBookings = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user) return [] // Retorna um array vazio se não houver sessão

  return db.booking.findMany({
    where: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userId: (session?.user as any)?.id,
      date: {
        lt: new Date(), // Apenas agendamentos com data menor que hoje
      },
    },
    include: {
      service: {
        include: {
          barbershop: true, // Inclui informações relacionadas à barbearia
        },
      },
    },
    orderBy: {
      date: "asc", // Ordena por data em ordem crescente
    },
  })
}
