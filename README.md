# 🔧 HandiPlug

### Nigeria's Digital Marketplace for Skilled Artisans

HandiPlug is a digital artisan marketplace designed to connect customers with skilled and reliable service providers. The platform makes it easier for customers to discover artisans, explore their services, communicate with them, and book services through one convenient digital platform.

---

## 🚀 Live Application

**Website:** https://handi-plug.vercel.app/

---

## 📌 Problem Statement

Finding a reliable artisan in Nigeria can often be stressful and time-consuming. Customers may struggle to identify skilled professionals, compare service providers, communicate their requirements, and arrange services conveniently.

At the same time, many skilled artisans have limited digital visibility and may struggle to consistently reach potential customers.

HandiPlug was created to bridge this gap by providing a digital platform where customers can connect with artisans and artisans can connect with potential customers.

---

## 💡 Our Solution

HandiPlug provides a centralized digital marketplace where customers can discover skilled artisans and access different services.

The platform facilitates the entire interaction between customers and artisans, from discovering a service provider to communicating about a job and arranging a service.

---

## ✨ Key Features

### 👤 User Authentication

* Customer and artisan registration
* Secure login
* Email verification/OTP
* Role-based user access

### 🔎 Artisan Discovery

* Browse available artisans
* Explore available services
* View artisan information
* Find suitable professionals based on service needs

### 👨‍🔧 Artisan Profiles

* Artisan information
* Services offered
* Professional details
* Customer ratings and reviews

### 📅 Service Booking

* Customers can request/book artisan services
* Booking information can be managed through the platform
* Helps organize interactions between customers and artisans

### 💬 Customer–Artisan Chat

* Direct communication between customers and artisans
* Allows users to discuss job requirements
* Helps clarify service details before work begins

### ⭐ Reviews & Ratings

* Customers can provide feedback
* Ratings help customers make more informed decisions
* Encourages service quality and accountability

### 🔔 Notifications

* Keeps users informed about relevant platform activities
* Provides updates related to bookings and interactions

### 🛡️ User Roles

HandiPlug supports different types of users, including:

* Customers
* Artisans
* Administrators

Each role has access to functionality relevant to their responsibilities.

---

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* React Router
* JavaScript
* HTML5
* CSS
* Lucide React

### Backend

* Node.js
* Express.js

### Database & Authentication

* Supabase
* PostgreSQL
* Supabase Authentication

### Email & Verification

* Brevo
* Email OTP verification

### Deployment

* Vercel

---

## 🏗️ Project Architecture

HandiPlug follows a client-server architecture.

```text
                    ┌─────────────────────┐
                    │      Customer       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     HandiPlug       │
                    │      Frontend       │
                    │       React         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │   Node.js/Express   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Supabase       │
                    │ PostgreSQL + Auth   │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Brevo         │
                    │   Email / OTP       │
                    └─────────────────────┘
```

---

## 📂 Project Structure

A simplified structure of the project is:

```text
HandiPlug/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── lib/
│   └── ...
│
├── public/
│
├── package.json
├── vite.config.js
└── README.md
```

The backend is maintained separately and provides API functionality for authentication, artisans, bookings, reviews, and other platform operations.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Olakunle83838/HandiPlug.git
```

### 2. Navigate into the project

```bash
cd HandiPlug
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application should then be available locally through the Vite development server.

---

## 🔐 Environment Variables

Create an appropriate `.env` file for the environment and configure the required credentials.

Example:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=your_backend_api_url
```

Backend environment variables should be stored separately and must **never be exposed in the frontend**.

Do not commit `.env` files containing real credentials to GitHub.

---

## 🌍 Deployment

The frontend is deployed using **Vercel**.

Live application:

https://handi-plug.vercel.app/

The backend and database services are configured separately.

---

## 🎯 Target Users

### Customers

People looking for reliable professionals for services such as:

* Plumbing
* Electrical work
* Cleaning
* Carpentry
* Painting
* Repairs
* Maintenance
* Technical services
* Other skilled services

### Artisans

Skilled professionals who want to:

* Increase their visibility
* Reach more customers
* Promote their services
* Communicate directly with customers
* Receive service opportunities
* Build a digital presence

---

## 💼 Business Value

HandiPlug addresses a real marketplace problem by bringing customers and skilled service providers together digitally.

The platform aims to:

* Reduce the difficulty of finding artisans
* Improve customer convenience
* Increase artisan visibility
* Improve communication between customers and service providers
* Create more opportunities for skilled professionals
* Digitize the process of discovering and accessing artisan services

---

## 🔮 Future Development

Potential future improvements include:

* Online payments
* Location-based artisan discovery
* Advanced search and filtering
* Real-time messaging improvements
* Push notifications
* Artisan verification
* Enhanced identity verification
* Service tracking
* In-app payment and escrow
* Analytics dashboards
* Mobile applications
* Expansion to additional Nigerian cities
* Expansion into other African markets

---

## 🔒 Security

HandiPlug is designed with security in mind.

Sensitive credentials and server-side secrets should never be stored in frontend code or committed to the repository.

Authentication, authorization, database access policies, and API security should be configured appropriately before production use.

---

## 🤝 Contribution

Contributions, suggestions, and improvements are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Commit your changes.

```bash
git commit -m "Add your feature"
```

5. Push your branch.

```bash
git push origin feature/your-feature
```

6. Open a Pull Request.

---

## 📄 License

This project is currently maintained as a HandiPlug project.

License terms can be added here when the project's licensing decision has been finalized.

---

## 📞 Contact

For information about HandiPlug, visit:

**https://handi-plug.vercel.app/**

---

# 🔧 HandiPlug

### Connecting Skills. Creating Opportunities. Simplifying Services.
