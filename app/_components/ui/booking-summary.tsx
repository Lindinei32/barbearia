import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from './card';

interface BookingSummaryProps {
  booking: {
    serviceName: string;
    precoServico: number;
    dataAgendamento: number;
  };
}

const BookingSummary = ({ booking }: BookingSummaryProps) => {
  const selectedDay = new Date(booking.dataAgendamento);

  return (
    <Card className="min-w-[90%]">
      <CardContent className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">{booking.serviceName}</h2>
          <p className="text-sm font-bold">
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(booking.precoServico)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">Data</h2>
          <p className="text-sm font-bold">
            {format(selectedDay, "d 'de' MMMM", {
              locale: ptBR,
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;