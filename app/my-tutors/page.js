"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, X, Inbox } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../lib/api";
import PrivateRoute from "../../components/PrivateRoute";
import Loader from "../../components/Loader";

function MyTutorsContent() {
  const { user, token } = useAuth();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTutor, setEditTutor] = useState(null);
  const [deleteTutor, setDeleteTutor] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadTutors = useCallback(() => {
    if (!user) return;
    setLoading(true);
    apiFetch(`/my-tutors?email=${encodeURIComponent(user.email)}`, { token })
      .then(setTutors)
      .catch((err) => {
        toast.error(err.message || "Failed to load your tutors");
        setTutors([]);
      })
      .finally(() => setLoading(false));
  }, [user, token]);

  useEffect(() => {
    if (token) loadTutors();
  }, [token, loadTutors]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch(`/tutors/${editTutor._id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(editTutor),
      });
      toast.success("Tutor updated successfully!");
      setTutors((prev) => prev.map((t) => (t._id === editTutor._id ? editTutor : t)));
      setEditTutor(null);
    } catch (err) {
      toast.error(err.message || "Failed to update tutor.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiFetch(`/tutors/${deleteTutor._id}`, { method: "DELETE", token });
      toast.success("Tutor deleted.");
      setTutors((prev) => prev.filter((t) => t._id !== deleteTutor._id));
      setDeleteTutor(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete tutor.");
    }
  };

  if (loading) return <Loader label="Loading your tutors..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Tutors</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tutors you've added to MediQueue.</p>

      {tutors.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Inbox size={32} className="mx-auto mb-3" />
          <p className="text-sm">You haven&apos;t added any tutors yet.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto bg-white dark:bg-[#171a22] rounded-2xl border border-brand-100 dark:border-white/10 card-shadow">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-brand-100 dark:border-white/10">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Fee</th>
                <th className="px-4 py-3 font-medium">Slots</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tutors.map((t) => (
                <tr key={t._id} className="border-b border-brand-50 dark:border-white/5 last:border-0">
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100 font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{t.subject}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">৳{t.hourlyFee}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{t.totalSlot}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditTutor(t)} className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 dark:hover:bg-white/10">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteTutor(t)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editTutor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-[#171a22] rounded-2xl p-6 w-full max-w-md relative max-h-[85vh] overflow-y-auto">
            <button onClick={() => setEditTutor(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Update Tutor</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-3">
              {["name", "subject", "availableDays", "availableTime", "hourlyFee", "totalSlot", "institution", "experience", "location", "teachingMode"].map((field) => (
                <div key={field}>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-300 capitalize">{field}</label>
                  <input
                    value={editTutor[field] ?? ""}
                    onChange={(e) => setEditTutor((t) => ({ ...t, [field]: e.target.value }))}
                    className="w-full mt-1 border border-brand-200 dark:border-white/10 bg-white dark:bg-[#0f1218] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  />
                </div>
              ))}
              <button type="submit" disabled={saving}
                className="btn-press w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition-colors mt-1 disabled:opacity-60">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {deleteTutor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-[#171a22] rounded-2xl p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Delete {deleteTutor.name}?</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This action cannot be undone.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setDeleteTutor(null)} className="flex-1 border border-brand-200 dark:border-white/10 rounded-lg py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-white/10">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyTutors() {
  return (
    <PrivateRoute>
      <MyTutorsContent />
    </PrivateRoute>
  );
}
