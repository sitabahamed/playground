"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              iLove<span className="text-red-500">PDF</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <button className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1">
                Tools
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 bg-white shadow-xl rounded-xl border border-gray-100 p-4 w-64 hidden group-hover:block">
                {[
                  { href: "/merge-pdf", label: "Merge PDF" },
                  { href: "/split-pdf", label: "Split PDF" },
                  { href: "/compress-pdf", label: "Compress PDF" },
                  { href: "/pdf-to-jpg", label: "PDF to JPG" },
                  { href: "/jpg-to-pdf", label: "JPG to PDF" },
                  { href: "/rotate-pdf", label: "Rotate PDF" },
                  { href: "/word-to-pdf", label: "Word to PDF" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg text-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {[
            { href: "/merge-pdf", label: "Merge PDF" },
            { href: "/split-pdf", label: "Split PDF" },
            { href: "/compress-pdf", label: "Compress PDF" },
            { href: "/pdf-to-jpg", label: "PDF to JPG" },
            { href: "/jpg-to-pdf", label: "JPG to PDF" },
            { href: "/rotate-pdf", label: "Rotate PDF" },
            { href: "/word-to-pdf", label: "Word to PDF" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-gray-600 hover:text-red-500 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
