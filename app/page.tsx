"use client";

import Header from "./_components/ui/header";
import ServiceItem from "./_components/ui/service-item";
import Image from "next/image";
import { Card, CardContent } from "./_components/ui/card";
import { useEffect, useState } from "react";
import { database } from "./_utils/firebase";
import { Badge } from "./_components/ui/badge";
import { Avatar, AvatarImage } from "./_components/ui/avatar";

import { Button } from "./_components/ui/button";

import PhoneItem from "./_components/ui/phone-item";
import { toast } from "sonner";
import { ref, onValue } from 'firebase/database';
import SidebarSheet from "./_components/ui/SidebarSheet";
interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

const Home = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [barbearia, setBarbearia] = useState<{ phones?: string[] }>({});

    function formatPhone(phone: string): string {
        phone = phone.replace(/\D/g, "");
        if (phone.length === 11) {
            return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6, 11)}`;
        } else {
            return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6, 10)}`;
        }
    }

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesRef = ref(database, "services");
                onValue(servicesRef, (snapshot) => {
                 const data = snapshot.val();
                const formattedData: Service[] = data ? Object.values(data) : [];
                 setServices(formattedData);
             });
            } catch (error) {
                console.error("Erro ao buscar dados do Firebase:", error);
            }
        };

        const fetchBarbearia = async () => {
            try {
                const barbeariaRef = ref(database, "barbearia");
                onValue(barbeariaRef, (snapshot) => {
                 const data = snapshot.val();
                setBarbearia(data);
             });
            } catch (error) {
                console.error("Erro ao buscar dados do Firebase:", error);
            }
        };

        fetchServices();
        fetchBarbearia();
    }, []);

    const handlerCopyPhoneClick = (phone: string) => {
        navigator.clipboard.writeText(phone);
        toast.success("Telefone copiado com sucesso!");
    };

    return (
        <div>
            <Header/>
            <SidebarSheet/>
            <div className="p-5">
                <h2 className="text-xl font-bold">Olá, Lindinei</h2>
                <p>Segunda-feira, 09 de Dezembro de 2024.</p>


                <div className="relative mt-6 h-[150px] w-full p-5">
                    <Image
                        src="/banner-01.png"
                        fill
                        className="rounded-xl object-cover"
                        alt="Agende com os melhores profissionais"
                    />
                </div>


                <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
                    Agendamentos
                </h2>


                <Card className="mt-6">
                    <CardContent className="flex justify-between p-0">
                        <div className="flex flex-col gap-2 py-5 pl-5">
                            <Badge className="w-fit">Confirmado</Badge>
                            <h3 className="font-semibold">Corte de Cabelo</h3>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage
                                        src="https://utfs.io/f/3bcf33fc-988a-462b-8b98-b811ee2bbd71-17k.png"/>
                                </Avatar>
                                <p className="text-sm">Barbearia Ozias</p>
                            </div>
                        </div>


                        <div
                            className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
                            <p className="text-sm">Dezembro</p>
                            <p className="text-2xl">10</p>
                            <p className="text-sm">20:00</p>
                        </div>
                    </CardContent>
                </Card>


                <div className="space-y-3">
                    <h2 className="mb-6 mt-6 text-xs font-bold uppercase text-gray-400">
                        Serviços
                    </h2>
                    <div className="space-y-3 border-b border-solid">
                        {services.map((service) => (
                            <ServiceItem key={service.id} service={service}/>
                        ))}
                    </div>
                    <div className="space-y-3 p-5">
                        {barbearia.phones &&
                            barbearia.phones.map((phone, index) => (
                                <PhoneItem key={index} phone={formatPhone(phone)}/>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;