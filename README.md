# MediQueue — Tutor Booking System (Client)

MediQueue is a tutor booking platform where students register, browse available tutors, and book learning sessions by subject and time slot — with automatic slot tracking to prevent double-booking.

**Live Site:** _add your deployed URL here_

## Features
- Browse and search tutors by name, with date-range filtering
- Book sessions with real-time slot-availability and session-date validation
- Add, update, and delete your own tutor listings from a dedicated dashboard
- Track and cancel your booked sessions in one place
- Secure authentication via email/password and Google, bridged to a JWT for protected API calls
- Dark/Light theme toggle across the whole app
- Fully responsive design for mobile, tablet, and desktop

## Tech Stack
Next.js (App Router), Better Auth + MongoDB, Tailwind CSS, react-hot-toast, react-datepicker, lucide-react

## Setup
```bash
npm install
cp .env.local.example .env.local   # fill in MongoDB, Better Auth, Google OAuth, JWT_SECRET, API URL, imgbb key
npm run dev
```

Make sure the [MediQueue server](../mediqueue-server) is running and `NEXT_PUBLIC_API_URL` points to it, and that `JWT_SECRET` matches exactly on both sides.
