"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/updates", label: "Latest Updates" },
  { href: "/donation-centers", label: "Find Donation Centers" },
  { href: "/register", label: "Register Donation Center" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-navy text-white shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Nepal Disaster Relief
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-6 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:text-brand-saffron"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="flex h-11 w-11 items-center justify-center rounded-md md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-2xl leading-none">{open ? "\u2715" : "\u2630"}</span>
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="flex flex-col border-t border-white/10 bg-brand-navy md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/10 px-4 py-3 text-base font-medium hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}