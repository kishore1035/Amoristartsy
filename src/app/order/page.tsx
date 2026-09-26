"use client";

import React, { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import OrderForm from "@/components/order/OrderForm";
import CustomOrderSection from "@/components/order/CustomOrderSection";
import { ArrowLeft, Heart, Sparkles, Layers, Palette } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function OrderPageContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams?.get("mode") === "custom" ? "custom" : "catalog";
  const [orderMode, setOrderMode] = useState<"catalog" | "custom">(initialMode);

  useEffect(() => {
    if (searchParams?.get("mode") === "custom") {
      setOrderMode("custom");
    }
  }, [searchParams]);

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative z-10">
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
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-amber-800 text-xs mb-4">
          <Heart className="w-3.5 h-3.5 text-accent-terracotta" />
          <span className="font-sans text-xs sm:text-sm font-medium">Direct from Guna&apos;s Studio</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif text-ink-main mb-4 font-normal tracking-tight">
          {orderMode === "catalog" ? (
            <>
              Order Your Favorite <span className="font-calligraphy text-5xl sm:text-7xl text-amber-600 italic">Paintings</span>
            </>
          ) : (
            <>
              Customize Your <span className="font-calligraphy text-5xl sm:text-7xl text-amber-600 italic">Artwork</span>
            </>
          )}
        </h1>

        <p className="text-base text-ink-muted font-sans leading-relaxed">
          {orderMode === "catalog"
            ? "Select your favorite hand-painted physical artworks from Guna's gallery collection with instant WhatsApp confirmation."
            : "Have a specific painting, character, or idea in mind? Choose your canvas, describe your vision, and commission a custom artwork hand-painted by Guna."}
        </p>
      </div>

      {/* Order Mode Switcher Tabs */}
      <div className="mb-10 flex items-center gap-3 p-1.5 rounded-2xl bg-white/80 border border-amber-900/15 max-w-md shadow-sm">
        <button
          type="button"
          onClick={() => setOrderMode("catalog")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-all flex items-center justify-center gap-2 ${
            orderMode === "catalog"
              ? "bg-amber-500 text-white shadow-warm-amber"
              : "text-ink-muted hover:text-ink-main"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Studio Catalog (96)</span>
        </button>

        <button
          type="button"
          onClick={() => setOrderMode("custom")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-all flex items-center justify-center gap-2 ${
            orderMode === "custom"
              ? "bg-amber-500 text-white shadow-warm-amber"
              : "text-ink-muted hover:text-ink-main"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Customize Order</span>
        </button>
      </div>

      {/* Mode View: Catalog Order Form OR Custom Commission Builder */}
      {orderMode === "catalog" ? (
        <OrderForm onSwitchToCustom={() => setOrderMode("custom")} />
      ) : (
        <CustomOrderSection />
      )}
    </div>
  );
}

export default function OrderPage() {
  return (
    <main className="relative min-h-screen bg-background text-ink-main selection:bg-amber-200 selection:text-amber-950 overflow-x-hidden">
      <Navbar />
      <Suspense fallback={<div className="pt-32 text-center text-amber-800 text-sm font-sans animate-pulse">Loading Studio Order Desk...</div>}>
        <OrderPageContent />
      </Suspense>
      <Footer />
    </main>
  );
}
