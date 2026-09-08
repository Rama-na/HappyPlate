/**
 * Upcoming dinners.
 *
 * SAMPLE DATA — these are placeholder events so the section has something real
 * to render. Replace the entries below with actual dinners; nothing else needs
 * to change, the section reads straight from this array.
 */

export interface Dinner {
  id: string;
  day: string;
  date: string;
  title: string;
  location: string;
  time: string;
  seats: string;
  price: string;
  note: string;
  /** set false once a dinner is full — the card shows a waitlist state */
  open: boolean;
}

export const dinners: Dinner[] = [
  {
    id: 'first-table',
    day: 'Friday',
    date: '18 September',
    title: 'The First Table',
    location: 'Chennai',
    time: '8:00 PM',
    seats: '8 seats',
    price: '₹1,999 / person',
    note: 'A slow four-course evening to open the season.',
    open: true,
  },
  {
    id: 'long-weekend',
    day: 'Saturday',
    date: '4 October',
    title: 'The Long Weekend',
    location: 'Chennai',
    time: '7:30 PM',
    seats: '10 seats',
    price: '₹2,199 / person',
    note: 'Cooked around the table — the menu follows the room.',
    open: true,
  },
  {
    id: 'last-of-the-year',
    day: 'Saturday',
    date: '15 November',
    title: 'Last of the Year',
    location: 'Chennai',
    time: '8:00 PM',
    seats: 'Full',
    price: '₹2,199 / person',
    note: 'This one is spoken for — join the waitlist for a returned seat.',
    open: false,
  },
];
