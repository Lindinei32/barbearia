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
import { getConfirmadBookings } from "./_data/get-confirmad-bookings";

interface Barbearia {
  phones?: string[];
}

const Home = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]); // Usando a interface Booking
  const [barbearia, setBarbearia] = useState<Barbearia>({});
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]); // Usando a interface Booking
  const [isLoading, setIsLoading] = useState(true);

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
          const formattedData: Booking[] = Object.values(data).filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (booking: any) => booking.userId === session?.user?.id,
          ) as Booking[];

          const confirmedBookings = formattedData.filter((booking) => {
            const bookingDate = new Date(booking.dataAgendamento);
            return isValid(bookingDate) && (isFuture(bookingDate) || (isToday(bookingDate) && bookingDate < horaFechamento));
          });

          const bookingsWithImages = confirmedBookings.map((booking) => ({
            ...booking,
            imagemServico:
              booking.imagemServico ||
              services.find((s) => s.id === booking.serviceId)?.imageUrl ||
              "",
            serviceName:
              services.find((s) => s.id === booking.serviceId)?.name || "",
            precoServico:
              services.find((s) => s.id === booking.serviceId)?.price || 0,
            isConfirmado:
              isFuture(new Date(booking.dataAgendamento)) ||
              (isToday(new Date(booking.dataAgendamento)) && new Date(booking.dataAgendamento) < horaFechamento)
                ? true
                : false,
          }));

          setBookings(bookingsWithImages);
        } else {
          setBookings([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar agendamentos:", error);
        toast.error("Erro ao carregar agendamentos.");
        setBookings([]);
        setIsLoading(false);
      });
  }, [session, services, horaFechamento]);

  useEffect(() => {
    const fetchConfirmedBookings = async () => {
      const bookings = await getConfirmadBookings();
      setConfirmedBookings(bookings);
    };
    fetchConfirmedBookings();
  }, []);

  useEffect(() => {
    fetchServices();
    fetchBarbearia();
    fetchBookings();
  }, [fetchServices, fetchBarbearia, fetchBookings]);

  const handlerCopyPhoneClick = (phone: string) => {
    navigator.clipboard.writeText(phone);
    toast.success("Telefone copiado com sucesso!");
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-foreground">Carregando...</p>
      </div>
    );
  }

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
            Olá, {session?.user.name || "Seja Bem Vindo"}!
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
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-muted-foreground">
              Agendamentos
            </h2>
            {confirmedBookings.map((booking) => (
              <BookingItem
                key={booking.id}
                booking={booking}
                services={[{
                  id: booking.serviceId,
                  name: booking.serviceName,
                  description: "",
                  imageUrl: booking.imagemServico,
                  price: booking.precoServico,
                }]}
                isConfirmado={booking.isConfirmado}
                onSelect={() => console.log(booking)}
              />
            ))}
          </>
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