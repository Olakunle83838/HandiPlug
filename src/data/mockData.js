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
