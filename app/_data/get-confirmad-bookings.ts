import { getServerSession } from "next-auth";
import authOptions from "../_lib/auth";
import { database } from "@/_utils/firebase";
import { ref, query, orderByChild, equalTo, startAt, get } from 'firebase/database';

interface Booking {
  id: string;
  userId: string;
  date: string;
  service: {
    id: string;
    name: string;
    barbershop: {
      id: string;
      name: string;
    };
  };
}

export const getConfirmadBookings = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return [];
  }

  try {
    const bookingsRef = ref(database, 'bookings');
    const queryRef = query(bookingsRef, 
      orderByChild('date'), 
      startAt(new Date().toISOString())
    );

    const snapshot = await get(queryRef);
    const bookings: Booking[] = [];

    snapshot.forEach((childSnapshot) => {
      const booking = childSnapshot.val();
      if (booking && typeof booking === 'object' && booking.userId === session.user.id) {
        bookings.push(booking);
      }
    });

    return bookings;
  } catch (error) {
    console.error('Erro ao carregar agendamentos:', error);
    return [];
  }
};