"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CalendarClock, Sparkles } from "lucide-react";
import { apiFetch } from "../lib/api";
import TutorCard from "../components/TutorCard";
import BannerCarousel from "../components/BannerCarousel";
import Loader from "../components/Loader";

const howItWorks = [
  { title: "Browse Tutors", text: "Explore tutors by subject, teaching mode, and availability.", icon: Sparkles },
  { title: "Book a Session", text: "Pick a tutor and reserve your slot — instantly confirmed.", icon: CalendarClock },
  { title: "Learn with Confidence", text: "Verified tutor profiles mean no surprises on session day.", icon: ShieldCheck },
];

const subjects = ["Mathematics", "Physics", "Chemistry", "English", "Biology", "Computer Science"];

export default function Home() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch("/tutors/featured")
      .then(setTutors)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <BannerCarousel />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <section>
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Available Tutors</h2>
            <Link href="/tutors" className="text-sm font-medium text-brand-700 dark:text-brand-300 hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <Loader label="Loading tutors..." />
          ) : error || tutors.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-16">
              Couldn&apos;t load tutors right now. Make sure the server is running.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tutors.map((tutor) => (
                <TutorCard key={tutor._id} tutor={tutor} />
              ))}
            </div>
          )}
        </section>

        {/* Extra section 1: How it works */}
        <section className="mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">How MediQueue Works</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {howItWorks.map((step) => (
              <div key={step.title} className="bg-white dark:bg-[#171a22] rounded-2xl border border-brand-100 dark:border-white/10 p-5 card-shadow">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-white/10 flex items-center justify-center text-brand-700 dark:text-brand-300 mb-3">
                  <step.icon size={18} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{step.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Extra section 2: Popular subjects */}
        <section className="mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">Popular Subjects</h2>
          <div className="flex flex-wrap gap-3">
            {subjects.map((subject) => (
              <span
                key={subject}
                className="bg-brand-50 dark:bg-white/10 text-brand-700 dark:text-brand-300 text-sm font-medium px-4 py-2 rounded-full border border-brand-100 dark:border-white/10"
              >
                {subject}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
