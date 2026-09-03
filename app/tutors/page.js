"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Filter } from "lucide-react";
import { apiFetch } from "../../lib/api";
import TutorCard from "../../components/TutorCard";
import Loader from "../../components/Loader";

export default function AllTutors() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadTutors = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    apiFetch(`/tutors?${params.toString()}`)
      .then(setTutors)
      .catch(() => setTutors([]))
      .finally(() => setLoading(false));
  }, [search, startDate, endDate]);

  useEffect(() => {
    const timer = setTimeout(loadTutors, 400);
    return () => clearTimeout(timer);
  }, [loadTutors]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">All Tutors</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse every tutor available on MediQueue.</p>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tutor by name..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-brand-200 dark:border-white/10 bg-white dark:bg-[#171a22] text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400 hidden sm:block" />
          <input
            type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-brand-200 dark:border-white/10 bg-white dark:bg-[#171a22] text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <span className="text-gray-400 text-sm">to</span>
          <input
            type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-brand-200 dark:border-white/10 bg-white dark:bg-[#171a22] text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <Loader label="Loading tutors..." />
        ) : tutors.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">No tutors found matching your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tutors.map((tutor) => (
              <TutorCard key={tutor._id} tutor={tutor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
