// app/bookings/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { database } from "@/_utils/firebase";
import { useRouter } from "next/navigation";
import { get, ref } from "firebase/database";
import { useEffect, useState, useMemo } from "react";
import { format, isFuture, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/_components/ui/card";
import { Avatar, AvatarImage } from "@/_components/ui/avatar";
import { Badge } from "@/_components/ui/badge";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/_components/ui/sheet";
import Image from "next/image";
import { Button } from "@/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/_components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { deleteBooking } from "@/_actions/delete-booking";
import { createBooking } from "@/_actions/create-bookings";
import { toast } from "sonner";
import { Session } from "next-auth";

interface Booking {
  id: string;
  userId: string;
  dataAgendamento: number;
  serviceId: string;
  horaAgendamento: string;
  userName: string;
  imagemServico: string;
  precoServico: number;
  serviceName: string;
}

interface Service {
  ID: string;
  Name: string;
  Description: string;
  ImageUrl: string;
  Price: number;
}

interface Barbearia {
  ID: string;
  Name: string;
  Description: string;
  Address: string;
  ImageUrl: string;
}

interface BookingItemProps {
  booking: Booking;
  service: Service;
  isConfirmado: boolean;
  onSelect: () => void;
}

const BookingItem = ({ booking, service, isConfirmado, onSelect }: BookingItemProps) => {
  const bookingDate = useMemo(() => new Date(booking.dataAgendamento), [booking.dataAgendamento]);

  if (!isValid(bookingDate)) {
    console.error("Invalid date:", booking.dataAgendamento);
    return <div className="mb-4 rounded-lg bg-gray-800 p-4 text-white shadow-lg">Data inválida</div>;
  }

  const status = isConfirmado ? "Confirmado" : "Finalizado";

  // Log para depuração da URL da imagem
  console.log("BookingItem Image URL (Bookings):", booking.imagemServico || service?.ImageUrl || "No Image URL");

  return (
    <Card className="mt-6 min-w-[90%]" onClick={onSelect}>
      <CardContent className="flex justify-between p-0">
        <div className="flex flex-col gap-2 py-5 pl-5">
          <Badge className="w-fit" variant={isConfirmado ? "default" : "destructive"}>
            {status}
          </Badge>
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-bold">{booking.serviceName}</h2>
            <p className="text-sm">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
              }).format(booking.precoServico)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={booking.imagemServico || service?.ImageUrl || ""} alt={booking.serviceName} />
            </Avatar>
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

const Bookings = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Record<string, Service>>({});
  const [barbearia, setBarbearia] = useState<Barbearia>({
    ID: "",
    Name: "",
    Description: "",
    Address: "",
    ImageUrl: "",
  });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isConfirmado, setIsConfirmado] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsConfirmado(
      isFuture(new Date(booking.dataAgendamento)) && new Date(booking.dataAgendamento).getHours() < 19
    );
    setIsSheetOpen(true);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await deleteBooking({ bookingId });
      toast.success("Reserva cancelada com sucesso!");
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Erro ao cancelar reserva. Tente novamente.");
    }
  };

  const handleSheetOpenChange = (isOpen: boolean) => {
    setIsSheetOpen(isOpen);
  };

  const handleCreateBooking = async () => {
    if (!session?.user?.id || !selectedServiceId || !selectedDate || !selectedTime) {
      toast.error("Preencha todos os campos para agendar.");
      return;
    }

    const service = services[selectedServiceId];
    if (!service) {
      toast.error("Serviço não encontrado.");
      return;
    }

    const date = new Date(`${selectedDate}T${selectedTime}:00`);

    try {
      await createBooking({
        serviceId: selectedServiceId,
        userId: session.user.id,
        date,
        precoServico: service.Price,
        imagemServico: service.ImageUrl, // Usando ImageUrl do Service
        userName: session.user.name || "Usuário",
        horaAgendamento: selectedTime,
        serviceName: service.Name,
      });
      toast.success("Reserva criada com sucesso!");
      setBookings((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          serviceId: selectedServiceId,
          userId: session.user.id,
          dataAgendamento: date.getTime(),
          horaAgendamento: selectedTime,
          precoServico: service.Price,
          imagemServico: service.ImageUrl, // Mapeando ImageUrl para imagemServico
          userName: session.user.name || "Usuário",
          serviceName: service.Name,
        },
      ]);
      setSelectedServiceId("");
      setSelectedDate("");
      setSelectedTime("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar reserva.");
    }
  };

  const fetchInitialData = useMemo(() => async () => {
    try {
      const bookingsRef = ref(database, "bookings");
      const bookingsSnapshot = await get(bookingsRef);
      if (bookingsSnapshot.exists()) {
        const bookingsData = bookingsSnapshot.val();
        const userBookings = Object.values(bookingsData).filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (booking: any) => booking.userId === (session as Session | null)?.user?.id
        ) as Booking[];
        
        // Log para depuração dos bookings e imagens
        console.log("Bookings fetched (Bookings):", userBookings);

        const bookingsWithImages = userBookings.map((booking) => ({
          ...booking,
          imagemServico: booking.imagemServico || (services[booking.serviceId]?.ImageUrl || ""),
        }));
        console.log("Bookings with images (Bookings):", bookingsWithImages);
        setBookings(bookingsWithImages);

        const servicePromises = userBookings.map((booking) =>
          get(ref(database, `Service/${booking.serviceId}`)).then((snapshot) => snapshot)
        );
        const serviceSnapshots = await Promise.all(servicePromises);
        const fetchedServices = serviceSnapshots.reduce((acc, snapshot, index) => {
          if (snapshot.exists()) {
            const service = snapshot.val() as Service;
            console.log(`Service ${userBookings[index].serviceId} (Bookings):`, service);
            acc[userBookings[index].serviceId] = service;
          } else {
            acc[userBookings[index].serviceId] = {
              ID: userBookings[index].serviceId,
              Name: "Serviço Não Encontrado",
              Description: "Este serviço não foi encontrado no banco de dados.",
              ImageUrl: "",
              Price: userBookings[index].precoServico,
            };
          }
          return acc;
        }, {} as Record<string, Service>);
        setServices(fetchedServices);
      }

      const barbeariaRef = ref(database, "barbearia");
      const barbeariaSnapshot = await get(barbeariaRef);
      if (barbeariaSnapshot.exists()) {
        setBarbearia(barbeariaSnapshot.val() as Barbearia);
      }
    } catch (error) {
      console.error("Failed to fetch data (Bookings):", error);
    }
  }, [session, services]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    fetchInitialData();
  }, [status, router, fetchInitialData]);

  if (status === "loading") {
    return <div className="p-5 text-white">Carregando...</div>;
  }

  return (
    <>
      
      {/* Lista de Agendamentos */}
      <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetTrigger asChild>
          <Card>
            <CardContent className="p-5">
              <h2 className="text-center text-xl font-bold">Meus Agendamentos</h2>
              {bookings
                .sort((a, b) => b.dataAgendamento - a.dataAgendamento)
                .map((booking) => (
                  <BookingItem
                    key={booking.id}
                    booking={booking}
                    service={services[booking.serviceId]}
                    isConfirmado={
                      isFuture(new Date(booking.dataAgendamento)) &&
                      new Date(booking.dataAgendamento).getHours() < 19
                    }
                    onSelect={() => handleSelectBooking(booking)}
                  />
                ))}
            </CardContent>
          </Card>
        </SheetTrigger>
        <SheetContent className="w-[80%]">
          <SheetHeader>
            <SheetTitle className="text-left">Informações da Reserva</SheetTitle>
          </SheetHeader>
          <div className="relative mt-6 flex h-[180px] w-full items-end">
            <Image src="/map.png" alt="Map" fill className="rounded-xl object-cover" />
            <Card className="z-50 mx-5 mb-3 w-full rounded-xl">
              <CardContent className="flex items-start gap-3 px-5 py-3">
                <Avatar>
                  <AvatarImage src={barbearia.ImageUrl} alt="Barbearia" />
                </Avatar>
                <div>
                  <h3 className="font-bold">{barbearia.Name}</h3>
                  <p className="text-xs">{barbearia.Address}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6">
            <Badge className="w-fit" variant={isConfirmado ? "default" : "destructive"}>
              {isConfirmado ? "Confirmado" : "Finalizado"}
            </Badge>
            {selectedBooking && (
              <Card className="mt-6 min-w-[90%]">
                <CardContent className="space-y-3 p-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold">{selectedBooking.serviceName}</h2>
                    <p className="text-sm font-bold">
                      {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        selectedBooking.precoServico
                      )}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold">Data</h2>
                    <p className="text-sm font-bold">
                      {format(new Date(selectedBooking.dataAgendamento), "d 'de' MMMM", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold">Horário</h2>
                    <p className="text-sm font-bold">{selectedBooking.horaAgendamento}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <SheetFooter className="mt-6">
            <div className="flex items-center gap-3">
              <SheetClose asChild>
                <Button className="w-full">Voltar</Button>
              </SheetClose>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full bg-red-700">
                    Cancelar Reserva
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%] rounded-xl">
                  <DialogHeader>
                    <DialogTitle>Você quer Cancelar sua Reserva?</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja cancelar sua reserva? Essa ação não pode ser desfeita.
                    </DialogDescription>
                  </DialogHeader>
                  {selectedBooking && (
                    <DialogFooter className="flex flex-row gap-5">
                      <DialogClose asChild>
                        <Button className="w-full">Voltar</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteBooking(selectedBooking.id)}
                          className="w-full bg-red-700"
                        >
                          Confirmar
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Bookings;