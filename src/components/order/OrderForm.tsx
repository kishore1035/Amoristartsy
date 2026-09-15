"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ARTWORKS, Artwork } from "@/data/artworks";
import ArtworkModal from "@/components/gallery/ArtworkModal";
import { ShoppingBag, Plus, Minus, Check, MapPin, Send, Search, Eye, ArrowDown } from "lucide-react";

const CATEGORIES = ["All", "Pop Culture", "Traditional", "Typography", "Landscapes & Illustrative"] as const;
const INITIAL_VISIBLE_COUNT = 12;

interface OrderQuantities {
  [key: string]: number;
}

export default function OrderForm() {
  const searchParams = useSearchParams();
  const preselectedItem = searchParams?.get("item");

  // Selected quantities map
  const [quantities, setQuantities] = useState<OrderQuantities>({});

  // Inspected Artwork for Modal Detail Pop-up
  const [inspectedArtwork, setInspectedArtwork] = useState<Artwork | null>(null);

  // Search & Filter state for the Buying Page
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  // Customer shipping details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");

  const [orderSent, setOrderSent] = useState(false);

  // Pre-select item from URL query param if present
  useEffect(() => {
    if (preselectedItem && ARTWORKS.some((a) => a.id === preselectedItem)) {
      setQuantities((prev) => ({
        ...prev,
        [preselectedItem]: (prev[preselectedItem] || 0) + 1,
      }));
    }
  }, [preselectedItem]);

  const handleIncrement = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id: string) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  // Filter canvases based on search input & category tab
  const filteredArtworks = useMemo(() => {
    return ARTWORKS.filter((art) => {
      const matchesCategory =
        selectedCategory === "All" || art.category === selectedCategory;
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.canvasShape.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.sizeDimensions.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const visibleArtworks = useMemo(() => {
    return filteredArtworks.slice(0, visibleCount);
  }, [filteredArtworks, visibleCount]);

  // Selected items list & Dynamic Grand Total Calculation
  const selectedItems = ARTWORKS.filter((art) => (quantities[art.id] || 0) > 0);
  const totalItemCount = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);
  const grandTotal = selectedItems.reduce(
    (acc, item) => acc + item.price * (quantities[item.id] || 0),
    0
  );

  // Generate WhatsApp Order Message
  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;

    let itemsSummary = selectedItems
      .map(
        (item) =>
          `- ${item.title} (${item.canvasShape} canvas, x${quantities[item.id]}) — ₹${
            item.price * quantities[item.id]
          }`
      )
      .join("\n");

    const message = `Hi Guna! I'd like to order the following mini canvases:\n\n${itemsSummary}\n\n*Total Amount:* ₹${grandTotal}\n\n*Delivery Details:*\nName: ${name}\nPhone: ${phone}\nAddress: ${address}, ${city} - ${pincode}\n${notes ? `Notes: ${notes}` : ""}\n\nThank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918904865499?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    setOrderSent(true);
  };

  const scrollToCheckout = () => {
    const checkoutEl = document.getElementById("checkout-form");
    if (checkoutEl) {
      checkoutEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Mini-Canvas Selection with Search & Filters (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <h3 className="text-lg sm:text-xl font-bold font-display uppercase tracking-tight text-ink-main flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Select Handcrafted Mini Canvases</span>
            </h3>

            <span className="self-start sm:self-auto text-xs font-mono text-amber-800 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30 font-semibold">
              {selectedItems.length} Selected ({totalItemCount} Items)
            </span>
          </div>

          {/* Search Bar for Buying Page */}
          <div className="relative">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(INITIAL_VISIBLE_COUNT);
              }}
              placeholder="Search by artwork name, character, shape (e.g. Luffy, Heart, Pichwai)..."
              className="w-full pl-9 pr-4 py-3 rounded-2xl bg-white border border-amber-900/15 text-ink-main text-xs font-mono focus:border-amber-500 focus:outline-none transition-colors shadow-sm"
            />
          </div>

          {/* Category Pill Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setVisibleCount(INITIAL_VISIBLE_COUNT);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-amber-500 text-white font-semibold shadow-warm-amber"
                      : "bg-white text-ink-muted hover:text-ink-main border border-amber-900/10 shadow-sm"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Item List */}
          {visibleArtworks.length === 0 ? (
            <div className="p-8 text-center rounded-2xl glass-panel border border-amber-900/15">
              <Search className="w-8 h-8 text-ink-muted mx-auto mb-2" />
              <p className="text-xs font-mono text-ink-muted">
                No mini canvases found matching &quot;{searchQuery}&quot;. Try another search term!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleArtworks.map((artwork) => {
                const qty = quantities[artwork.id] || 0;
                const isSelected = qty > 0;

                return (
                  <div
                    key={artwork.id}
                    className={`p-3 sm:p-3.5 rounded-2xl glass-panel border transition-all flex items-center justify-between gap-3 sm:gap-4 ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/10 shadow-warm-amber"
                        : "border-amber-900/10 hover:border-amber-500/30"
                    }`}
                  >
                    {/* Photo & Metadata (Clicking image or info pops open inspection modal!) */}
                    <div
                      onClick={() => setInspectedArtwork(artwork)}
                      className="flex items-center gap-3 sm:gap-3.5 min-w-0 cursor-pointer group flex-1"
                      title="Click to view artwork details & photo story"
                    >
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-amber-50 border border-amber-900/10 group-hover:border-amber-500/50 transition-colors">
                        <Image
                          src={artwork.image}
                          alt={artwork.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="64px"
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-4 h-4 text-ink-main" />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-white text-[9px] sm:text-[10px] font-mono capitalize text-amber-800 font-semibold border border-amber-900/10">
                            {artwork.canvasShape}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-mono text-ink-muted truncate">
                            {artwork.sizeDimensions}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-ink-main truncate group-hover:text-amber-700 transition-colors flex items-center gap-1.5">
                          <span>{artwork.title}</span>
                          <Eye className="w-3 h-3 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </h4>
                        <span className="text-xs font-mono font-bold text-accent-terracotta">
                          ₹{artwork.price}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      {isSelected ? (
                        <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border border-amber-900/15 shadow-sm">
                          <button
                            type="button"
                            onClick={() => handleDecrement(artwork.id)}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-amber-50 flex items-center justify-center text-ink-main hover:bg-amber-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold w-4 text-center text-amber-700">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleIncrement(artwork.id)}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-amber-50 flex items-center justify-center text-ink-main hover:bg-amber-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleIncrement(artwork.id)}
                          className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white border border-amber-900/15 text-ink-main text-[11px] sm:text-xs font-mono hover:border-amber-500 hover:text-amber-700 transition-all flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add (₹{artwork.price})</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button inside Buying Page */}
          {visibleCount < filteredArtworks.length && (
            <div className="pt-3 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="px-6 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs font-mono text-ink-main hover:border-amber-500 transition-colors shadow-sm"
              >
                Show More Canvases ({visibleArtworks.length} of {filteredArtworks.length})
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Delivery Form (5 Cols) */}
        <div className="lg:col-span-5" id="checkout-form">
          <div className="p-5 sm:p-8 rounded-3xl glass-panel border border-amber-900/15 sticky top-24 sm:top-28 shadow-xl">
            <h3 className="text-lg sm:text-xl font-bold font-display uppercase tracking-tight text-ink-main mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent-terracotta shrink-0" />
              <span>Order Summary & Delivery</span>
            </h3>

            {/* Selected Items Breakdown */}
            {selectedItems.length === 0 ? (
              <div className="p-5 sm:p-6 rounded-2xl bg-white/70 border border-amber-900/10 text-center mb-6 shadow-sm">
                <ShoppingBag className="w-8 h-8 text-ink-muted mx-auto mb-2" />
                <p className="text-xs font-mono text-ink-muted">
                  No mini canvases selected yet. Click any artwork image to inspect details or click &quot;Add&quot;!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 mb-6 max-h-48 overflow-y-auto pr-1">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-amber-900/10 cursor-pointer hover:text-amber-700 transition-colors"
                    onClick={() => setInspectedArtwork(item)}
                    title="Click to view details"
                  >
                    <span className="text-ink-main truncate max-w-[170px] hover:text-amber-700 font-medium">
                      {item.title} (x{quantities[item.id]})
                    </span>
                    <span className="text-amber-700 font-bold">
                      ₹{item.price * quantities[item.id]}
                    </span>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-3 text-sm font-mono font-bold text-ink-main border-t border-amber-900/15">
                  <span>Total Amount:</span>
                  <span className="text-amber-600 text-lg">₹{grandTotal}</span>
                </div>
              </div>
            )}

            {/* Delivery Form */}
            <form onSubmit={handleWhatsAppOrder} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-widest text-ink-muted mb-1 font-semibold">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kishore"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/15 text-ink-main text-xs font-mono focus:border-amber-500 focus:outline-none shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-ink-muted mb-1 font-semibold">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/15 text-ink-main text-xs font-mono focus:border-amber-500 focus:outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest text-ink-muted mb-1 font-semibold">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="560001"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/15 text-ink-main text-xs font-mono focus:border-amber-500 focus:outline-none shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-widest text-ink-muted mb-1 font-semibold">
                  Full Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House No, Street, Landmark, Area"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/15 text-ink-main text-xs font-mono focus:border-amber-500 focus:outline-none resize-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-widest text-ink-muted mb-1 font-semibold">
                  City / State *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bangalore, Karnataka"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/15 text-ink-main text-xs font-mono focus:border-amber-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-widest text-ink-muted mb-1 font-semibold">
                  Custom Gift Notes / Preferences
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Include birthday note"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/15 text-ink-main text-xs font-mono focus:border-amber-500 focus:outline-none shadow-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={selectedItems.length === 0}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  selectedItems.length > 0
                    ? "bg-amber-500 text-white font-semibold hover:bg-amber-600 shadow-warm-amber active:scale-95"
                    : "bg-gray-200 text-ink-muted cursor-not-allowed border border-gray-300"
                }`}
              >
                <Send className="w-4 h-4" />
                <span>
                  {selectedItems.length > 0
                    ? `Dispatch Order via WhatsApp (₹${grandTotal})`
                    : "Select Canvases to Order"}
                </span>
              </button>
            </form>

            {orderSent && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-700" />
                <span>WhatsApp order pre-filled! Click send in WhatsApp.</span>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-amber-900/10 text-[10px] font-mono text-ink-muted text-center">
              Handmade pieces of joy • Direct order with Guna (+91 89048 65499)
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mobile Order Bar */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden bg-amber-500 text-white rounded-2xl shadow-2xl border border-amber-400 p-3.5 flex items-center justify-between animate-in slide-in-from-bottom duration-300">
          <div>
            <div className="text-[11px] font-mono font-medium text-amber-100">
              {totalItemCount} item{totalItemCount > 1 ? "s" : ""} selected
            </div>
            <div className="text-base font-bold font-mono">₹{grandTotal}</div>
          </div>

          <button
            type="button"
            onClick={scrollToCheckout}
            className="px-4 py-2 rounded-xl bg-white text-ink-main font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <span>Proceed to Order</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Interactive Detail Pop-up Modal */}
      <ArtworkModal
        artwork={inspectedArtwork}
        onClose={() => setInspectedArtwork(null)}
        onToggleOrder={(art) => handleIncrement(art.id)}
        isOrdered={(quantities[inspectedArtwork?.id || ''] || 0) > 0}
      />
    </>
  );
}
