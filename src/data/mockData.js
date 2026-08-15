export const trades = [
  { icon: "⚡", label: "Electrician" },
  { icon: "🔧", label: "Plumber" },
  { icon: "🔨", label: "Carpenter" },
  { icon: "🎨", label: "Painter" },
  { icon: "🚗", label: "Mechanic" },
];

// Matches the sample artisans used throughout the Figma prototype so the
// demo data lines up with the designs.
export const topArtisans = [
  { id: 1, name: "Tunde Adeyemi", trade: "Carpenter", area: "Ikeja", rating: 4.8, reviewCount: 62, price: "₦8,000/hr", verified: true },
  { id: 2, name: "Bimpe Okafor", trade: "Electrician", area: "Lekki", rating: 4.9, reviewCount: 140, price: "₦6,500/hr", verified: true },
  { id: 3, name: "Musa Ibrahim", trade: "Plumber", area: "Surulere", rating: 4.6, reviewCount: 38, price: "₦5,000/hr", verified: true },
  { id: 4, name: "Kelechi Obi", trade: "Painter", area: "Yaba", rating: 4.3, reviewCount: 21, price: "₦4,000/hr", verified: false },
];

export const searchResults = [
  ...topArtisans,
  { id: 5, name: "Grace Nwosu", trade: "Electrician", area: "Ajah", rating: 4.7, reviewCount: 54, price: "₦5,500/hr", verified: true },
  { id: 6, name: "Femi Balogun", trade: "Plumber", area: "Yaba", rating: 4.5, reviewCount: 29, price: "₦4,800/hr", verified: true },
];

export const myBookings = {
  upcoming: [
    { id: 1, name: "Bimpe Okafor — Electrician", time: "Sat, 09 Aug · 10:00 AM", status: "Accepted" },
  ],
  completed: [
    { id: 2, name: "Musa Ibrahim — Plumber", time: "Mon, 04 Aug · 2:00 PM", status: "Completed", artisanId: "u_musa" },
  ],
};

export const newRequests = [
  {
    id: 1,
    customer: "Amaka O.",
    time: "Sat, 09 Aug · 10:00 AM",
    detail: "Rewire living room sockets",
    location: "Lekki Phase 1",
  },
];

export const upcomingSchedule = [
  { id: 1, title: "Tunde — Cabinet repair", time: "Tomorrow · 2:00 PM", status: "Confirmed" },
];

export const artisanJobs = {
  pending: [
    { id: 1, customer: "Amaka O.", time: "Sat, 09 Aug · 10:00 AM · Lekki Phase 1", detail: "Rewire living room sockets" },
  ],
  accepted: [
    { id: 2, customer: "Tunde", time: "Tomorrow · 2:00 PM", detail: "Cabinet repair" },
  ],
  completed: [
    { id: 3, customer: "Segun Bello", time: "Mon, 1:00 PM · Yaba", detail: "Fix tripping breaker", amount: "₦12,000" },
  ],
};

export const adminStats = [
  { label: "Total users", value: "1,204" },
  { label: "Pending KYC", value: "6" },
  { label: "Open flags", value: "2" },
];

export const verificationQueue = [
  { id: 1, name: "Kelechi Obi", trade: "Painter", submitted: "2 days ago" },
  { id: 2, name: "Segun Bello", trade: "AC Technician", submitted: "5 hours ago" },
  { id: 3, name: "Ifeoma Chukwu", trade: "Carpenter", submitted: "1 day ago" },
];

export const reviews = [
  { id: 1, name: "Chidinma S.", rating: 5, comment: "Very professional, arrived on time." },
  { id: 2, name: "Kunle A.", rating: 5, comment: "Fair pricing, explained everything." },
];
