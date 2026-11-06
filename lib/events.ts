// Sample events shared by Home and the Events screen. Replace with CMS data when available.

export interface EventItem {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  imageUrl: string;
  price: string;
  featured?: boolean;
}

export const EVENTS_DATA: EventItem[] = [
  {
    id: 'e1',
    title: 'Dar es Salaam Swahili Summer Fest 2026',
    category: 'Concert',
    date: '15 AUG 2026',
    time: '18:00 EAT',
    location: 'Dar es Salaam',
    venue: 'Coco Beach Grounds',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800',
    price: 'TSH 20,000',
    featured: true
  },
  {
    id: 'e2',
    title: 'Tanzania Tech & Innovation Summit',
    category: 'Conference',
    date: '22 SEP 2026',
    time: '09:00 EAT',
    location: 'Arusha',
    venue: 'AICC Conference Hall',
    imageUrl: 'https://images.unsplash.com/photo-1505373676634-31976f08e4ba?q=80&w=800',
    price: 'Free Registration',
    featured: true
  },
  {
    id: 'e3',
    title: 'Zanzibar Music & Culture Carnival',
    category: 'Festival',
    date: '10 OCT 2026',
    time: '16:00 EAT',
    location: 'Zanzibar',
    venue: 'Stone Town Amphitheatre',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800',
    price: 'TSH 35,000'
  },
  {
    id: 'e4',
    title: 'Bongo Flava NextGen Awards',
    category: 'Showbiz',
    date: '05 NOV 2026',
    time: '19:00 EAT',
    location: 'Dar es Salaam',
    venue: 'Mlimani City Hall',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800',
    price: 'TSH 50,000'
  }
];

/** "15 AUG 2026" -> { day: "15", month: "AUG" } for calendar-style date blocks. */
export function dateParts(date: string) {
  const [day = '', month = ''] = date.split(' ');
  return { day, month };
}
