"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

interface User {
  id: string
  name: string
  email: string
  image: string
}

interface CreateBookingParams {
  userId: string
  serviceId: string
  date: Date
}

export const createBooking = async (params: CreateBookingParams) => {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    throw new Error("Usuário não autenticado")
  }

  const user = session.user as User

  await db.booking.create({
    data: { ...params, userId: user.id }, // Usando user.id diretamente
  })
  await revalidatePath("/")
}
