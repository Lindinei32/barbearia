"use client"

import { Barbershop, BarbershopService, Booking } from "@prisma/client"
import Image from "next/image"

import { ptBR } from "date-fns/locale"
import { useEffect, useMemo, useState } from "react"
import { format, isPast, isToday, set } from "date-fns"
import { createBooking } from "../../_actions/create-booking"
import { useSession } from "next-auth/react"
import { Session } from "next-auth"

interface ExtendedSession extends Session {
  user: {
    id: string
    name: string
    email: string
    image: string
  }
}
import { toast } from "sonner"
import { getbookings } from "../../_actions/get-bookings"

import SignInDialog from "./sign-in-dialog"
import { Card, CardContent } from "./card"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./sheet"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Dialog, DialogContent } from "./dialog"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
}

const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
]

interface GetTimeListProps {
  bookings: Booking[]
  selectedDay: Date
}

const getTimeList = ({ bookings, selectedDay }: GetTimeListProps) => {
  return TIME_LIST.filter((time) => {
    const [hour, minutes] = time.split(":").map(Number)

    const timeIsOnThePast = isPast(set(selectedDay, { hours: hour, minutes }))
    if (timeIsOnThePast && isToday(selectedDay)) {
      return false
    }

    const hasBookingOnCurrentTime = bookings.some(
      (booking) =>
        booking.date.getHours() === hour &&
        booking.date.getMinutes() === minutes,
    )
    if (hasBookingOnCurrentTime) {
      return false
    }

    return true
  })
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const { data: session } = useSession() as { data: ExtendedSession | null }
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setselectedTime] = useState<string | undefined>(
    undefined,
  )
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [bookingSheeetIsOpen, setBookingSheeetIsOpen] = useState(false)
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay) return
      const bookings = await getbookings({
        date: selectedDay,
        serviceId: service.id,
      })
      setDayBookings(JSON.parse(JSON.stringify(bookings)))
    }

    fetch()
  }, [selectedDay, service.id])

  const handleBookingClick = () => {
    if (session?.user) {
      return setBookingSheeetIsOpen(true)
    }

    return setSignInDialogIsOpen(true)
  }

  const timeList = useMemo(() => {
    if (!selectedDay) return []

    return getTimeList({
      bookings: dayBookings,
      selectedDay,
    })
  }, [dayBookings, selectedDay])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
  }

  const handleTimeSelected = (time: string) => {
    setselectedTime(time)
  }

  const handleCreateBooking = async () => {
    try {
      if (!selectedDay || !selectedTime) return

      const hour = selectedTime.split(":")[0]
      const minute = selectedTime.split(":")[1]
      const newDate = set(selectedDay, {
        minutes: Number(minute),
        hours: Number(hour),
      })

      await createBooking({
        userId: session?.user?.id ?? "",
        serviceId: service.id,
        date: newDate,
      })
      handleBookingSheeetIsOpen()
      toast.success("Reserva criada com sucesso!")
    } catch (error) {
      console.log(error)
      toast.error("Erro ao criar reserva!")
    }
  }

  const handleBookingSheeetIsOpen = () => {
    setSelectedDay(undefined)
    setselectedTime(undefined)
    setDayBookings([])
    setBookingSheeetIsOpen(false)
  }

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3">
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              alt={service.name}
              src={service.imageUrl}
              fill
              className="rounded-lg object-cover"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}{" "}
              </p>

              <Sheet
                open={bookingSheeetIsOpen}
                onOpenChange={handleBookingSheeetIsOpen}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBookingClick}
                >
                  Reservar
                </Button>

                <SheetContent className="px-0">
                  <SheetHeader>
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="border-b border-solid py-5">
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      selected={selectedDay}
                      onSelect={handleDateSelect}
                      fromDate={new Date()}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          width: "100%",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>

                  {selectedDay && (
                    <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                      {timeList.length > 0 ? (
                        timeList.map((time) => (
                          <Button
                            key={time}
                            variant={
                              selectedTime == time ? "default" : "outline"
                            }
                            className="rounded-full"
                            onClick={() => handleTimeSelected(time)}
                          >
                            {time}
                          </Button>
                        ))
                      ) : (
                        <p className="text-xs">
                          Não há horários disponíveis para este dia.
                        </p>
                      )}
                    </div>
                  )}

                  {selectedTime && (
                    <div className="p-5">
                      <Card>
                        <CardContent className="space-y-3 p-3">
                          <div className="flex items-center justify-between">
                            <h2 className="font-bold">{service.name}</h2>
                            <p className="text-lg font-bold text-primary">
                              {Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(Number(service.price))}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Data</h2>
                            <p className="text-sm capitalize">
                              {selectedDay &&
                                format(selectedDay, "d 'de' MMMM", {
                                  locale: ptBR,
                                })}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Horário</h2>
                            <p className="text-sm">{selectedTime}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Barbearia</h2>
                            <p className="text-sm">{barbershop.name}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <SheetFooter className="mt-5 px-5">
                    <Button
                      className="font-bold"
                      onClick={handleCreateBooking}
                      disabled={!selectedDay || !selectedTime}
                    >
                      Confirmar
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServiceItem
