"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { apiFetch, API_URL } from "../../lib/api";
import PrivateRoute from "../../components/PrivateRoute";

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science", "Economics"];
const modes = ["Online", "Offline", "Both"];

const emptyForm = {
  name: "", photo: "", subject: subjects[0], availableDays: "", availableTime: "",
  hourlyFee: "", totalSlot: "", institution: "", experience: "", location: "", teachingMode: modes[0],
};

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

function AddTutorForm() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [sessionDate, setSessionDate] = useState(new Date());
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const uploadPhoto = async () => {
    if (!photoFile) return form.photo || "";
    const formData = new FormData();
    formData.append("image", photoFile);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!data.success) throw new Error("Image upload failed");
    return data.data.display_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const photoUrl = await uploadPhoto();
      await apiFetch("/tutors", {
        method: "POST",
        token,
        body: JSON.stringify({
          ...form,
          photo: photoUrl,
          sessionStartDate: sessionDate.toISOString(),
        }),
      });
      toast.success("Tutor added successfully!");
      setForm(emptyForm);
      setPhotoFile(null);
      router.push("/my-tutors");
    } catch (err) {
      toast.error(err.message || "Failed to add tutor. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Add a Tutor</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create a tutor profile for students to book.</p>

      <form onSubmit={handleSubmit} className="mt-6 bg-white dark:bg-[#171a22] border border-brand-100 dark:border-white/10 rounded-2xl card-shadow p-6 flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Tutor Name</label>
          <input name="name" required value={form.name} onChange={handleChange}
            className="w-full mt-1 border border-brand-200 dark:border-white/10 bg-white dark:bg-[#0f1218] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Photo</label>
          <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])}
            className="w-full mt-1 text-sm text-gray-600 dark:text-gray-300 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:bg-brand-50 dark:file:bg-white/10 file:text-brand-700 dark:file:text-brand-300 file:text-xs file:font-semibold" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Subject / Category</label>
            <select name="subject" value={form.subject} onChange={handleChange}
              className="w-full mt-1 border border-brand-200 dark:border-white/10 bg-white dark:bg-[#0f1218] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-200">
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Teaching Mode</label>
            <select name="teachingMode" value={form.teachingMode} onChange={handleChange}
              className="w-full mt-1 border border-brand-200 dark:border-white/10 bg-white dark:bg-[#0f1218] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-200">
              {modes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Available Days</label>
            <input name="availableDays" required value={form.availableDays} onChange={handleChange} placeholder="Sun - Thu"
              className="w-full mt-1 border border-brand-200 dark:border-white/10 bg-white dark:bg-[#0f1218] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Available Time</label>
            <input name="availableTime" required value={form.availableTime} onChange={handleChange} placeholder="5:00 PM - 8:00 PM"
              className="w-full mt-1 border border-brand-200 dark:border-white/10 bg-white dark:bg-[#0f1218] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Hourly Fee (৳)</label>
            <input type="number" name="hourlyFee" required value={form.hourlyFee} onChange={handleChange}
              className="w-full mt-1 border border-brand-200 dark:border-white/10 bg-white dark:bg-[#0f1218] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Total Slot</label>
            <input type="number" name="totalSlot" required value={form.totalSlot} onChange={handleChange}
              className="w-full mt-1 border border-brand-200 dark:border-white/10 bg-white dark:bg-[#0f1218] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Session Start Date</label>
          <DatePicker
            selected={sessionDate}
            onChange={(date) => setSessionDate(date)}
            className="w-full mt-1 border border-brand-200 dark:border-white/10 bg-white dark:bg-[#0f1218] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-200"
            dateFormat="dd MMM yyyy"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Institution</label>
            <input name="institution" required value={form.institution} onChange={handleChange}
              className="w-full mt-1 border border-brand-200 dark:border-white/10 bg-white dark:bg-[#0f1218] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Experience (years)</label>
            <input name="experience" required value={form.experience} onChange={handleChange}
              className="w-full mt-1 border border-brand-200 dark:border-white/10 bg-white dark:bg-[#0f1218] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Location (Area/City)</label>
          <input name="location" required value={form.location} onChange={handleChange}
            className="w-full mt-1 border border-brand-200 dark:border-white/10 bg-white dark:bg-[#0f1218] rounded-lg px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </div>

        <button type="submit" disabled={submitting}
          className="btn-press w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2 disabled:opacity-60">
          {submitting ? "Submitting..." : "Submit Tutor"}
        </button>
      </form>
    </div>
  );
}

export default function AddTutor() {
  return (
    <PrivateRoute>
      <AddTutorForm />
    </PrivateRoute>
  );
}
