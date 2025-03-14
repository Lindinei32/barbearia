import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { redirect } from "next/navigation"

import { getConcludeBookings } from "../_data/get-conclud-bookings"
import { getConfirmadBookings } from "../_data/get-confirmad-bookings"
import Header from "../_components/ui/header"
import BookingItem from "../_components/ui/booking-item"

const Bookings = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/") // Redireciona para a tela de login
  }

  const confirmadBookings = (await getConfirmadBookings()) || []
  const concludedBookings = (await getConcludeBookings()) || [] // Garante um array vazio

  return (
    <>
      <Header />

      <div className="space-y-3 p-5">
        <h1 className="text-xl">Agendamentos</h1>
        {confirmadBookings.length === 0 && concludedBookings.length === 0 && (
          <p className="text-sm text-gray-400">
            Você não possui agendamentos confirmados.
          </p>
        )}

        {/* Agendamentos confirmados */}
        {confirmadBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Confirmados
            </h2>
            {confirmadBookings.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </>
        )}

        {/* Agendamentos finalizados */}
        {concludedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Finalizados
            </h2>
            {concludedBookings.map((booking) => (
              <BookingItem
                key={booking.id}
                booking={JSON.parse(JSON.stringify(booking))}
              />
            ))}
          </>
        )}
      </div>
    </>
  )
}
export default Bookings
