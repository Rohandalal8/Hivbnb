# Hivbnb 🏡

Hivbnb is a full-stack vacation rental platform inspired by Airbnb. Users can explore properties, book stays, save wishlists, and securely pay online. Hosts can list and manage properties, while admins can monitor listings and bookings through a dedicated dashboard.

---

## Features

### User
- User Registration & Login (Firebase Authentication)
- Email Verification
- Browse Listings
- Search by City
- View Property Details
- Wishlist Management
- Secure Online Payments
- Booking History
- Cancel Booking (before check-in)

### Host
- Add Property Listings
- Upload Multiple Images
- Edit/Delete Listings
- Manage Bookings
- Accept or Reject Bookings
- Auto Booking Expiry after 24 Hours

### Admin
- View All Listings
- View All Bookings
- Filter Bookings
- Platform Fee Tracking
- Host Earnings Overview

---

## Tech Stack

### Frontend
- React.js
- React Router
- Redux Toolkit
- Axios
- React Datepicker
- React Toastify
- CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

### Authentication
- Firebase Authentication
- Firebase Admin SDK

### Storage
- Cloudinary

### Payments
- Razorpay

### Maps
- Mapbox Geocoding API

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Folder Structure

```
Frontend/
│
├── src/
│   ├── admin/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── host/
│   ├── pages/
│   ├── redux/
│   ├── styles/
│   └── App.jsx
│
Backend/
│
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── cronJobs.js
└── server.js
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/rohandalal8/hivbnb.git
```

---

### Install Frontend

```bash
cd Frontend
npm install
```

---

### Install Backend

```bash
cd Backend
npm install
```

---

## Environment Variables

### Backend (.env)

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

MAPBOX_TOKEN=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### Frontend (.env)

```env
VITE_API_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_RAZORPAY_KEY=
```

---

## Running Locally

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

---

## Booking Workflow

1. User selects dates.
2. Booking is created with **Pending** status.
3. Host has **24 hours** to confirm or reject.
4. If no action is taken, booking is automatically cancelled.
5. User can cancel until check-in.
6. Refunds are calculated according to booking status.

---

## Payment Flow

- User pays securely using Razorpay.
- Booking is created only after successful payment verification.
- Platform fee is automatically calculated.
- Host earnings are tracked separately.

---

## APIs

### Listings

- Get Listings
- Get Listing Details
- Add Listing
- Edit Listing
- Delete Listing

### Bookings

- Create Booking
- Verify Payment
- Cancel Booking
- Host Update Booking Status
- Get User Bookings
- Get Host Bookings
- Get All Bookings (Admin)

### User

- Register
- Login
- Profile
- Wishlist

---

## Deployment

### Frontend

Vercel

### Backend

Render

### Database

MongoDB Atlas

---

## Future Improvements

- Reviews & Ratings
- Property Availability Calendar
- Host Analytics Dashboard
- Email Notifications
- Coupons & Offers
- Real-time Chat
- Multi-language Support

---

## Author

**Rohan**

GitHub: https://github.com/Rohandalal8

---

## License

This project is for learning and portfolio purposes.
