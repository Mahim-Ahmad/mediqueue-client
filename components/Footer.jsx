import Link from "next/link";
import { Share2, Camera, X as XIcon, Phone, Mail, MapPin, GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-800 dark:bg-[#0a0c11] text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <GraduationCap size={16} />
            </div>
            <span className="text-lg font-extrabold">
              Media<span className="text-accent-400">Queue</span>
            </span>
          </div>
          <p className="text-sm text-brand-100/80 mt-3 leading-relaxed">
            A simple way to find qualified tutors, book learning sessions, and manage your schedule without the back-and-forth.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-3 text-accent-400">Learning Services</h3>
          <ul className="space-y-2 text-sm text-brand-100/80">
            <li><Link href="/tutors" className="hover:text-white transition-colors">Find a Tutor</Link></li>
            <li><Link href="/add-tutor" className="hover:text-white transition-colors">Become a Tutor</Link></li>
            <li><Link href="/my-booked-sessions" className="hover:text-white transition-colors">My Sessions</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-3 text-accent-400">Contact & Follow</h3>
          <ul className="space-y-2 text-sm text-brand-100/80 mb-4">
            <li className="flex items-center gap-2"><Phone size={14} /> +880 1960-603846</li>
            <li className="flex items-center gap-2"><Mail size={14} /> support@mediqueue.com</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Mirzapur, Tangail, Dhaka</li>
          </ul>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Share2 size={16} />
            </a>
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Camera size={16} />
            </a>
            <a href="#" aria-label="X" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <XIcon size={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-brand-100/60">
        © {new Date().getFullYear()} MediQueue. Built for DIU coursework.
      </div>
    </footer>
  );
}
