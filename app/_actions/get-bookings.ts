"use client";
import { database } from "@/_utils/firebase";
import { ref, query, orderByChild, startAt, endAt, get } from "firebase/database";
import { startOfDay, endOfDay, formatISO } from "date-fns";

interface GetBookingsProps {
  serviceId: string;
  date: Date;
}

export const getBookings = async ({ serviceId, date }: GetBookingsProps) => {
  // Convert the date to ISO string format for Firebase queries
  const start = formatISO(startOfDay(date), { representation: 'date' });
  const end = formatISO(endOfDay(date), { representation: 'date' });

  try {
    // Create a reference to the 'bookings' node in Firebase
    const bookingsRef = ref(database, 'bookings');

    // Query Firebase for bookings within the date range
    const q = query(
      bookingsRef,
      orderByChild('dataAgendamento'),
      startAt(start),
      endAt(end)
    );

    // Fetch the data
    const snapshot = await get(q);

    if (snapshot.exists()) {
      // Filter the bookings for the specific serviceId
      const bookingsData = snapshot.val();
      const filteredBookings = Object.keys(bookingsData)
        .map(key => ({ id: key, ...bookingsData[key] }))
        .filter(booking => booking.servicoId === serviceId);

      return filteredBookings;
    } else {
      // If no bookings exist for that date range, return an empty array
      return [];
    }
  } catch (error) {
    console.error("Error fetching bookings from Firebase:", error);
    throw error;
  }
};