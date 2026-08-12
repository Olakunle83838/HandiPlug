export const topArtisans = [
  { id: 1, name: "Tunde Bakare", trade: "Carpenter", area: "Ikeja", rating: 5, price: "₦8,000/job", verified: true },
  { id: 2, name: "Kareem Yusuf", trade: "Painter", area: "Island", rating: 5, price: "₦10,000/job", verified: true },
  { id: 3, name: "Joseph Bryan", trade: "Photographer", area: "Ijora", rating: 5, price: "₦10,000/job", verified: true },
];

export const searchResults = [
  { id: 1, name: "Ifeanyi Obi", trade: "Electrician", area: "Lekki", rating: 5, price: "₦6,500/hr", verified: true },
  { id: 2, name: "Blessing Eze", trade: "Painter", area: "Lekki", rating: 4, price: "₦5,000/hr", verified: true },
  { id: 3, name: "Aba Uthman", trade: "Electrician", area: "Ijora", rating: 4, price: "₦5,800/hr", verified: false },
  { id: 4, name: "Yusuf Ibrahim", trade: "Carpenter", area: "Lekki", rating: 4, price: "₦4,000/hr", verified: false },
  { id: 5, name: "Joseph Momodu", trade: "Photographer", area: "Lekki", rating: 4, price: "₦7,000/hr", verified: false },
  { id: 6, name: "Moses Akanbi", trade: "Electrician", area: "Lekki", rating: 4, price: "₦4,500/hr", verified: false },
];

export const trades = [
  { icon: "⚡", label: "Electrician" },
  { icon: "🔧", label: "Plumber" },
  { icon: "🪚", label: "Carpenter" },
  { icon: "🚗", label: "Mechanic" },
  { icon: "🎨", label: "Painter" },
];

export const myBookings = {
  upcoming: [
    { id: 1, name: "Ifeanyi Obi — Electrician", time: "Thu, 2:00 PM · Lekki Phase 1", status: "Accepted" },
    { id: 2, name: "Tunde Bakare — Carpenter", time: "Fri, 10:00 AM · Ikeja GRA", status: "Pending" },
  ],
  completed: [],
};

export const newRequests = [
  {
    id: 1,
    customer: "Chukwudi Divine",
    time: "Thu, 2:00 PM",
    detail: "Rewire kitchen sockets — Lekki Phase 1",
  },
];

export const artisanJobs = {
  pending: [
    { id: 1, customer: "Chukwudi Divine", time: "Thu, 2:00 PM · Lekki Phase 1", detail: "Rewire kitchen sockets" },
  ],
  accepted: [
    { id: 2, customer: "Amaka Johnson", time: "Fri, 10:00 AM · Ikeja GRA", detail: "Install ceiling fan" },
  ],
  completed: [
    { id: 3, customer: "Segun Bello", time: "Mon, 1:00 PM · Yaba", detail: "Fix tripping breaker", amount: "₦12,000" },
  ],
};

export const adminStats = [
  { label: "Users", value: "1,204" },
  { label: "Pending KYC", value: "6" },
  { label: "Flags", value: "2" },
];

export const verificationQueue = [
  { id: 1, name: "Kelechi Obi", trade: "Painter", submitted: "Submitted 2 days ago" },
  { id: 2, name: "Segun Bello", trade: "AC Technician", submitted: "Submitted 2 days ago" },
  { id: 3, name: "Blessing Eze", trade: "Plumber", submitted: "Submitted 3 days ago" },
];

