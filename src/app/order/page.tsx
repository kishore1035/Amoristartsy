"use client";

import React, { Suspense } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import OrderForm from "@/components/order/OrderForm";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";

export default function OrderPage() {
  return (
    <main className="relative min-h-screen bg-background text-ink-main selection:bg-primary-500 selection:text-black overflow-x-hidden">
      {/* Header */}
      <Navbar />

      <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        {/* Back Link & Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-sans text-ink-muted hover:text-amber-800 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Studio Gallery</span>
          </Link>
        </div>

        {/* Page Banner Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-amber-800 text-xs mb-4">
            <Heart className="w-3.5 h-3.5 text-accent-terracotta" />
            <span className="font-calligraphy text-base sm:text-lg font-bold">Direct from Guna&apos;s Studio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif text-ink-main mb-4 font-normal tracking-tight">
            Order Mini <span className="font-calligraphy text-5xl sm:text-7xl text-amber-600 italic">Canvases</span>
          </h1>

          <p className="text-base text-ink-muted font-sans leading-relaxed">
            Select your favorite hand-painted physical mini canvases from Guna&apos;s gallery collection. All pieces are available for purchase directly from Guna with direct WhatsApp confirmation.
          </p>
        </div>

        {/* Order Form Container */}
        <Suspense fallback={<div className="text-amber-800 text-sm font-sans animate-pulse">Loading Order Form...</div>}>
          <OrderForm />
        </Suspense>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
