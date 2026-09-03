"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import PrivateRoute from "../../components/PrivateRoute";

function MyProfileContent() {
  const { user, updateUserProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.displayName || "", photoURL: user?.photoURL || "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile(form.name, form.photoURL);
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <div className="bg-white dark:bg-[#171a22] border border-brand-100 dark:border-white/10 rounded-2xl card-shadow p-8 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.photoURL || "https://api.dicebear.com/7.x/initials/svg?seed=" + (user.displayName || user.email)}
          alt={user.displayName || "User"}
          referrerPolicy="no-referrer"
          className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-brand-100 dark:ring-white/10"
        />
        <h1 className="mt-3 text-lg font-bold text-gray-900 dark:text-white">{user.displayName || "No name set"}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="btn-press mt-5 inline-flex items-center gap-1.5 border border-brand-200 dark:border-white/10 text-brand-700 dark:text-brand-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-50 dark:hover:bg-white/10 transition-colors"
          >
            <Pencil size={14} /> Update Information
          </button>
        ) : (
          <form onSubmit={handleSave} className="mt-5 flex flex-col gap-3 text-left">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Name</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full mt-1 border border-brand-200 dark:border-white/10 bg-white dark:bg-[#0f1218] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-200" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Photo URL</label>
              <input value={form.photoURL} onChange={(e) => setForm((f) => ({ ...f, photoURL: e.target.value }))}
                className="w-full mt-1 border border-brand-200 dark:border-white/10 bg-white dark:bg-[#0f1218] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-200" />
            </div>
            <div className="flex gap-3 mt-1">
              <button type="button" onClick={() => setEditing(false)} className="flex-1 border border-brand-200 dark:border-white/10 rounded-lg py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-white/10">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-60">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function MyProfile() {
  return (
    <PrivateRoute>
      <MyProfileContent />
    </PrivateRoute>
  );
}
