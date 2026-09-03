import Link from "next/link";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <Ghost size={48} className="mx-auto text-brand-300" />
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-4">404</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">This page doesn&apos;t exist. Let&apos;s get you back to booking tutors.</p>
      <Link
        href="/"
        className="inline-block mt-6 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
