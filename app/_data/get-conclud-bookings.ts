import { database } from '@/_utils/firebase';
import { ref, query, orderByChild, equalTo, endAt, get } from 'firebase/database';

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

const getConcludeBookings = async (): Promise<Booking[]> => {
  const bookingsRef = ref(database, 'bookings');
  const queryRef = query(bookingsRef, 
    orderByChild('date'), 
    endAt(new Date().toISOString())
  );

  const snapshot = await get(queryRef);
  const bookings: Booking[] = [];

  snapshot.forEach((childSnapshot) => {
    const booking = childSnapshot.val();
    bookings.push(booking);
  });

  return bookings;
};

export { getConcludeBookings };