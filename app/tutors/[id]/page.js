"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { MapPin, Clock, Wallet, GraduationCap, Layers, ArrowLeft, X } from "lucide-react";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import PrivateRoute from "../../../components/PrivateRoute";
import Loader from "../../../components/Loader";

function TutorDetailsContent() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ studentName: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch(`/tutors/${id}`)
      .then(setTutor)
      .catch(() => setTutor(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Loading tutor details..." />;

  if (!tutor) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">Tutor not found.</p>
        <Link href="/tutors" className="text-brand-600 underline mt-2 inline-block">Back to Tutors</Link>
      </div>
    );
  }

  const handleBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiFetch("/bookings", {
        method: "POST",
        token,
        body: JSON.stringify({
          tutorId: tutor._id,
          studentName: form.studentName,
          phone: form.phone,
          studentEmail: user.email,
        }),
      });
      toast.success("Session booked successfully!");
      setModalOpen(false);
      setForm({ studentName: "", phone: "" });
      const updated = await apiFetch(`/tutors/${id}`);
      setTutor(updated);
    } catch (err) {
      toast.error(err.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const slotsLeft = Number(tutor.totalSlot) > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/tutors" className="inline-flex items-center gap-1 text-sm text-brand-700 dark:text-brand-300 hover:underline mb-6">
        <ArrowLeft size={15} /> Back to Tutors
      </Link>

      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        <div className="bg-white dark:bg-[#171a22] border border-brand-100 dark:border-white/10 rounded-2xl card-shadow p-6 text-center h-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tutor.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(tutor.name || "Tutor")}`}
            alt={tutor.name}
            className="w-24 h-24 rounded-full object-cover mx-auto"
          />
          <h1 className="mt-3 font-bold text-gray-900 dark:text-white">{tutor.name}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tutor.subject}</p>
          <p className="text-xl font-extrabold text-brand-700 dark:text-brand-300 mt-3">৳{tutor.hourlyFee}/hr</p>
          <p className="text-xs text-gray-400 mt-1">{slotsLeft ? `${tutor.totalSlot} slots left` : "Fully booked"}</p>
        </div>

        <div className="bg-white dark:bg-[#171a22] border border-brand-100 dark:border-white/10 rounded-2xl card-shadow p-6">
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <p className="flex items-center gap-2"><Clock size={15} /> {tutor.availableDays} &middot; {tutor.availableTime}</p>
            <p className="flex items-center gap-2"><MapPin size={15} /> {tutor.location}</p>
            <p className="flex items-center gap-2"><GraduationCap size={15} /> {tutor.institution} &middot; {tutor.experience} yrs</p>
            <p className="flex items-center gap-2"><Layers size={15} /> {tutor.teachingMode}</p>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setModalOpen(true)}
              className="btn-press bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Book Session
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-[#171a22] rounded-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setModalOpen(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Book with {tutor.name}</h2>

            {!slotsLeft ? (
              <p className="text-sm text-red-500 mt-4">No available slots left.</p>
            ) : new Date() < new Date(tutor.sessionStartDate) ? (
              <p className="text-sm text-amber-500 mt-4">Booking is not available yet for this tutor.</p>
            ) : (
              <form onSubmit={handleBook} className="mt-4 flex flex-col gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Student Name</label>
                  <input required value={form.studentName} onChange={(e) => setForm((f) => ({ ...f, studentName: e.target.value }))}
                    className="w-full mt-1 border border-brand-200 dark:border-white/10 bg-white dark:bg-[#0f1218] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Phone</label>
                  <input required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full mt-1 border border-brand-200 dark:border-white/10 bg-white dark:bg-[#0f1218] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Your Email</label>
                  <input disabled value={user.email}
                    className="w-full mt-1 border border-brand-100 dark:border-white/10 bg-brand-50 dark:bg-white/5 rounded-lg px-3.5 py-2.5 text-sm text-gray-500 dark:text-gray-400" />
                </div>
                <button type="submit" disabled={submitting}
                  className="btn-press w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition-colors mt-1 disabled:opacity-60">
                  {submitting ? "Booking..." : "Confirm Booking"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TutorDetails() {
  return (
    <PrivateRoute>
      <TutorDetailsContent />
    </PrivateRoute>
  );
}
