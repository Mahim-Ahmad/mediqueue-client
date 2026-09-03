"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const slides = [
  {
    title: "Find the Right Tutor for Every Subject",
    text: "From Mathematics to Physics — book a session with a verified tutor in minutes.",
  },
  {
    title: "No More Scheduling Headaches",
    text: "Automatic slot tracking means no double-booking, no confusion, no wasted time.",
  },
  {
    title: "Learn Online or In-Person",
    text: "Choose the teaching mode that fits you — Online, Offline, or a mix of both.",
  },
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center relative">
        <div key={index} className="animate-in">
          <span className="inline-block bg-white/10 text-accent-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            🎓 MediQueue Tutor Booking
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto">
            {slides[index].title}
          </h1>
          <p className="text-brand-100/80 max-w-lg mx-auto mt-4 text-sm sm:text-base">
            {slides[index].text}
          </p>
        </div>
        <Link
          href="/tutors"
          className="btn-press inline-flex items-center gap-2 bg-accent-400 hover:bg-accent-500 text-brand-900 font-semibold px-6 py-3 rounded-xl mt-8 transition-colors"
        >
          Browse Tutors <ArrowRight size={18} />
        </Link>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button onClick={prev} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-accent-400" : "w-1.5 bg-white/30"}`}
              />
            ))}
          </div>
          <button onClick={next} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
