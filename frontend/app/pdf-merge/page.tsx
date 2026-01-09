"use client";

import { useState } from "react";
import Link from "next/link";
import PDFMergeUpload from "@/components/PDFMerge/PDFMergeUpload";

export default function PDFMergePage() {
  return (
    <div className="flex min-h-screen flex-col items-center py-16 px-6 font-sans">
      {/* Back Button */}
      <Link
        href="/"
        className="mb-8 p-3 rounded-full backdrop-blur-xl border border-white/20 bg-black/10 shadow-lg hover:bg-white/10 transition-all duration-300 ease-out hover:scale-110 active:scale-95"
      >
        <svg
          className="w-6 h-6 text-white/80 hover:text-white transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Link>

      <main className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">PDF Merge</h1>
          <p className="text-white/70">
            Upload multiple PDFs and merge them in any order you want.
          </p>
        </div>

        <PDFMergeUpload />
      </main>
    </div>
  );
}
