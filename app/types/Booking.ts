export interface Booking {
  id: string;
  userId: string;
  dataAgendamento: string;
  horaAgendamento: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  precoServico: number;
  isConfirmed: boolean;
}
export default Booking;