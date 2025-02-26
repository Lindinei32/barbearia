"use client";

import Header from "./_components/ui/header";
import ServiceItem from "./_components/ui/service-item";
import Image from "next/image";
import { useState, useEffect, useMemo, useCallback } from "react";
import { database } from "./_utils/firebase";
import PhoneItem from "./_components/ui/phone-item";
import { toast } from "sonner";
import { ref, get } from "firebase/database";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BookingItem from "./_components/ui/booking-item";
import { format, isFuture, isToday, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import Footer from "./_components/ui/Footer";
import { Booking } from './types/Booking'; // Importando a interface Booking
import { Service } from "./_components/ui/service-item";
import { Card, CardContent } from "./_components/ui/card";
import { Badge } from "./_components/ui/badge";
import { Avatar, AvatarImage } from "./_components/ui/avatar";




interface Barbearia {
  phones?: string[];
}

const Home = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [barbearia, setBarbearia] = useState<Barbearia>({});
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);

  const { data: session, status } = useSession();
  const router = useRouter();

  const currentDate = useMemo(() => new Date(), []);
  const horaFechamento = useMemo(() => {
    const date = new Date();
    date.setHours(19, 0, 0, 0);
    return date;
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user.email === "lindineisales4@gmail.com") {
      router.push("/Adm");
    }
  }, [session, status, router]);

  const fetchServices = useCallback(() => {
    const servicesRef = ref(database, "Service");
    return get(servicesRef)
      .then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedData: Service[] = Object.keys(data).map((key) => ({
            id: data[key].ID,
            name: data[key].Name,
            description: data[key].Description,
            price: data[key].Price,
            imageUrl: data[key].ImageUrl,
          }));
          setServices(formattedData);
        } else {
          setServices([]);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar serviços:", error);
        toast.error("Erro ao carregar serviços.");
      });
  }, []);

  const fetchBarbearia = useCallback(() => {
    const barbeariaRef = ref(database, "barbearia");
    return get(barbeariaRef)
      .then((snapshot) => {
        const data = snapshot.val();
        setBarbearia(data || {});
      })
      .catch((error) => {
        console.error("Erro ao buscar barbearia:", error);
        toast.error("Erro ao carregar informações da barbearia.");
      });
  }, []);

  const fetchBookings = useCallback(() => {
    const bookingsRef = ref(database, "bookings");
    return get(bookingsRef)
      .then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Log para debug
          console.log("Dados brutos:", data);
          
          const formattedData = Object.values(data).filter(
            (booking: any) => booking.userId === session?.user?.id
          );
          
          console.log("Dados filtrados por usuário:", formattedData);

          const bookingsWithImages = formattedData.map((booking: any) => {
            const service = services.find((s) => s.id === booking.serviceId);
            return {
              ...booking,
              serviceImage: service?.imageUrl || "",
              serviceName: service?.name || "",
              servicePrice: service?.price || 0,
              isConfirmed: true // Temporariamente definido como true para teste
            };
          });

          console.log("Bookings processados:", bookingsWithImages);
          
          setBookings(bookingsWithImages);
          setConfirmedBookings(bookingsWithImages);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar agendamentos:", error);
        toast.error("Erro ao carregar agendamentos.");
      });
  }, [session?.user?.id, services]);

  useEffect(() => {
    fetchServices();
    fetchBarbearia();
    fetchBookings();
  }, [fetchServices, fetchBarbearia, fetchBookings]);

  const handlerCopyPhoneClick = (phone: string) => {
    navigator.clipboard.writeText(phone);
    toast.success("Telefone copiado com sucesso!");
  };

  const formatPhone = (phone: string): string => {
    phone = phone.replace(/\D/g, "");
    if (phone.length === 11) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7, 11)}`;
    }
    return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6, 10)}`;
  };

  return (
    <>
      <div className="bg-card p-5 text-card-foreground">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-card-foreground">
            Olá, {session?.user?.name || "Seja Bem Vindo"}!
          </h2>
        </div>
        <p className="mt-3 text-muted-foreground">
          <span className="capitalize">
            {format(currentDate, "EEEE, dd", { locale: ptBR })}
          </span>
          <span> de </span>
          <span className="capitalize">
            {format(currentDate, "MMMM", { locale: ptBR })}
          </span>
        </p>

        <div className="relative mt-6 h-[150px] w-full">
          <Image
            src="/banner-01.png"
            fill
            className="rounded-xl object-cover"
            alt="Agende com os melhores profissionais"
          />
        </div>

        {confirmedBookings.length > 0 && (
          <>
            <div className="mt-6">
              <h2 className="mb-3 text-xs font-bold uppercase text-gray-400">
                Agendamentos
              </h2>
              <div className="flex gap-5 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {confirmedBookings.map((booking) => (
                  <BookingItem
                    key={booking.id}
                    booking={JSON.parse(JSON.stringify(booking))}
                    services={[{
                      id: booking.serviceId,
                      name: booking.serviceName,
                      description: "",
                      imageUrl: booking.serviceImage,
                      price: booking.servicePrice,
                    }]}
                    isConfirmado={booking.isConfirmed}
                    onSelect={() => console.log("Reserva selecionada:", booking)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {confirmedBookings.length === 0 && (
          <div className="mt-6">
            <p className="text-gray-500">Nenhum agendamento encontrado.</p>
          </div>
        )}

        <h2 className="mb-6 mt-6 text-xs font-bold uppercase text-muted-foreground">
          Serviços
        </h2>
        <div className="space-y-3 border-b border-solid border-border">
          {services.map((service) => (
            <ServiceItem
              key={service.id}
              service={{
                id: service.id,
                name: service.name,
                description: service.description,
                imageUrl: service.imageUrl,
                price: service.price,
              }}
            />
          ))}
        </div>

        <div className="space-y-3 p-5">
          {barbearia.phones && barbearia.phones.length > 0 ? (
            barbearia.phones.map((phone, index) => (
              <PhoneItem
                key={index}
                phone={formatPhone(phone)}
                onCopy={() => handlerCopyPhoneClick(phone)}
              />
            ))
          ) : (
            <p className="text-muted-foreground">Nenhum telefone disponível.</p>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;