export type DemoBooking = {
  code: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  provider: string | null;
  date: string;
  time: string;
  notes: string | null;
  createdAt: Date;
};

type DemoStore = {
  bookings: DemoBooking[];
  newsletterSubscribers: Map<string, Date>;
};

const globalForDemoStore = globalThis as typeof globalThis & {
  __elysianDemoStore?: DemoStore;
};

function getDemoStore() {
  if (!globalForDemoStore.__elysianDemoStore) {
    globalForDemoStore.__elysianDemoStore = {
      bookings: [],
      newsletterSubscribers: new Map<string, Date>(),
    };
  }

  return globalForDemoStore.__elysianDemoStore;
}

export function listDemoBookings(date: string, time?: string) {
  return getDemoStore().bookings.filter(
    (booking) => booking.date === date && (!time || booking.time === time),
  );
}

export function saveDemoBooking(booking: DemoBooking) {
  const store = getDemoStore();
  store.bookings.push(booking);

  // Keep local/demo sessions bounded during long-running development servers.
  if (store.bookings.length > 500) {
    store.bookings.splice(0, store.bookings.length - 500);
  }
}

export function saveDemoNewsletterSubscriber(email: string) {
  getDemoStore().newsletterSubscribers.set(email, new Date());
}
