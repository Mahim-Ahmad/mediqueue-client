"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { XCircle, Inbox } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../lib/api";
import PrivateRoute from "../../components/PrivateRoute";
import Loader from "../../components/Loader";

function MyBookedSessionsContent() {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);

  const loadBookings = useCallback(() => {
    if (!user) return;
    setLoading(true);
    apiFetch(`/my-bookings?email=${encodeURIComponent(user.email)}`, { token })
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [user, token]);

  useEffect(() => {
    if (token) loadBookings();
  }, [token, loadBookings]);

  const handleCancel = async () => {
    try {
      await apiFetch(`/bookings/${cancelTarget._id}/cancel`, { method: "PATCH", token });
      toast.success("Booking cancelled.");
      setBookings((prev) => prev.map((b) => (b._id === cancelTarget._id ? { ...b, status: "cancelled" } : b)));
      setCancelTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to cancel booking.");
    }
  };

  if (loading) return <Loader label="Loading your sessions..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Booked Sessions</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sessions you've booked with tutors.</p>

      {bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Inbox size={32} className="mx-auto mb-3" />
          <p className="text-sm">You haven&apos;t booked any sessions yet.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto bg-white dark:bg-[#171a22] rounded-2xl border border-brand-100 dark:border-white/10 card-shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-brand-100 dark:border-white/10">
                <th className="px-4 py-3 font-medium">Tutor</th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-brand-50 dark:border-white/5 last:border-0">
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100 font-medium">{b.tutorName}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{b.studentName}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{b.studentEmail}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      b.status === "cancelled"
                        ? "bg-red-50 text-red-600 dark:bg-red-500/10"
                        : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {b.status !== "cancelled" && (
                      <button onClick={() => setCancelTarget(b)} className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:underline">
                        <XCircle size={14} /> Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {cancelTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-[#171a22] rounded-2xl p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Cancel this session?</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Your booking with {cancelTarget.tutorName} will be marked as cancelled.
            </p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setCancelTarget(null)} className="flex-1 border border-brand-200 dark:border-white/10 rounded-lg py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-white/10">
                Keep it
              </button>
              <button onClick={handleCancel} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 text-sm font-medium">
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyBookedSessions() {
  return (
    <PrivateRoute>
      <MyBookedSessionsContent />
    </PrivateRoute>
  );
}
