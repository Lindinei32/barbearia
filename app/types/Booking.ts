export interface Booking {
  id: string;
  userId: string;
  dataAgendamento: string;
  horaAgendamento: string;
  serviceId: string;
  serviceName: string;
  imagemServico: string;
  precoServico: number;
  isConfirmado: boolean;
}
export default Booking;