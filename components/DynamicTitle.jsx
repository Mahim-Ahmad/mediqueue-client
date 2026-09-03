"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const titleMap = {
  "/": "MediQueue — Find & Book Tutors",
  "/tutors": "All Tutors | MediQueue",
  "/add-tutor": "Add a Tutor | MediQueue",
  "/my-tutors": "My Tutors | MediQueue",
  "/my-booked-sessions": "My Booked Sessions | MediQueue",
  "/login": "Login | MediQueue",
  "/register": "Register | MediQueue",
  "/my-profile": "My Profile | MediQueue",
};

export default function DynamicTitle() {
  const pathname = usePathname();

  useEffect(() => {
    if (titleMap[pathname]) {
      document.title = titleMap[pathname];
    } else if (pathname.startsWith("/tutors/")) {
      document.title = "Tutor Details | MediQueue";
    } else {
      document.title = "MediQueue";
    }
  }, [pathname]);

  return null;
}
