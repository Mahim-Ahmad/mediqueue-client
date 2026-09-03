import Link from "next/link";
import { MapPin, Clock, Wallet } from "lucide-react";

export default function TutorCard({ tutor }) {
  return (
    <div className="card-shadow bg-white dark:bg-[#171a22] rounded-2xl overflow-hidden border border-brand-100 dark:border-white/10 flex flex-col">
      <div className="relative h-40 overflow-hidden bg-brand-50 dark:bg-white/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tutor.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(tutor.name || "Tutor")}`}
          alt={tutor.name}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 left-3 bg-brand-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
          {tutor.subject}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{tutor.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{tutor.institution}</p>

        <div className="flex flex-col gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-3">
          <span className="flex items-center gap-1.5"><Clock size={13} /> {tutor.availableDays} &middot; {tutor.availableTime}</span>
          <span className="flex items-center gap-1.5"><MapPin size={13} /> {tutor.location}</span>
          <span className="flex items-center gap-1.5"><Wallet size={13} /> ৳{tutor.hourlyFee}/hr</span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-50 dark:border-white/10">
          <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">
            {tutor.totalSlot > 0 ? `${tutor.totalSlot} slots left` : "Fully booked"}
          </p>
          <Link
            href={`/tutors/${tutor._id}`}
            className="btn-press text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded-lg transition-colors"
          >
            Book Session
          </Link>
        </div>
      </div>
    </div>
  );
}
