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
}

export const INITIAL_REVIEWS: Review[] = [];

const LOCAL_STORAGE_KEY = "amoristartsy_reviews_v1";

// Safe retrieval from localStorage - only returns reviews created by the user
export function getSavedReviews(): Review[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Filter out any old mock/seed review IDs (rev-1 through rev-6)
      const fakeIds = new Set(["rev-1", "rev-2", "rev-3", "rev-4", "rev-5", "rev-6"]);
      const userReviews = parsed.filter(
        (r): r is Review => Boolean(r && typeof r === "object" && r.id && !fakeIds.has(r.id))
      );

      // If fake reviews were lingering in the user's browser localStorage, clean them up permanently
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

// Save a new review to localStorage
export function saveNewReview(reviewData: Omit<Review, "id" | "date" | "helpfulCount">): Review {
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

  const updated = [newReview, ...existing];
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("amoristartsy_reviews_updated"));
    }
  } catch (e) {
    console.error("Error saving review to localStorage", e);
  }

  return newReview;
}

// Mark helpful
export function incrementReviewHelpful(reviewId: string): void {
  if (typeof window === "undefined") return;
  try {
    const reviews = getSavedReviews();
    const updated = reviews.map((r) =>
      r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("amoristartsy_reviews_updated"));
  } catch (e) {
    console.error("Error updating helpful count", e);
  }
}

export const incrementHelpful = incrementReviewHelpful;

