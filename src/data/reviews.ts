import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5
  date: string;
  artworkId?: string; // Optional reference to a specific artwork ID
  artworkTitle: string; // e.g. "Crescent Moon Camping Landscape" or "Custom Commission"
  category?: string;
  comment: string;
  location?: string;
  verified: boolean;
  helpfulCount: number;
  avatarBg?: string;
  createdAt?: string;
}

export const INITIAL_REVIEWS: Review[] = [];

const LOCAL_STORAGE_KEY = "amoristartsy_reviews_v1";

// Map database column names (snake_case) to client Review interface (camelCase)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToReview(row: any): Review {
  return {
    id: row.id,
    author: row.author,
    rating: row.rating,
    date: row.date,
    artworkId: row.artwork_id || undefined,
    artworkTitle: row.artwork_title,
    category: row.category || undefined,
    comment: row.comment,
    location: row.location || "India",
    verified: row.verified ?? true,
    helpfulCount: row.helpful_count ?? 0,
    avatarBg: row.avatar_bg || undefined,
    createdAt: row.created_at,
  };
}

// Map client Review to database record format
function mapReviewToRow(rev: Review) {
  return {
    id: rev.id,
    author: rev.author,
    rating: rev.rating,
    date: rev.date,
    artwork_id: rev.artworkId || null,
    artwork_title: rev.artworkTitle,
    category: rev.category || null,
    comment: rev.comment,
    location: rev.location || "India",
    verified: rev.verified,
    helpful_count: rev.helpfulCount,
    avatar_bg: rev.avatarBg || null,
  };
}

// Safe retrieval from localStorage cache
export function getSavedReviews(): Review[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const fakeIds = new Set(["rev-1", "rev-2", "rev-3", "rev-4", "rev-5", "rev-6"]);
      const userReviews = parsed.filter(
        (r): r is Review => Boolean(r && typeof r === "object" && r.id && !fakeIds.has(r.id))
      );

      if (userReviews.length !== parsed.length) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userReviews));
      }

      return userReviews;
    }
    return [];
  } catch (e) {
    console.error("Error reading reviews from localStorage", e);
    return [];
  }
}

// Fetch live reviews from Supabase (falls back to local storage)
export async function fetchReviews(): Promise<Review[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetch error, using local reviews:", error.message);
        return getSavedReviews();
      }

      if (data) {
        const liveReviews = data.map(mapRowToReview);
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(liveReviews));
        }
        return liveReviews;
      }
    } catch (err) {
      console.warn("Failed fetching reviews from Supabase:", err);
    }
  }

  return getSavedReviews();
}

// Save a new review to Supabase + localStorage cache
export async function saveNewReview(
  reviewData: Omit<Review, "id" | "date" | "helpfulCount">
): Promise<Review> {
  const existing = getSavedReviews();
  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const avatarColors = [
    "bg-amber-100 text-amber-900 border-amber-300",
    "bg-rose-100 text-rose-900 border-rose-300",
    "bg-emerald-100 text-emerald-900 border-emerald-300",
    "bg-blue-100 text-blue-900 border-blue-300",
    "bg-purple-100 text-purple-900 border-purple-300",
    "bg-teal-100 text-teal-900 border-teal-300",
  ];
  const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  const newReview: Review = {
    ...reviewData,
    id: `rev-${Date.now()}`,
    date: dateFormatted,
    helpfulCount: 0,
    avatarBg: randomColor,
  };

  // 1. Immediately cache locally
  const updated = [newReview, ...existing.filter((r) => r.id !== newReview.id)];
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("amoristartsy_reviews_updated"));
    }
  } catch (e) {
    console.error("Error saving review to local cache", e);
  }

  // 2. Persist to Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const row = mapReviewToRow(newReview);
      const { error } = await supabase.from("reviews").insert([row]);
      if (error) {
        console.error("Supabase review insert error:", error);
      }
    } catch (err) {
      console.error("Failed pushing review to Supabase:", err);
    }
  }

  return newReview;
}

// Mark helpful count
export async function incrementReviewHelpful(reviewId: string): Promise<void> {
  // Update local cache
  const reviews = getSavedReviews();
  const target = reviews.find((r) => r.id === reviewId);
  const newCount = (target?.helpfulCount || 0) + 1;

  const updated = reviews.map((r) =>
    r.id === reviewId ? { ...r, helpfulCount: newCount } : r
  );

  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("amoristartsy_reviews_updated"));
  }

  // Sync to Supabase
  if (isSupabaseConfigured && supabase && target) {
    try {
      await supabase
        .from("reviews")
        .update({ helpful_count: newCount })
        .eq("id", reviewId);
    } catch (err) {
      console.warn("Failed updating helpful count in Supabase:", err);
    }
  }
}

export const incrementHelpful = incrementReviewHelpful;
