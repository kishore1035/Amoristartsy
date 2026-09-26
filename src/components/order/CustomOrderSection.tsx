"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Palette,
  Heart,
  Calendar,
  MapPin,
  Send,
  Check,
  ImageIcon,
  MessageCircle,
  HelpCircle,
} from "lucide-react";

interface MediumOption {
  id: string;
  name: string;
  startingPrice: string;
  popularSize: string;
  description: string;
  badge?: string;
}

const MEDIUMS: MediumOption[] = [
  {
    id: "mini-canvas",
    name: "Mini Canvas Board",
    startingPrice: "₹150",
    popularSize: "4x4 or 5x8 inch",
    description: "Compact canvas board, perfect for desk decor and mini easel display.",
    badge: "Most Popular",
  },
  {
    id: "wood-slice",
    name: "Natural Wood Slice",
    startingPrice: "₹400",
    popularSize: "3.5 - 4 inch round",
    description: "Authentic tree branch slice with natural rustic bark rim.",
    badge: "Trending",
  },
  {
    id: "paper-art",
    name: "300 GSM Heavyweight Paper",
    startingPrice: "₹250",
    popularSize: "A5 / A4 textured sheet",
    description: "Heavy watercolor/acrylic paper, ideal for framing and gifting.",
  },
  {
    id: "shaped-canvas",
    name: "Custom Shaped Canvas",
    startingPrice: "₹600",
    popularSize: "Heart, Circle, or Diamond",
    description: "Custom geometric and heart-cut canvas for romantic gifts & statement walls.",
  },
  {
    id: "stretched-canvas",
    name: "Stretched Canvas Frame",
    startingPrice: "₹1,200",
    popularSize: "8x10 or 10x12 inch",
    description: "Gallery-wrapped wooden frame canvas ready to hang on walls.",
  },
];

const THEMES = [
  { id: "anime", label: "Anime & Pop Culture", hint: "Naruto, Luffy, Spider-Man, Ghibli, Batman" },
  { id: "pet", label: "Pet Portrait", hint: "Dogs, cats, birds with name and floral accents" },
  { id: "couple", label: "Couples & Memories", hint: "Silhouettes, date night, polaroid painting" },
  { id: "landscape", label: "Nature & Dreamy Skies", hint: "Sunsets, Starry Night, wildflowers, ocean" },
  { id: "typography", label: "Spotify Code & Quotes", hint: "Favorite lyrics, song plaque, names" },
  { id: "other", label: "Something Unique", hint: "Your own custom idea or creative vision" },
];

export default function CustomOrderSection() {
  const [selectedMedium, setSelectedMedium] = useState<string>("mini-canvas");
  const [selectedTheme, setSelectedTheme] = useState<string>("anime");
  const [customSize, setCustomSize] = useState<string>("");
  const [characterOrIdea, setCharacterOrIdea] = useState<string>("");
  const [occasion, setOccasion] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const currentMedium = MEDIUMS.find((m) => m.id === selectedMedium);
  const currentTheme = THEMES.find((t) => t.id === selectedTheme);

  const handleCustomOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `Hi Guna! I'd like to commission a *Custom Painting* from your studio:\n\n` +
      `*Custom Order Details:*\n` +
      `• Medium/Surface: ${currentMedium?.name || "Custom"} (from ${currentMedium?.startingPrice})\n` +
      `• Preferred Size: ${customSize || currentMedium?.popularSize || "Artist Recommendation"}\n` +
      `• Theme/Category: ${currentTheme?.label || "Custom Idea"}\n` +
      `• Character / Painting Vision:\n  "${characterOrIdea}"\n\n` +
      (occasion ? `• Occasion / Target Date: ${occasion}\n` : "") +
      `• Reference Photo: I will send reference images directly in this WhatsApp chat!\n\n` +
      `*Contact & Delivery:*\n` +
      `• Name: ${name}\n` +
      `• Phone: ${phone}\n` +
      `• City/State: ${city}\n\n` +
      `Could you please share your availability, timeline, and quote for this piece? Thank you!`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(message).catch(() => {});
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918904865499?text=${encodedMessage}`;

    const isMobile = typeof navigator !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = whatsappUrl;
    } else {
      window.open(whatsappUrl, "_blank");
    }

    setSubmitted(true);
  };

  return (
    <section id="custom" className="py-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative z-10 scroll-mt-24">
      {/* Header Badge & Title */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs sm:text-sm font-medium mb-4 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-700 animate-pulse" />
          <span>Made-to-Order Custom Paintings</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif text-ink-main tracking-tight font-normal mb-4">
          Commission Your <span className="font-calligraphy text-4xl sm:text-6xl text-amber-600 italic">Dream Artwork</span>
        </h2>

        <p className="text-sm sm:text-base text-ink-muted font-sans leading-relaxed">
          Have a favorite anime scene, pet photo, special anniversary date, or personal quote?
          Guna hand-paints each custom commission with rich acrylics, tailored to your chosen surface and dimensions.
        </p>
      </div>

      {/* Main Commission Builder Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-amber-900/15 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <form onSubmit={handleCustomOrderSubmit} className="relative z-10 space-y-10">
          {/* Step 1: Choose Canvas / Medium */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold font-sans">
                1
              </span>
              <h3 className="font-serif text-lg sm:text-xl text-ink-main font-semibold">
                Select Canvas Type & Medium
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {MEDIUMS.map((m) => {
                const isSelected = selectedMedium === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMedium(m.id)}
                    className={`p-4 rounded-2xl text-left transition-all border relative flex flex-col justify-between ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500 shadow-md ring-2 ring-amber-500/30"
                        : "bg-white/80 border-amber-900/15 hover:border-amber-400 hover:bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-serif font-bold text-ink-main text-sm sm:text-base">
                          {m.name}
                        </span>
                        {m.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-amber-500 text-white">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-muted leading-relaxed mb-3">
                        {m.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-amber-900/10 flex items-center justify-between text-xs font-sans">
                      <span className="text-amber-800 font-medium">Starts {m.startingPrice}</span>
                      <span className="text-ink-muted text-[11px]">{m.popularSize}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Choose Art Theme / Style */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold font-sans">
                2
              </span>
              <h3 className="font-serif text-lg sm:text-xl text-ink-main font-semibold">
                Choose Artwork Subject or Theme
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {THEMES.map((t) => {
                const isSelected = selectedTheme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTheme(t.id)}
                    className={`p-3.5 rounded-xl text-left transition-all border ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-white/80 border-amber-900/15 text-ink-main hover:border-amber-400 hover:bg-white"
                    }`}
                  >
                    <div className="font-sans font-semibold text-xs sm:text-sm mb-0.5">
                      {t.label}
                    </div>
                    <div className={`text-[11px] leading-tight ${isSelected ? "text-emerald-100" : "text-ink-muted"}`}>
                      {t.hint}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Describe Your Vision & Reference Details */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold font-sans">
                3
              </span>
              <h3 className="font-serif text-lg sm:text-xl text-ink-main font-semibold">
                Tell Guna What You Want Painted
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-medium text-amber-950/80 mb-1.5">
                  Describe Your Painting Idea / Character / Color Preferences *
                </label>
                <textarea
                  required
                  rows={3}
                  value={characterOrIdea}
                  onChange={(e) => setCharacterOrIdea(e.target.value)}
                  placeholder="e.g. A 4x4 mini canvas of Roronoa Zoro from One Piece with a dark green background, or a pet cat portrait with tiny white daisies around it."
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-amber-900/15 text-ink-main text-xs sm:text-sm font-sans focus:border-amber-500 focus:outline-none resize-none shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-amber-950/80 mb-1.5">
                    Preferred Size / Dimensions (Optional)
                  </label>
                  <input
                    type="text"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    placeholder={`e.g. 5x8 inch (Default: ${currentMedium?.popularSize})`}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/15 text-ink-main text-xs sm:text-sm font-sans focus:border-amber-500 focus:outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-medium text-amber-950/80 mb-1.5">
                    Occasion or Needed By Date (Optional)
                  </label>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder="e.g. Birthday gift needed by next Saturday"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/15 text-ink-main text-xs sm:text-sm font-sans focus:border-amber-500 focus:outline-none shadow-sm"
                  />
                </div>
              </div>

              {/* Reference Photo Helper Callout */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs font-sans text-amber-950">
                <ImageIcon className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Have reference images?</strong> You can attach photos or screenshots directly in the WhatsApp chat when you submit your inquiry!
                </p>
              </div>
            </div>
          </div>

          {/* Step 4: Contact & Delivery Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold font-sans">
                4
              </span>
              <h3 className="font-serif text-lg sm:text-xl text-ink-main font-semibold">
                Your Contact & Shipping Location
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-sans font-medium text-amber-950/80 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Guna"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/15 text-ink-main text-xs sm:text-sm font-sans focus:border-amber-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-amber-950/80 mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/15 text-ink-main text-xs sm:text-sm font-sans focus:border-amber-500 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-amber-950/80 mb-1.5">
                  City & State *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bangalore, Karnataka"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-900/15 text-ink-main text-xs sm:text-sm font-sans focus:border-amber-500 focus:outline-none shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-amber-900/15 space-y-4">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-900/10 hover:shadow-xl transition-all active:scale-[0.99] cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span>Send Custom Order Inquiry via WhatsApp</span>
            </button>

            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-sans space-y-1">
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>WhatsApp conversation opened!</span>
                </div>
                <p className="text-emerald-800 text-xs leading-relaxed">
                  Your custom commission details have been formatted and copied to your clipboard. Simply send the message to Guna in WhatsApp along with any reference photos!
                </p>
              </div>
            )}

            <div className="text-center text-xs font-sans text-ink-muted">
              <span>All custom artworks are hand-painted by Guna</span>
              <span className="mx-2">&bull;</span>
              <span>Estimates & timelines confirmed before painting begins</span>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
