// app/_components/ui/service-item.tsx
"use client";

import Image from "next/image";
import { ptBR } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { format, isPast, isSameDay, isToday, set } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { database } from "@/_utils/firebase";
import { ref, onValue } from "firebase/database";
import { createBooking } from "@/_actions/create-bookings";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "./sheet";
import { Card, CardContent } from "./card";
import { Dialog, DialogContent } from "./dialog";
import SignInDialog from "./sign-in-dialog";
import { Button } from "./button";
import { Calendar } from "./calendar";

export interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
}

interface Booking {
  id: string;
  userId: string;
  userName: string;
  serviceId: string; // Corrigido de servicoId para serviceId
  dataAgendamento: string;
  horaAgendamento: string;
  imagemServico: string;
  precoServico: number;
}

interface CreateBookingParams {
  serviceId: string;
  userId: string;
  date: Date;
  precoServico: number;
  imagemServico: string;
  userName: string;
  horaAgendamento: string;
  serviceName: string;
}

interface Props {
  service: Service;
}

interface GetTimeListProps {
  bookings: Booking[];
  selectedDay: Date;
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
];

const getTimeList = ({ bookings, selectedDay }: GetTimeListProps) => {
  return TIME_LIST.filter((time) => {
    const [hour, minute] = time.split(":").map(Number);
    const currentTime = set(new Date(), { hours: hour, minutes: minute });
    const timeIsOnThePast = isPast(currentTime) && isToday(selectedDay);
    if (timeIsOnThePast) {
      return false;
    }

    const hasBookingOnCurrentTime = bookings.some((booking) => {
      const bookingDate = new Date(booking.dataAgendamento);
      return (
        isSameDay(bookingDate, selectedDay) &&
        booking.horaAgendamento === time &&
        booking.serviceId === booking.serviceId // Corrigido para usar o serviceId correto
      );
    });

    if (hasBookingOnCurrentTime) {
      return false;
    }
    return true;
  });
};

const ServiceItem = ({ service }: Props) => {
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    const bookingsRef = ref(database, "bookings");
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      if (selectedDay) {
        if (snapshot.exists()) {
          const fetchedBookings = Object.values(snapshot.val()) as Booking[];
          const bookingsForDayAndService = fetchedBookings.filter((booking) => {
            const bookingDate = new Date(booking.dataAgendamento);
            return (
              isSameDay(bookingDate, selectedDay) &&
              booking.serviceId === service.id
            );
          });
          setDayBookings(bookingsForDayAndService);
        } else {
          setDayBookings([]);
        }
      }
    });

    return () => unsubscribe();
  }, [selectedDay, service.id, status]);

  const handleBookingClick = () => {
    if (status === "loading") return;
    if (!session?.user) {
      setSignInDialogIsOpen(true);
    } else {
      setBookingSheetIsOpen(true);
    }
  };

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(undefined);
    setSelectedTime(undefined);
    setDayBookings([]);
    setBookingSheetIsOpen(false);
  };

  const handleDaySelect = (date: Date | undefined) => {
    setSelectedDay(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleCreateBooking = async () => {
    try {
      if (!selectedDay || !selectedTime) return;
      if (status === "loading" || !session || !session.user.id) {
        throw new Error("Usuário não autenticado ou carregando. Por favor, tente novamente.");
      }

      setIsLoading(true);
      const hour = Number(selectedTime.split(":")[0]);
      const minute = Number(selectedTime.split(":")[1]);
      const newDate = new Date(selectedDay);
      newDate.setHours(hour, minute, 0, 0);

      const now = new Date();
      if (newDate < now) {
        throw new Error("Não é possível agendar uma data e hora anteriores à atual.");
      }

      const existingBooking = dayBookings.find((booking) => {
        const bookingDate = new Date(booking.dataAgendamento);
        return (
          isSameDay(bookingDate, newDate) &&
          booking.horaAgendamento === selectedTime &&
          booking.serviceId === service.id
        );
      });

      if (existingBooking) {
        throw new Error("Já existe uma reserva para esse serviço nessa data e hora.");
      }

      await createBooking({
        serviceId: service.id,
        userId: session.user.id,
        date: newDate,
        precoServico: service.price,
        imagemServico: service.imageUrl,
        userName: session.user.name || "Usuário",
        horaAgendamento: selectedTime,
        serviceName: service.name,
      });

      toast.success("Reserva criada com sucesso!");
      handleBookingSheetOpenChange();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        console.error("Erro desconhecido:", error);
        toast.error("Erro ao criar reserva. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const timeList = useMemo(() => {
    if (!selectedDay) return [];
    return getTimeList({ bookings: dayBookings, selectedDay });
  }, [dayBookings, selectedDay]);

  return (
    <>
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="relative h-[64px] w-[64px] overflow-hidden rounded-full">
              <Image
                src={service.imageUrl || "/no-image.png"}
                alt={service.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold">{service.name}</span>
              <span className="text-xs text-muted-foreground">
                {service.description}
              </span>
              <span className="text-sm text-muted-foreground">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(service.price)}
              </span>
            </div>
          </div>
          <Button variant="secondary" onClick={handleBookingClick}>
            Reservar
          </Button>
        </CardContent>
      </Card>

      <Sheet open={bookingSheetIsOpen} onOpenChange={handleBookingSheetOpenChange}>
        <SheetContent className="px-0 w-[80%]">
          <SheetHeader>
            <SheetTitle>Fazer Reserva</SheetTitle>
          </SheetHeader>
          <div className="border-b border-gray-200 py-5">
            <Calendar
              mode="single"
              locale={ptBR}
              selected={selectedDay}
              onSelect={handleDaySelect}
              fromDate={new Date()}
              styles={{
                head_cell: { width: "100%", textTransform: "capitalize" },
                cell: { width: "100%" },
                button: { width: "100%" },
                nav_button_previous: { width: "32px", height: "32px" },
                nav_button_next: { width: "32px", height: "32px" },
                caption: { textTransform: "capitalize" },
              }}
              modifiersClassNames={{
                today:
                  selectedDay && !isSameDay(selectedDay, new Date())
                    ? "bg-[#3498db] text-white"
                    : "bg-secondary text-white",
              }}
            />
          </div>

          {selectedDay && (
            <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
              {timeList.length > 0 ? (
                timeList.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => handleTimeSelect(time)}
                    disabled={isLoading}
                  >
                    {time}
                  </Button>
                ))
              ) : (
                <p className="text-sx">Não há horários disponíveis para este dia.</p>
              )}
            </div>
          )}
          {selectedDay && selectedTime && (
            <div className="p-5">
              <Card>
                <CardContent className="space-y-3 p-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold">{service.name}</h2>
                    <p className="text-sm font-bold">
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      }).format(service.price)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold">Data</h2>
                    <p className="text-sm font-bold">
                      {format(selectedDay, "d 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold">Horário</h2>
                    <p className="text-sm font-bold">{selectedTime}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <SheetFooter className="mt-3 px-5 flex items-center justify-between">
            <Button
              onClick={handleCreateBooking}
              disabled={!selectedDay || !selectedTime || isLoading}
            >
              {isLoading ? "Confirmando..." : "Confirmar"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={signInDialogIsOpen} onOpenChange={(open) => setSignInDialogIsOpen(open)}>
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceItem;