"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white"
          >
            ArchiTrade
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
            <Link href="/" className="hover:text-appPrimary transition-colors">
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-appPrimary transition-colors"
            >
              About
            </Link>
            <Link
              href="/services"
              className="hover:text-appPrimary transition-colors"
            >
              Ebook
            </Link>
            <Link
              href="/contact"
              className="hover:text-appPrimary transition-colors"
            >
              Contact
            </Link>

            {/* Blog Button */}
            <Link
              href="/blog"
              className="ml-4 inline-flex items-center rounded-md bg-appPrimary-600 px-4 py-2 text-sm font-medium text-white hover:bg-appPrimary-500 transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-300 hover:text-appPrimary transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-zinc-950 border-t border-gray-800">
          <div className="px-4 py-6 space-y-4 text-base font-medium text-gray-300">
            <Link
              href="/"
              className="block px-4 py-3 rounded-lg hover:bg-zinc-900 hover:text-appPrimary transition-colors"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-4 py-3 rounded-lg hover:bg-zinc-900 hover:text-appPrimary transition-colors"
              onClick={() => setOpen(false)}
            >
              About
            </Link>
            <Link
              href="/services"
              className="block px-4 py-3 rounded-lg hover:bg-zinc-900 hover:text-appPrimary transition-colors"
              onClick={() => setOpen(false)}
            >
              Ebook
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-3 rounded-lg hover:bg-zinc-900 hover:text-appPrimary transition-colors"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/blog"
              className="block px-4 py-3 rounded-lg bg-appPrimary-600 text-white hover:bg-appPrimary-500 transition-colors"
              onClick={() => setOpen(false)}
            >
              Blog
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
